<template>
	<el-dialog v-model="editorStore.showCompareDialog" title="结果对比" width="90%" top="5vh" :fullscreen="isFullscreen" :close-on-press-escape="!isFullscreen" destroy-on-close>
		<div class="compare-layout" :class="{ 'is-fullscreen': isFullscreen }">
			<div class="compare-sidebar">
				<div class="sidebar-header">
					<span class="sidebar-title">已保存结果 ({{ historyStore.records.length }})</span>
					<el-button size="small" type="danger" :disabled="historyStore.records.length === 0" @click="handleClearAll">清空</el-button>
				</div>
				<div class="result-list" v-if="historyStore.records.length > 0">
					<div v-for="rec in historyStore.records" :key="rec.id" class="result-item" :class="{ selected: selectedIds.has(rec.id) }">
						<el-checkbox :model-value="selectedIds.has(rec.id)" @change="(val) => toggleSelect(rec.id, val)" />
						<div class="result-info" @click="toggleSelect(rec.id, !selectedIds.has(rec.id))">
							<div class="result-name">{{ rec.name }}</div>
							<div class="result-meta">{{ rec.modelName }} · {{ formatDate(rec.timestamp) }}</div>
						</div>
						<el-button size="small" :icon="Delete" type="danger" text @click.stop="handleDelete(rec.id)" />
					</div>
				</div>
				<div v-else class="result-empty">暂无保存的结果</div>
			</div>
			<div class="compare-main">
				<div class="compare-toolbar">
					<el-button type="primary" :disabled="selectedRecords.length < 2" @click="renderCompare">
						对比选中 ({{ selectedRecords.length }})
					</el-button>
					<el-button :disabled="selectedRecords.length === 0" @click="exportJSON">
						导出 JSON
					</el-button>
					<el-button :disabled="selectedRecords.length === 0" @click="exportCSV">
						导出 CSV
					</el-button>
					<el-button :icon="FullScreen" @click="toggleFullscreen">
						{{ isFullscreen ? '退出全屏' : '全屏' }}
					</el-button>
				</div>
				<div v-if="compareData" class="compare-chart-area">
					<div class="compare-tags" v-if="variableNames.length > 0">
						<span class="tags-label">变量：</span>
						<el-tag
							v-for="vn in variableNames"
							:key="vn"
							:type="activeVariable === vn ? '' : 'info'"
							:effect="activeVariable === vn ? 'dark' : 'plain'"
							class="var-tag"
							@click="toggleVariable(vn)"
						>{{ vn }}</el-tag>
					</div>
					<div class="compare-chart-container" ref="chartContainerRef">
						<div ref="chartRef" style="width: 100%; height: 100%;"></div>
					</div>
					<div v-if="detailVariable && detailData.length" class="compare-detail">
						<div class="detail-header">
							<span class="detail-title">变量详情：{{ detailVariable }}</span>
							<el-button size="small" text @click="hideDetail">关闭</el-button>
						</div>
						<div class="detail-table-wrap">
							<table class="detail-table">
								<thead>
									<tr>
										<th>时间</th>
										<th v-for="col in detailColumns" :key="col">{{ col }}</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(row, i) in detailData" :key="i">
										<td>{{ row.time }}</td>
										<td v-for="col in detailColumns" :key="col">{{ row[col] }}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div v-else class="compare-placeholder">
					<p>请从左侧选择 2 组以上结果，然后点击"对比选中"</p>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<script setup>
import * as echarts from 'echarts';
import { Delete, FullScreen } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue';
import { useEditorStore } from '../../stores/editor.js';
import { useResultsHistoryStore } from '../../stores/resultsHistory.js';

const editorStore = useEditorStore();
const historyStore = useResultsHistoryStore();

const selectedIds = ref(new Set());
const compareData = ref(null);
const chartRef = ref(null);
const chartContainerRef = ref(null);
let chart = null;

const variableNames = ref([]);
const activeVariable = ref(null);
let allSeriesNames = [];

const detailVariable = ref(null);
const detailColumns = ref([]);
const detailData = ref([]);

const isFullscreen = ref(false);

const selectedRecords = computed(() => {
	return historyStore.records.filter(r => selectedIds.value.has(r.id));
});

function toggleFullscreen() {
	isFullscreen.value = !isFullscreen.value;
	nextTick(() => chart?.resize());
	if (isFullscreen.value) {
		document.addEventListener('keydown', onEsc);
	} else {
		document.removeEventListener('keydown', onEsc);
	}
}

function onEsc(e) {
	if (e.key === 'Escape') {
		isFullscreen.value = false;
		nextTick(() => chart?.resize());
		document.removeEventListener('keydown', onEsc);
	}
}

function toggleSelect(id, val) {
	const s = new Set(selectedIds.value);
	if (val) s.add(id); else s.delete(id);
	selectedIds.value = s;
}

async function handleDelete(id) {
	await historyStore.deleteResult(id);
	selectedIds.value = new Set([...selectedIds.value].filter(i => i !== id));
	compareData.value = null;
}

