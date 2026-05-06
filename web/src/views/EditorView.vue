<template>
  <div class="editor-layout">
    <AppHeader />
    <div class="editor-body">
      <AppSidebar />
      <div class="editor-main">
        <div class="canvas-toolbar">
          <el-button-group size="small">
            <el-button :icon="RefreshLeft" @click="canvasRef?.undo()" :disabled="!undoAvailable" plain>上一步</el-button>
            <el-button :icon="RefreshRight" @click="canvasRef?.redo()" :disabled="!redoAvailable" plain>下一步</el-button>
          </el-button-group>
          <el-button :icon="Delete" size="small" @click="handleClearCanvas" plain>清空画布</el-button>
        </div>
        <SDCanvas ref="canvasRef" @ready="onCanvasReady" @history-change="onHistoryChange" />
        <ResultsPanel />
      </div>
      <PropertyPanel />
    </div>
    <Dialogs @model-loaded="onModelLoaded" />
    <CompareDialog />
    <HelpGuide />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RefreshLeft, RefreshRight, Delete } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import AppHeader from '../components/layout/AppHeader.vue';
import AppSidebar from '../components/layout/AppSidebar.vue';
import PropertyPanel from '../components/properties/PropertyPanel.vue';
import SDCanvas from '../components/canvas/SDCanvas.vue';
import ResultsPanel from '../components/results/ResultsPanel.vue';
import Dialogs from '../components/dialogs/Dialogs.vue';
import CompareDialog from '../components/dialogs/CompareDialog.vue';
import HelpGuide from '../components/dialogs/HelpGuide.vue';
import { useModelStore } from '../stores/model.js';

const modelStore = useModelStore();
const canvasRef = ref(null);
let graph = null;

const undoAvailable = ref(false);
const redoAvailable = ref(false);

function onCanvasReady(g) {
  graph = g;
}

function onModelLoaded() {
  if (canvasRef.value && graph) {
    canvasRef.value.loadGraph(modelStore.modelJSON);
  }
}

function onHistoryChange({ canUndo, canRedo }) {
  undoAvailable.value = canUndo;
  redoAvailable.value = canRedo;
}

async function handleClearCanvas() {
  try {
    await ElMessageBox.confirm('确定要清空画布吗？此操作不可撤销。', '清空画布', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    canvasRef.value?.clearCanvas();
  } catch {
    // cancelled
  }
}
</script>

<style scoped>
.editor-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.editor-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.canvas-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}
</style>
