<template>
  <div class="property-panel">
    <template v-if="selectedElement">
      <div class="panel-header">
        <el-tag :type="tagType" size="small">{{ typeLabel }}</el-tag>
        <span class="element-name">{{ selectedElement.name || '未命名' }}</span>
      </div>

      <el-divider style="margin: 8px 0" />

      <el-form label-position="top" size="default">
        <el-form-item label="名称">
          <el-input v-model="name" @change="onNameChange" placeholder="元素名称" />
        </el-form-item>

        <!-- Stock properties -->
        <template v-if="selectedElement.type === 'STOCK'">
          <el-form-item label="初始值">
            <EquationEditor v-model="initialValue" :rows="2" :variables="elementVariables" @change="onBehaviorChange('initial_value', initialValue)" />
          </el-form-item>
          <el-form-item label="单位">
            <el-select v-model="units" filterable allow-create default-first-option clearable placeholder="选择或输入单位" @change="onBehaviorChange('units', units)">
              <el-option-group v-for="group in UNIT_GROUPS" :key="group.label" :label="group.label">
                <el-option v-for="u in group.options" :key="u.value" :label="u.label" :value="u.value" />
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="非负">
            <el-switch v-model="nonNegative" @change="onBehaviorChange('non_negative', nonNegative)" />
          </el-form-item>
        </template>

        <!-- Variable properties -->
        <template v-if="selectedElement.type === 'VARIABLE' || selectedElement.type === 'INTERVARIABLE'">
          <el-form-item label="方程">
            <EquationEditor v-model="equation" :rows="3" :variables="elementVariables" @change="onBehaviorChange('value', equation)" />
          </el-form-item>
          <el-form-item label="单位">
            <el-select v-model="units" filterable allow-create default-first-option clearable placeholder="选择或输入单位" @change="onBehaviorChange('units', units)">
              <el-option-group v-for="group in UNIT_GROUPS" :key="group.label" :label="group.label">
                <el-option v-for="u in group.options" :key="u.value" :label="u.label" :value="u.value" />
              </el-option-group>
            </el-select>
          </el-form-item>
        </template>

        <!-- Converter properties -->
        <template v-if="selectedElement.type === 'CONVERTER'">
          <el-form-item label="输入源">
            <el-select v-model="inputSource" @change="onBehaviorChange('input', inputSource)">
              <el-option label="时间" value="TIME" />
              <el-option label="元素" value="ELEMENT" />
            </el-select>
          </el-form-item>
          <el-form-item label="插值方式">
            <el-select v-model="interpolation" @change="onBehaviorChange('interpolation', interpolation)">
              <el-option label="线性插值" value="LINEAR" />
              <el-option label="离散" value="DISCRETE" />
            </el-select>
          </el-form-item>
          <el-form-item label="数据点">
            <div class="data-table">
              <div class="data-header">
                <span class="data-col">X</span>
                <span class="data-col">Y</span>
                <span class="data-col-btn"></span>
              </div>
              <div v-for="(row, i) in dataPoints" :key="i" class="data-row">
                <el-input-number v-model="row[0]" :controls="false" size="small" style="width: 80px" @change="onDataChange" />
                <el-input-number v-model="row[1]" :controls="false" size="small" style="width: 80px" @change="onDataChange" />
                <el-button type="danger" :icon="Delete" circle size="small" @click="removeDataPoint(i)" />
              </div>
              <el-button size="small" @click="addDataPoint">+ 添加数据点</el-button>
            </div>
          </el-form-item>
          <el-form-item label="单位">
            <el-select v-model="units" filterable allow-create default-first-option clearable placeholder="选择或输入单位" @change="onBehaviorChange('units', units)">
              <el-option-group v-for="group in UNIT_GROUPS" :key="group.label" :label="group.label">
                <el-option v-for="u in group.options" :key="u.value" :label="u.label" :value="u.value" />
              </el-option-group>
            </el-select>
          </el-form-item>
        </template>

        <!-- Flow properties -->
        <template v-if="selectedElement.type === 'FLOW'">
          <el-form-item label="速率方程">
            <EquationEditor v-model="equation" :rows="3" :variables="elementVariables" @change="onBehaviorChange('value', equation)" />
          </el-form-item>
          <el-form-item label="来源">
            <el-tag type="info" size="small">{{ selectedElement.from || '（无 - 源头）' }}</el-tag>
          </el-form-item>
          <el-form-item label="去向">
            <el-tag type="info" size="small">{{ selectedElement.to || '（无 - 汇）' }}</el-tag>
          </el-form-item>
          <el-form-item label="非负">
            <el-switch v-model="nonNegative" @change="onBehaviorChange('non_negative', nonNegative)" />
          </el-form-item>
          <el-form-item label="单位">
            <el-select v-model="units" filterable allow-create default-first-option clearable placeholder="选择或输入单位" @change="onBehaviorChange('units', units)">
              <el-option-group v-for="group in UNIT_GROUPS" :key="group.label" :label="group.label">
                <el-option v-for="u in group.options" :key="u.value" :label="u.label" :value="u.value" />
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="起始标注">
            <el-button-group>
              <el-button :type="signStart === '+' ? 'primary' : ''" size="small" @click="onSignChange('start', '+')">+</el-button>
              <el-button :type="signStart === '-' ? 'danger' : ''" size="small" @click="onSignChange('start', '-')">-</el-button>
              <el-button :type="!signStart ? 'info' : ''" size="small" @click="onSignChange('start', null)">无</el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item label="结束标注">
            <el-button-group>
              <el-button :type="signEnd === '+' ? 'primary' : ''" size="small" @click="onSignChange('end', '+')">+</el-button>
              <el-button :type="signEnd === '-' ? 'danger' : ''" size="small" @click="onSignChange('end', '-')">-</el-button>
              <el-button :type="!signEnd ? 'info' : ''" size="small" @click="onSignChange('end', null)">无</el-button>
            </el-button-group>
          </el-form-item>
        </template>

        <!-- Link properties -->
        <template v-if="selectedElement.type === 'LINK'">
          <el-form-item label="来源">
            <el-tag type="info" size="small">{{ selectedElement.from || '无' }}</el-tag>
          </el-form-item>
          <el-form-item label="去向">
            <el-tag type="info" size="small">{{ selectedElement.to || '无' }}</el-tag>
          </el-form-item>
          <el-form-item label="起始标注">
            <el-button-group>
              <el-button :type="signStart === '+' ? 'primary' : ''" size="small" @click="onSignChange('start', '+')">+</el-button>
              <el-button :type="signStart === '-' ? 'danger' : ''" size="small" @click="onSignChange('start', '-')">-</el-button>
              <el-button :type="!signStart ? 'info' : ''" size="small" @click="onSignChange('start', null)">无</el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item label="结束标注">
            <el-button-group>
              <el-button :type="signEnd === '+' ? 'primary' : ''" size="small" @click="onSignChange('end', '+')">+</el-button>
              <el-button :type="signEnd === '-' ? 'danger' : ''" size="small" @click="onSignChange('end', '-')">-</el-button>
              <el-button :type="!signEnd ? 'info' : ''" size="small" @click="onSignChange('end', null)">无</el-button>
            </el-button-group>
          </el-form-item>
        </template>

        <!-- State properties -->
        <template v-if="selectedElement.type === 'STATE'">
          <el-form-item label="初始激活">
            <el-switch v-model="initiallyActive" @change="onBehaviorChange('initial_value', initiallyActive)" />
          </el-form-item>
        </template>

      </el-form>
    </template>

    <template v-else>
      <div class="empty-panel">
        <p>选择一个元素以编辑其属性</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { Delete } from '@element-plus/icons-vue';
