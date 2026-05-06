<template>
  <div class="app-sidebar">
    <div class="sidebar-title">图元面板</div>
    <div class="palette-section">
      <div class="palette-section-title">节点</div>
      <div
        v-for="item in nodeItems"
        :key="item.type"
        class="palette-item"
        draggable="true"
        @dragstart="onDragStart($event, item.type)"
      >
        <div class="palette-icon" :style="{ borderColor: item.color.stroke, backgroundColor: item.color.fill }">
          <span :style="{ color: item.color.text }">{{ item.icon }}</span>
        </div>
        <span class="palette-label">{{ item.label }}</span>
      </div>
    </div>

    <div class="palette-section">
      <div class="palette-section-title">连接线</div>
      <div
        v-for="item in edgeItems"
        :key="item.type"
        class="palette-item"
        :class="{ active: editorStore.currentEdgeType === item.type }"
        @click="selectEdgeTool(item.type)"
      >
        <div class="palette-icon" :style="{ borderColor: item.color.stroke, backgroundColor: '#fff' }">
          <span :style="{ color: item.color.stroke }">{{ item.icon }}</span>
        </div>
        <span class="palette-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { COLORS, LABELS } from '../../utils/constants.js';
import { useEditorStore } from '../../stores/editor.js';

const editorStore = useEditorStore();

const nodeItems = [
  { type: 'STOCK', icon: 'S', label: LABELS.STOCK, color: COLORS.STOCK },
  { type: 'VARIABLE', icon: 'V', label: LABELS.VARIABLE, color: COLORS.VARIABLE },
  { type: 'CONVERTER', icon: 'C', label: LABELS.CONVERTER, color: COLORS.CONVERTER },
];

const edgeItems = [
  { type: 'FLOW', icon: '→', label: LABELS.FLOW, color: COLORS.FLOW },
  { type: 'LINK', icon: '- -→', label: LABELS.LINK, color: COLORS.LINK }
];

function onDragStart(event, type) {
  event.dataTransfer.setData('primitive-type', type);
  event.dataTransfer.effectAllowed = 'copy';
}

function selectEdgeTool(type) {
  editorStore.setEdgeType(type);
}
</script>

<style scoped>
.app-sidebar {
  width: 220px;
  min-width: 220px;
  background: var(--bg-panel);
  border-right: 1px solid var(--border-color);
  padding: 16px 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--shadow-sm);
}

.sidebar-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  padding-bottom: 12px;
  border-bottom: 2px solid var(--accent-blue);
  margin-bottom: 4px;
}

.palette-section-title {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 8px 0 2px;
  padding-left: 4px;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
  user-select: none;
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
  margin-bottom: 2px;
}

.palette-item:hover {
  background: var(--bg-card);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.palette-item.active {
  background: #eef0ff;
  outline: 2px solid var(--accent-indigo);
  box-shadow: 0 0 0 1px var(--accent-indigo);
}

.palette-icon {
  width: 40px;
  height: 40px;
  border: 2.5px solid;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: inset 0 1px 2px rgba(255,255,255,0.5);
}

.palette-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}
</style>
