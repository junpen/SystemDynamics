<template>
  <el-dialog
    v-model="dialogVisible"
    :title="elementName + ' — 模拟结果'"
    width="640px"
    destroy-on-close
    append-to-body
    class="element-chart-dialog"
  >
    <div v-if="!hasData" class="no-data">暂无模拟结果，请先运行模拟</div>
    <div v-else ref="chartRef" class="element-chart-container"></div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { useSimulationStore } from '../../stores/simulation.js';

const TIME_UNIT_MAP = {
  SECONDS: '秒', MINUTES: '分钟', HOURS: '小时',
  DAYS: '天', WEEKS: '周', MONTHS: '月', YEARS: '年'
};

const simStore = useSimulationStore();

const dialogVisible = ref(false);
const elementName = ref('');
const chartRef = ref(null);
let chart = null;

const hasData = computed(() => {
  if (!simStore.results?.series || !elementName.value) return false;
  return elementName.value in simStore.results.series;
});

function open(name) {
  elementName.value = name;
  dialogVisible.value = true;
}

function renderChart() {
  if (!chart || !hasData.value) return;

  const { times, series, timeUnits } = simStore.results;
  const data = series[elementName.value];

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      textStyle: { fontSize: 13 },
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: '#e2e6ef',
      borderWidth: 1,
      appendTo: document.body,
      formatter(params) {
        const p = Array.isArray(params) ? params[0] : params;
        return `<b>${elementName.value}</b><br/>时间: ${p.axisValue}<br/>值: ${p.data}`;
      }
    },
    grid: { left: 65, right: 25, top: 20, bottom: 50 },
    xAxis: {
      type: 'category',
      data: times.map(t => Number(t.toFixed ? t.toFixed(2) : t)),
      name: TIME_UNIT_MAP[timeUnits] || timeUnits || '时间',
      nameLocation: 'middle',
      nameGap: 24,
      axisLabel: { fontSize: 12, color: '#5a6178' },
      nameTextStyle: { fontSize: 13, color: '#5a6178' },
      axisLine: { lineStyle: { color: '#e2e6ef' } },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 12, color: '#5a6178' },
      nameTextStyle: { fontSize: 13, color: '#5a6178' },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#eef0f6', type: 'dashed' } }
    },
    dataZoom: [
      { type: 'inside', xAxisIndex: 0 },
      { type: 'slider', xAxisIndex: 0, height: 18, bottom: 5, borderColor: '#e2e6ef', fillerColor: 'rgba(79,110,247,0.15)', handleStyle: { color: '#4f6ef7' } }
    ],
    series: [{
      name: elementName.value,
      type: 'line',
      data: data.map(v => Number(v?.toFixed?.(6) ?? v)),
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2.5, color: '#4f6ef7' },
      areaStyle: { opacity: 0.08, color: '#4f6ef7' },
      emphasis: { lineStyle: { width: 4 } }
    }]
  };

  chart.setOption(option, true);
}

watch(dialogVisible, (val) => {
  if (val) {
    nextTick(() => {
      if (chartRef.value) {
        chart = echarts.init(chartRef.value);
        renderChart();
      }
    });
  } else {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  }
});

onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
});

defineExpose({ open });
</script>

<style>
.element-chart-dialog .el-dialog__body {
  padding: 12px 16px 16px !important;
}
</style>

<style scoped>
.element-chart-container {
  width: 100%;
  height: 360px;
}
.no-data {
  text-align: center;
  color: #909399;
  padding: 60px 0;
  font-size: 14px;
}
</style>