import { useModelStore } from '../../stores/model.js';
import { useEditorStore } from '../../stores/editor.js';
import { TYPE_LABELS } from '../../utils/constants.js';
import EquationEditor from './EquationEditor.vue';
import { UNIT_GROUPS } from '../../utils/units.js';

const modelStore = useModelStore();
const editorStore = useEditorStore();

const selectedElement = computed(() => {
  const idx = editorStore.selectedElementIndex;
  if (idx === null || idx < 0) return null;
  return modelStore.modelJSON.elements[idx] || null;
});

const typeLabel = computed(() => {
  const type = selectedElement.value?.type;
  return TYPE_LABELS[type] || type || '';
});

const tagType = computed(() => {
  const type = selectedElement.value?.type;
  if (type === 'STOCK') return 'primary';
  if (type === 'VARIABLE') return 'warning';
  if (type === 'INTERVARIABLE') return 'success';
  if (type === 'CONVERTER') return 'danger';
  if (type === 'STATE') return 'success';
  return 'info';
});

const elementVariables = computed(() => {
  const el = selectedElement.value;
  if (!el || !el.name) return [];
  const vars = [];
  const seen = new Set();

  if (el.type === 'FLOW') {
    if (el.from && !seen.has(el.from)) { seen.add(el.from); vars.push({ name: el.from }); }
    if (el.to && !seen.has(el.to)) { seen.add(el.to); vars.push({ name: el.to }); }
    const targets = new Set([el.name, el.from, el.to].filter(Boolean));
    for (const e of modelStore.modelJSON.elements) {
      if (e.type !== 'LINK') continue;
      if (targets.has(e.to) && e.from && !seen.has(e.from)) { seen.add(e.from); vars.push({ name: e.from }); }
      if (targets.has(e.from) && e.to && !seen.has(e.to)) { seen.add(e.to); vars.push({ name: e.to }); }
    }
  } else {
    for (const e of modelStore.modelJSON.elements) {
      if (!['FLOW', 'LINK'].includes(e.type)) continue;
      if (e.to === el.name && e.from && !seen.has(e.from)) { seen.add(e.from); vars.push({ name: e.from }); }
      if (e.from === el.name && e.to && !seen.has(e.to)) { seen.add(e.to); vars.push({ name: e.to }); }
    }
  }

  return vars;
});

