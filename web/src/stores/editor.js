import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useEditorStore = defineStore('editor', () => {
  const selectedElementIndex = ref(null);
  const currentEdgeType = ref('LINK'); // 'FLOW', 'LINK'
  const showResults = ref(false);
  const showModelSettings = ref(false);
  const showSaveDialog = ref(false);
  const showLoadDialog = ref(false);
  const showImportDialog = ref(false);
  const showExampleDialog = ref(false);
  const showHelpGuide = ref(false);
  const showCompareDialog = ref(false);

  let _syncPositionsFn = null;

  function selectElement(index) {
    selectedElementIndex.value = index;
  }

  function clearSelection() {
    selectedElementIndex.value = null;
  }

  function setEdgeType(type) {
    currentEdgeType.value = type;
  }

  function toggleResults() {
    showResults.value = !showResults.value;
  }

  function registerSyncPositions(fn) {
    _syncPositionsFn = fn;
  }

  function syncPositions() {
    if (_syncPositionsFn) _syncPositionsFn();
  }

  return {
    selectedElementIndex, currentEdgeType,
    showResults, showModelSettings, showSaveDialog, showLoadDialog,
    showImportDialog, showExampleDialog, showHelpGuide, showCompareDialog,
    selectElement, clearSelection, setEdgeType, toggleResults,
    registerSyncPositions, syncPositions
  };
});
