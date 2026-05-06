<template>
  <div class="app-header">
    <div class="header-left">
      <span class="app-title">系统动力学模拟器</span>
      <el-tag v-if="modelStore.dirty" type="warning" size="small" style="margin-left: 8px;">未保存</el-tag>
    </div>
    <div class="header-center">
      <el-button-group>
        <el-button :icon="VideoPlay" type="success" @click="runSimulation" :loading="simStore.status === 'running'">
          运行
        </el-button>
        <el-button @click="editorStore.toggleResults" :type="editorStore.showResults ? 'primary' : ''">
          结果
        </el-button>
      </el-button-group>
      <el-divider direction="vertical" />
      <el-button-group>
        <el-button :icon="Setting" @click="editorStore.showModelSettings = true">设置</el-button>
        <el-button :icon="FolderOpened" @click="editorStore.showExampleDialog = true">示例</el-button>
        <el-button :icon="QuestionFilled" @click="editorStore.showHelpGuide = true">帮助</el-button>
      </el-button-group>
    </div>
    <div class="header-right">
      <el-button-group>
        <el-button :icon="Download" @click="editorStore.showSaveDialog = true" :disabled="!modelStore.dirty && !modelStore.id">保存</el-button>
        <el-button :icon="FolderOpened" @click="editorStore.showLoadDialog = true">加载</el-button>
        <el-button :icon="Upload" @click="editorStore.showImportDialog = true">导入</el-button>
        <el-button :icon="Download" @click="handleExport">导出</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script setup>
import { VideoPlay, Setting, FolderOpened, Download, Upload, QuestionFilled } from '@element-plus/icons-vue';
import { useModelStore } from '../../stores/model.js';
import { useEditorStore } from '../../stores/editor.js';
import { useSimulationStore } from '../../stores/simulation.js';
import { ElMessage } from 'element-plus';

const modelStore = useModelStore();
const editorStore = useEditorStore();
const simStore = useSimulationStore();

async function runSimulation() {
  try {
    editorStore.syncPositions();
    await simStore.runSimulation(modelStore.exportModelJSON());
    editorStore.showResults = true;
    ElMessage.success('模拟完成');
  } catch (err) {
    ElMessage.error(simStore.error?.message || '模拟失败');
  }
}

function handleExport() {
  editorStore.syncPositions();
  const json = modelStore.exportModelJSON();
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${json.name || 'model'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.app-header {
  height: 56px;
  background: linear-gradient(135deg, var(--header-gradient-from), var(--header-gradient-to));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(26, 31, 54, 0.25);
  position: relative;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 200px;
}

.app-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-center :deep(.el-button) {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
}
.header-center :deep(.el-button:hover) {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.35) !important;
}
.header-center :deep(.el-button--success) {
  background: rgba(82, 196, 26, 0.85) !important;
  border-color: rgba(82, 196, 26, 0.9) !important;
  color: #fff !important;
}
.header-center :deep(.el-button--success:hover) {
  background: rgba(82, 196, 26, 1) !important;
}
.header-center :deep(.el-button--primary) {
  background: rgba(99, 102, 241, 0.85) !important;
  border-color: rgba(99, 102, 241, 0.9) !important;
  color: #fff !important;
}

.header-right {
  display: flex;
  align-items: center;
  min-width: 200px;
  justify-content: flex-end;
}

.header-right :deep(.el-button) {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}
.header-right :deep(.el-button:hover) {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.35) !important;
  color: #fff !important;
}
.header-right :deep(.el-button:disabled) {
  opacity: 0.4 !important;
}
</style>