const name = ref('');
const initialValue = ref('');
const equation = ref('');
const units = ref('');
const nonNegative = ref(false);
const initiallyActive = ref(false);
const inputSource = ref('TIME');
const interpolation = ref('LINEAR');
const dataPoints = ref([]);
const signStart = ref(null);
const signEnd = ref(null);

watch(selectedElement, (el) => {
  if (!el) return;
  name.value = el.name || '';
  const b = el.behavior || {};
  initialValue.value = b.initial_value ?? '';
  equation.value = b.value ?? '';
  units.value = b.units ?? '';
  nonNegative.value = b.non_negative ?? false;
  initiallyActive.value = b.initial_value ?? false;
  inputSource.value = b.input ?? 'TIME';
  interpolation.value = b.interpolation ?? 'LINEAR';
  dataPoints.value = (b.data || []).map(p => [...p]);
  const d = el.display || {};
  signStart.value = d.signStart || null;
  signEnd.value = d.signEnd || null;
}, { immediate: true });

function onNameChange() {
  const idx = editorStore.selectedElementIndex;
  modelStore.updateElement(idx, { name: name.value });
}

function onBehaviorChange(key, val) {
  const idx = editorStore.selectedElementIndex;
  modelStore.updateElement(idx, { behavior: { [key]: val } });
}

function onDataChange() {
  const idx = editorStore.selectedElementIndex;
  modelStore.updateElement(idx, { behavior: { data: dataPoints.value.map(p => [...p]) } });
}

function addDataPoint() {
  dataPoints.value.push([0, 0]);
  onDataChange();
}

function removeDataPoint(i) {
  dataPoints.value.splice(i, 1);
  onDataChange();
}

function deleteElement() {
  const idx = editorStore.selectedElementIndex;
  modelStore.removeElement(idx);
  editorStore.clearSelection();
}

function onSignChange(position, sign) {
  const idx = editorStore.selectedElementIndex;
  if (position === 'start') {
    signStart.value = sign;
  } else {
    signEnd.value = sign;
  }
  modelStore.updateElement(idx, { display: { signStart: signStart.value, signEnd: signEnd.value } });
}
</script>

<style scoped>
.property-panel {
  width: 340px;
  min-width: 340px;
  background: var(--bg-panel);
  border-left: 1px solid var(--border-color);
  padding: 16px;
  overflow-y: auto;
  font-size: 14px;
  box-shadow: var(--shadow-sm);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 4px;
}

.element-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

.empty-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-muted);
  font-size: 15px;
  background: var(--bg-card);
  border-radius: 10px;
  border: 1px dashed var(--border-color);
}

.data-table {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.data-header {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-muted);
}

.data-col {
  width: 80px;
  text-align: center;
}

.data-col-btn {
  width: 24px;
}

.data-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.property-panel :deep(.el-form) {
  width: 100%;
}

.property-panel :deep(.el-form-item) {
  width: 100%;
}

.property-panel :deep(.el-form-item__content) {
  width: 100%;
}

.property-panel :deep(.el-textarea) {
  display: block;
}

.property-panel :deep(.el-textarea__inner) {
  width: 100% !important;
  box-sizing: border-box;
}

.property-panel :deep(.el-divider) {
  border-color: var(--border-light);
}

.property-panel :deep(.el-form-item__label) {
  color: var(--text-secondary);
  font-weight: 500;
}
</style>
