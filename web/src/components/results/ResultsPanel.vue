<template>
  <div class="results-panel" :class="{ 'is-fullscreen': isFullscreen }" v-if="editorStore.showResults">
    <div class="results-header">
      <span class="results-title">模拟结果</span>
      <el-button-group size="default">
        <el-button :type="tab === 'chart' ? 'primary' : ''" @click="tab = 'chart'">图表</el-button>
        <el-button :type="tab === 'table' ? 'primary' : ''" @click="tab = 'table'">数据表</el-button>
      </el-button-group>
      <div class="results-header-right">
        <el-button size="default" :icon="Download" :disabled="!simStore.results" @click="saveResult">保存结果</el-button>
        <el-button size="default" :icon="DataLine" @click="editorStore.showCompareDialog = true">对比</el-button>
        <el-button size="default" :icon="isFullscreen ? Close : FullScreen" @click="toggleFullscreen">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </el-button>
        <el-button size="default" :icon="Close" @click="editorStore.showResults = false" />
      </div>
    </div>

    <div v-if="simStore.status === 'running'" class="results-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>模拟运行中...</span>
    </div>

    <div v-else-if="simStore.status === 'error'" class="results-error">
      <el-alert :title="simStore.error?.message || '模拟失败'" type="error" show-icon :closable="false" />
    </div>

    <div v-else-if="simStore.results" class="results-content" ref="contentRef">
      <div v-if="tab === 'chart'" class="chart-container">
        <TimeSeriesChart :results="simStore.results" ref="chartRef" />
      </div>
      <div v-if="tab === 'table'" class="table-container">
        <DataTable :results="simStore.results" :max-height="isFullscreen ? tableMaxHeight : 350" />
      </div>
    </div>

    <div v-else class="results-empty">
      <p>点击"运行"开始模拟</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from 'vue';
import { Close, Loading, FullScreen, Download, DataLine } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useEditorStore } from '../../stores/editor.js';
import { useSimulationStore } from '../../stores/simulation.js';
import { useResultsHistoryStore } from '../../stores/resultsHistory.js';
import { useModelStore } from '../../stores/model.js';
import TimeSeriesChart from './TimeSeriesChart.vue';
import DataTable from './DataTable.vue';

const editorStore = useEditorStore();
const simStore = useSimulationStore();
const historyStore = useResultsHistoryStore();
const modelStore = useModelStore();
const tab = ref('chart');
const isFullscreen = ref(false);
const contentRef = ref(null);
const tableMaxHeight = computed(() => window.innerHeight - 60);

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  nextTick(() => {
    window.dispatchEvent(new Event('resize'));
  });
  if (isFullscreen.value) {
    document.addEventListener('keydown', onEsc);
  } else {
    document.removeEventListener('keydown', onEsc);
  }
}

function onEsc(e) {
  if (e.key === 'Escape') {
    isFullscreen.value = false;
    nextTick(() => window.dispatchEvent(new Event('resize')));
    document.removeEventListener('keydown', onEsc);
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEsc);
});

async function saveResult() {
  if (!simStore.results) return;
  try {
    const { value: name } = await ElMessageBox.prompt('请输入结果名称', '保存结果', {
      inputValue: `${modelStore.modelJSON.name} ${new Date().toLocaleTimeString('zh-CN')}`,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    });
    if (name) {
      historyStore.saveResult(name, modelStore.modelJSON.name, simStore.results);
      ElMessage.success('结果已保存');
    }
  } catch { /* cancelled */ }
}
</script>

<style scoped>
.results-panel {
  height: 520px;
  min-height: 380px;
  flex-shrink: 0;
  background: var(--bg-panel);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  box-shadow: 0 -2px 8px rgba(30, 36, 51, 0.06);
}

.results-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
}

.results-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.results-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
  color: var(--accent-blue);
  font-size: 15px;
}

.results-error {
  padding: 16px;
}

.results-content {
  flex: 1;
  overflow: auto;
  background: var(--bg-card);
}

.chart-container {
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
}

.table-container {
  height: 100%;
  overflow: auto;
}

.results-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  background: var(--bg-card);
}

.results-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.results-panel.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 2000;
  height: 100vh;
  min-height: 100vh;
  border: none;
  border-radius: 0;
}
</style>