async function handleClearAll() {
	try {
		await ElMessageBox.confirm('确定清空所有保存的结果？', '提示', { type: 'warning' });
		await historyStore.clearAll();
		selectedIds.value = new Set();
		compareData.value = null;
	} catch { /* cancelled */ }
}

const COLORS = ['#4f6ef7', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

function renderCompare() {
	const records = selectedRecords.value;
	if (records.length < 2) {
		ElMessage.warning('请至少选择 2 组结果');
		return;
	}

	compareData.value = records;
	activeVariable.value = null;
	detailVariable.value = null;

	// Extract merged variable names
	const varSet = new Set();
	records.forEach(r => {
		Object.keys(r.results?.series || {}).forEach(k => varSet.add(k));
	});
	variableNames.value = [...varSet];

	nextTick(() => {
		if (!chartRef.value) return;
		if (chart) { chart.dispose(); chart = null; }
		chart = echarts.init(chartRef.value);

		const maxLen = Math.max(...records.map(r => (r.results?.times?.length || 0)));
		const times = records[0]?.results?.times || [];
		const xAxisData = times.slice(0, maxLen).map(t => Number(t.toFixed(2)));
		const timeUnits = records[0]?.results?.timeUnits || '';

		const series = [];
		allSeriesNames = [];
		records.forEach((rec, ri) => {
			const recSeries = rec.results?.series || {};
			const color = COLORS[ri % COLORS.length];
			Object.keys(recSeries).forEach((name, si) => {
				const seriesName = `${rec.name} · ${name}`;
				allSeriesNames.push({ seriesName, varName: name, resultName: rec.name });
				const data = recSeries[name].map(v => Number(v?.toFixed?.(6) ?? v));
				let paddedData = data;
				if (data.length < maxLen) {
					paddedData = [...data];
					while (paddedData.length < maxLen) paddedData.push(null);
				}
				series.push({
					name: seriesName,
					type: 'line',
					data: paddedData,
					smooth: true,
					symbol: 'none',
					lineStyle: { width: 2.5, color },
					areaStyle: { opacity: 0.04, color },
					emphasis: { lineStyle: { width: 4 } }
				});
			});
		});

		const legendSelected = {};
		allSeriesNames.forEach(({ seriesName, varName }) => {
			legendSelected[seriesName] = varName === variableNames.value[0];
		});
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
			legend: { show: false, selected: legendSelected },
			grid: { left: 70, right: 30, top: 20, bottom: 60 },
			xAxis: {
				type: 'category',
				data: xAxisData,
				name: timeUnits || '时间',
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
			series
		};

		chart.setOption(option, true);
		if (variableNames.value.length > 0) {
			activeVariable.value = variableNames.value[0];
			showVariableDetail(variableNames.value[0], records);
		}
		window.addEventListener('resize', handleResize);
	});
}

function toggleVariable(varName) {
	if (activeVariable.value === varName) {
		activeVariable.value = null;
		showAllSeries();
		hideDetail();
	} else {
		activeVariable.value = varName;
		filterByVariable(varName);
		showVariableDetail(varName, compareData.value);
	}
}

function filterByVariable(varName) {
	if (!chart) return;
	allSeriesNames.forEach(({ seriesName, varName: vn }) => {
		chart.dispatchAction({
			type: vn === varName ? 'legendSelect' : 'legendUnSelect',
			name: seriesName
		});
	});
}

function showAllSeries() {
	if (!chart) return;
	allSeriesNames.forEach(({ seriesName }) => {
		chart.dispatchAction({ type: 'legendSelect', name: seriesName });
	});
}

function showVariableDetail(varName, records) {
	detailVariable.value = varName;
	detailColumns.value = records.map(r => r.name);

	const maxLen = Math.max(...records.map(r => r.results?.times?.length || 0));
	const times = records[0]?.results?.times || [];
	const rows = [];

	for (let i = 0; i < maxLen; i++) {
		const row = { time: times[i]?.toFixed(2) ?? '' };
		records.forEach(rec => {
			const val = rec.results?.series?.[varName]?.[i];
			row[rec.name] = val !== undefined && val !== null ? Number(val.toFixed(6)) : '-';
		});
		rows.push(row);
	}
	detailData.value = rows;

	nextTick(() => chart?.resize());
}

function hideDetail() {
	detailVariable.value = null;
	nextTick(() => chart?.resize());
}

function exportJSON() {
	const records = selectedRecords.value;
	if (records.length === 0) return;
	const data = records.map(r => ({ name: r.name, modelName: r.modelName, timestamp: r.timestamp, results: r.results }));
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
	downloadBlob(blob, `simulation_results_${Date.now()}.json`);
}

function exportCSV() {
	const records = selectedRecords.value;
	if (records.length === 0) return;

	const allKeys = new Set();
	records.forEach(r => {
		if (r.results?.series) Object.keys(r.results.series).forEach(k => allKeys.add(`[${r.name}] ${k}`));
	});
	const headers = ['时间', ...allKeys];
	const maxLen = Math.max(...records.map(r => r.results?.times?.length || 0));
	const rows = [headers.join(',')];

	for (let i = 0; i < maxLen; i++) {
		const row = [records[0]?.results?.times?.[i]?.toFixed(2) ?? ''];
		records.forEach(r => {
			if (r.results?.series) {
				Object.keys(r.results.series).forEach(k => {
					const val = r.results.series[k][i];
					row.push(val !== undefined && val !== null ? val : '');
				});
			}
		});
		rows.push(row.join(','));
	}

	const blob = new Blob(['﻿' + rows.join('\n')], { type: 'text/csv;charset=utf-8' });
	downloadBlob(blob, `simulation_results_${Date.now()}.csv`);
}

function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

function formatDate(dateStr) {
	if (!dateStr) return '';
	return new Date(dateStr).toLocaleString('zh-CN');
}

function handleResize() {
	chart?.resize();
}

watch(() => editorStore.showCompareDialog, (val) => {
	if (val) {
		compareData.value = null;
		selectedIds.value = new Set();
		activeVariable.value = null;
	} else {
		window.removeEventListener('resize', handleResize);
		document.removeEventListener('keydown', onEsc);
		if (chart) { chart.dispose(); chart = null; }
	}
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', handleResize);
	document.removeEventListener('keydown', onEsc);
	if (chart) { chart.dispose(); chart = null; }
});
</script>

<style scoped>
.compare-layout {
	display: flex;
	gap: 16px;
	height: 70vh;
	min-height: 480px;
}

.compare-sidebar {
	width: 320px;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	border-right: 1px solid var(--border-color, #e2e6ef);
	padding-right: 16px;
}

.sidebar-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12px;
}

.sidebar-title {
	font-size: 14px;
	font-weight: 600;
	color: var(--text-primary, #1e2433);
}

.result-list {
	flex: 1;
	overflow-y: auto;
}

.result-item {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px;
	border-radius: 8px;
	cursor: pointer;
	transition: background 0.15s;
	border: 1px solid transparent;
}

.result-item:hover {
	background: var(--bg-panel, #f5f6fa);
}

.result-item.selected {
	background: rgba(79, 110, 247, 0.06);
	border-color: rgba(79, 110, 247, 0.2);
}

.result-info {
	flex: 1;
	min-width: 0;
}

.result-name {
	font-size: 13px;
	font-weight: 600;
	color: var(--text-primary, #1e2433);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.result-meta {
	font-size: 11px;
	color: var(--text-muted, #9299ad);
	margin-top: 2px;
}

.result-empty {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
	color: var(--text-muted, #9299ad);
	font-size: 13px;
}

.compare-main {
	flex: 1;
	display: flex;
	flex-direction: column;
	min-width: 0;
	overflow: hidden;
}

.compare-toolbar {
	display: flex;
	gap: 8px;
	margin-bottom: 12px;
	flex-shrink: 0;
}

.compare-chart-area {
	flex: 1;
	display: flex;
	flex-direction: column;
	min-height: 0;
	overflow: hidden;
}

.compare-tags {
	display: flex;
	align-items: center;
	gap: 6px;
	flex-wrap: wrap;
	margin-bottom: 10px;
	flex-shrink: 0;
}

.tags-label {
	font-size: 12px;
	color: var(--text-muted, #9299ad);
	flex-shrink: 0;
}

.var-tag {
	cursor: pointer;
	transition: all 0.15s;
}

.var-tag:hover {
	transform: translateY(-1px);
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.compare-chart-container {
	flex: 1;
	min-height: 200px;
}

.compare-placeholder {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--text-muted, #9299ad);
}

.compare-detail {
	flex-shrink: 0;
	border-top: 1px solid var(--border-color, #e2e6ef);
	background: var(--bg-card, #fff);
}

.detail-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 0 6px;
}

.detail-title {
	font-size: 13px;
	font-weight: 600;
	color: var(--text-primary, #1e2433);
}

.detail-table-wrap {
	max-height: 220px;
	overflow-y: auto;
}

.detail-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 12px;
}

.detail-table th,
.detail-table td {
	padding: 6px 12px;
	text-align: right;
	border-bottom: 1px solid var(--border-light, #eef0f6);
	white-space: nowrap;
}

.detail-table th:first-child,
.detail-table td:first-child {
	text-align: left;
}

.detail-table th {
	background: var(--bg-panel, #f5f6fa);
	color: var(--text-secondary, #5a6178);
	font-weight: 600;
	position: sticky;
	top: 0;
	z-index: 1;
}

.detail-table tbody tr:hover {
	background: rgba(79, 110, 247, 0.04);
}

.compare-layout.is-fullscreen {
	height: calc(100vh - 54px);
	min-height: calc(100vh - 54px);
}
</style>

<style>
.el-dialog.is-fullscreen .el-dialog__body {
	height: calc(100vh - 54px);
	overflow: hidden;
}
</style>
