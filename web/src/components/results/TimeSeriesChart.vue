<template>
	<div ref="chartRef" style="width: 100%; height: 95%;"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const TIME_UNIT_MAP = {
	SECONDS: '秒', MINUTES: '分钟', HOURS: '小时',
	DAYS: '天', WEEKS: '周', MONTHS: '月', YEARS: '年',
	seconds: '秒', minutes: '分钟', hours: '小时',
	days: '天', weeks: '周', months: '月', years: '年'
};

const props = defineProps({
	results: { type: Object, required: true }
});

const chartRef = ref(null);
let chart = null;

function handleResize() {
	chart?.resize();
}

function renderChart() {
	if (!chart || !props.results) return;

	const { times, series, timeUnits } = props.results;
	const seriesNames = Object.keys(series);

	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'cross' },
			textStyle: { fontSize: 13 },
			backgroundColor: 'rgba(255,255,255,0.96)',
			borderColor: '#e2e6ef',
			borderWidth: 1,
			appendTo: document.body
		},
		legend: {
			data: seriesNames,
			top: 0,
			textStyle: { fontSize: 13, color: '#5a6178' },
			selector: [
				{ type: 'all', title: '全选' },
				{ type: 'inverse', title: '反选' }
			],
			selectorLabel: {
				fontSize: 12
			}
		},
		grid: {
			left: 70,
			right: 30,
			top: 45,
			bottom: 55
		},
		xAxis: {
			type: 'category',
			data: times.map(t => Number(t.toFixed(2))),
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
			{ type: 'slider', xAxisIndex: 0, height: 18, bottom: 5, borderColor: '#e2e6ef', fillerColor: 'rgba(79, 110, 247, 0.15)', handleStyle: { color: '#4f6ef7' } }
		],
		color: ['#4f6ef7', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'],
		series: seriesNames.map(name => ({
			name,
			type: 'line',
			data: series[name].map(v => Number(v?.toFixed?.(6) ?? v)),
			smooth: true,
			symbol: 'none',
			lineStyle: { width: 2.5 },
			areaStyle: { opacity: 0.06 },
			emphasis: { lineStyle: { width: 4 } }
		}))
	};

	chart.setOption(option, true);
}

onMounted(() => {
	if (chartRef.value) {
		chart = echarts.init(chartRef.value);
		renderChart();
		window.addEventListener('resize', handleResize);
	}
});

onUnmounted(() => {
	window.removeEventListener('resize', handleResize);
	if (chart) {
		chart.dispose();
		chart = null;
	}
});

watch(() => props.results, renderChart, { deep: true });
</script>
