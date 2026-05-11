import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { modelsApi, examplesApi } from '../utils/api.js';
import { createDefaultElement, resetNameCounter } from '../utils/modelJSONAdapter.js';

export const useModelStore = defineStore('model', () => {
  const id = ref(null);
  const dirty = ref(false);

  const modelJSON = ref(createEmptyModel());

  // Callbacks for canvas sync
  let _onDeleteCallbacks = [];

  function createEmptyModel() {
    return {
      name: '未命名模型',
      description: '',
      engine: 'SIMULATION_PACKAGE',
      simulation: {
        algorithm: 'RK4',
        time_start: 0,
        time_length: 10,
        time_step: 1,
        time_units: 'YEARS'
      },
      elements: [],
      groups: [],
      visualizations: []
    };
  }

  const elements = computed(() => modelJSON.value.elements || []);
  const simulation = computed(() => modelJSON.value.simulation);

  function newModel() {
    id.value = null;
    dirty.value = false;
    resetNameCounter();
    modelJSON.value = createEmptyModel();
  }

  let nameCounter = {};

  function loadModelJSON(json) {
    modelJSON.value = { ...createEmptyModel(), ...json };
    dirty.value = false;
    resetNameCounter();
    const namePatterns = {
      STOCK: /^(存量|Stock)\s+(\d+)$/i,
      VARIABLE: /^(变量|Variable)\s+(\d+)$/i,
      CONVERTER: /^(转换器|Converter)\s+(\d+)$/i,
      STATE: /^(状态|State)\s+(\d+)$/i,
      FLOW: /^(流量|Flow)\s+(\d+)$/i,
      LINK: /^(连接|Link)\s+(\d+)$/i
    };
    for (const el of modelJSON.value.elements) {
      if (el.name) {
        for (const [type, pattern] of Object.entries(namePatterns)) {
          const match = el.name.match(pattern);
          if (match) {
            const num = parseInt(match[2]);
            if (!nameCounter[type] || nameCounter[type] < num) {
              nameCounter[type] = num;
            }
          }
        }
      }
    }
  }

  function addElement(type, displayOverrides = {}) {
    const el = createDefaultElement(type, { display: displayOverrides });
    modelJSON.value.elements.push(el);
    dirty.value = true;
    return modelJSON.value.elements.length - 1;
  }

  function updateElement(index, updates) {
    if (index < 0 || index >= modelJSON.value.elements.length) return;
    const el = modelJSON.value.elements[index];
    const updated = {
      ...el,
      ...updates,
      behavior: { ...el.behavior, ...(updates.behavior || {}) },
      display: { ...el.display, ...(updates.display || {}) }
    };
    modelJSON.value.elements[index] = updated;

    // When a node is renamed, update all references to the old name
    if (updates.name !== undefined && updates.name !== el.name && el.name && !['FLOW', 'LINK'].includes(el.type)) {
      const oldName = el.name;
      const newName = updates.name;
      const bracketOld = `[${oldName}]`;

      for (let i = 0; i < modelJSON.value.elements.length; i++) {
        if (i === index) continue;
        const e = modelJSON.value.elements[i];
        let changed = false;

        // Edge from/to
        if (['FLOW', 'LINK'].includes(e.type)) {
          if (e.from === oldName) { e.from = newName; changed = true; }
          if (e.to === oldName) { e.to = newName; changed = true; }
        }

        // Formula references: [oldName] → [newName]
        if (typeof e.behavior?.value === 'string' && e.behavior.value.includes(bracketOld)) {
          e.behavior.value = e.behavior.value.replaceAll(bracketOld, `[${newName}]`);
          changed = true;
        }

        // Converter input_element
        if (e.behavior?.input_element === oldName) {
          e.behavior.input_element = newName;
          changed = true;
        }

        if (changed) {
          modelJSON.value.elements[i] = { ...e, behavior: { ...e.behavior } };
        }
      }
    }

    dirty.value = true;
  }

  function removeElement(index) {
    if (index < 0 || index >= modelJSON.value.elements.length) return;
    const removed = modelJSON.value.elements[index];

    // Notify canvas to remove the cell and rebuild indexes BEFORE we splice
    for (const cb of _onDeleteCallbacks) {
      cb(index, removed);
    }

    // Remove the element
    modelJSON.value.elements.splice(index, 1);

    // Remove edges referencing removed node by name
    if (removed.name) {
      for (let i = modelJSON.value.elements.length - 1; i >= 0; i--) {
        const el = modelJSON.value.elements[i];
        if ((el.from === removed.name || el.to === removed.name) &&
            ['FLOW', 'LINK'].includes(el.type)) {
          // Notify canvas about cascading edge deletions too
          for (const cb of _onDeleteCallbacks) {
            cb(i, el);
          }
          modelJSON.value.elements.splice(i, 1);
        }
      }
    }
    dirty.value = true;
  }

  /**
   * Register a callback invoked when an element is deleted.
   * Callback receives (deletedIndex, deletedElement).
   * Used by SDCanvas to remove the corresponding X6 cell
   * and rebuild elementIndex mapping for all remaining cells.
   */
  function onDeleteElement(cb) {
    _onDeleteCallbacks.push(cb);
  }

  function updateSimulationSettings(settings) {
    modelJSON.value.simulation = { ...modelJSON.value.simulation, ...settings };
    dirty.value = true;
  }

  function updateName(name) {
    modelJSON.value.name = name;
    dirty.value = true;
  }

  function exportModelJSON() {
    return JSON.parse(JSON.stringify(modelJSON.value));
  }

  async function save() {
    const json = exportModelJSON();
    let result;
    if (id.value) {
      result = await modelsApi.update(id.value, json);
    } else {
      result = await modelsApi.create(json);
    }
    id.value = result.data.id;
    dirty.value = false;
    return result.data;
  }

  async function load(modelId) {
    const res = await modelsApi.get(modelId);
    id.value = modelId;
    loadModelJSON(res.data);
  }

  return {
    id, dirty, modelJSON, elements, simulation,
    newModel, loadModelJSON, addElement, updateElement, removeElement,
    onDeleteElement, updateSimulationSettings, updateName, exportModelJSON, save, load
  };
});
