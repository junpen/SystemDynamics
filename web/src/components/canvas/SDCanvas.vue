<template>
	<div ref="containerRef" class="sd-canvas"></div>
	<ContextMenu :visible="ctxMenu.visible" :x="ctxMenu.x" :y="ctxMenu.y" :menuType="ctxMenu.type"
		:pasteDisabled="!hasClipboard" :canGroup="ctxMenu.canGroup" :groupCollapsed="ctxMenu.groupCollapsed"
		@close="ctxMenu.visible = false" @copy="handleCopy" @paste="handlePaste" @delete="handleDelete"
		@reverse="handleReverse" @view-chart="handleViewChart" @sign-start-plus="handleSign('start', '+')"
		@sign-start-minus="handleSign('start', '-')" @sign-end-plus="handleSign('end', '+')"
		@sign-end-minus="handleSign('end', '-')" @create-group="handleCreateGroupAction" @toggle-group="handleToggleGroup"
		@ungroup="handleUngroup" @rename-group="handleRenameGroup" />
	<GroupDialog v-model:visible="groupDialogVisible" :nodes="groupDialogNodes" :position="groupDialogPos"
		@create="handleCreateGroupConfirm" />
	<ElementChartDialog ref="elementChartRef" />
</template>

<script setup>
import { Graph } from '@antv/x6';
import { ElMessage, ElMessageBox } from 'element-plus';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { useEditorStore } from '../../stores/editor.js';
import { useModelStore } from '../../stores/model.js';
import { useSimulationStore } from '../../stores/simulation.js';
import { COLORS, LABELS, NODE_TYPES, SHAPE_MAP } from '../../utils/constants.js';
import { modelJSONToGraph } from '../../utils/modelJSONAdapter.js';
import ContextMenu from './ContextMenu.vue';
import ElementChartDialog from './ElementChartDialog.vue';
import GroupDialog from './GroupDialog.vue';
import './shapes.js';

const containerRef = ref(null);
let graph = null;
let historyPlugin = null;
let selectedEdge = null;
let clipboard = null;
let _loading = false;
const hasClipboard = ref(false);

const ctxMenu = ref({ visible: false, x: 0, y: 0, type: 'node', cell: null, canGroup: false, groupCollapsed: false });
const groupDialogVisible = ref(false);
const groupDialogNodes = ref([]);
const groupDialogPos = ref({ x: 0, y: 0, width: 300, height: 200 });
const elementChartRef = ref(null);

const modelStore = useModelStore();
const editorStore = useEditorStore();
const simStore = useSimulationStore();

const emit = defineEmits(['ready', 'node-click', 'edge-click', 'blank-click', 'history-change']);

/**
 * Remove the X6 cell matching deletedIndex, then shift remaining cells'
 * elementIndex down by 1 if they were above the deleted index.
 */
function removeCellByIndex(deletedIndex) {
	if (!graph) return;
	const cells = graph.getCells();

	// Find the cell to delete
	let cellToDelete = null;
	for (const cell of cells) {
		const data = cell.getData();
		if (data && data.elementIndex === deletedIndex) {
			cellToDelete = cell;
			break;
		}
	}

	if (!cellToDelete) return;

	// Remove the cell directly - this will be recorded in history
	graph.removeCell(cellToDelete);

	// Update elementIndex for remaining cells without recording in history
	if (historyPlugin) {
		historyPlugin.stopListen();
	}
	for (const cell of cells) {
		const data = cell.getData();
		if (!data) continue;
		const idx = data.elementIndex;
		if (idx > deletedIndex) {
			cell.setData({ ...data, elementIndex: idx - 1 });
		}
	}
	if (historyPlugin) {
		historyPlugin.startListen();
	}
}

function getEdgeDefaults(edge) {
	const type = edge.getData()?.primitiveType || 'LINK';
	if (type === 'FLOW') return { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '' };
	return { stroke: '#9ca3af', strokeWidth: 1.5, strokeDasharray: '5,3' };
}

function highlightEdge(edge) {
	edge.attr('line/stroke', '#6366f1');
	edge.attr('line/strokeWidth', 4);
	edge.attr('line/strokeDasharray', '');
}

function unhighlightEdge(edge) {
	if (!edge) return;
	const d = getEdgeDefaults(edge);
	edge.attr('line/stroke', d.stroke);
	edge.attr('line/strokeWidth', d.strokeWidth);
	edge.attr('line/strokeDasharray', d.strokeDasharray);
}

function clearEdgeSelection() {
	unhighlightEdge(selectedEdge);
	selectedEdge = null;
}

// --- Context menu actions ---

function handleViewChart() {
	const cell = ctxMenu.value.cell;
	if (!cell) return;
	const data = cell.getData();
	if (!data || data.elementIndex < 0) return;
	const el = modelStore.modelJSON.elements[data.elementIndex];
	if (!el?.name) return;

	if (!simStore.results?.series || !(el.name in simStore.results.series)) {
		ElMessage.warning('暂无该元素的模拟结果，请先运行模拟');
		return;
	}
	elementChartRef.value?.open(el.name);
}

function handleCopy() {
	const cell = ctxMenu.value.cell;
	if (!cell) return;
	if (cell.isNode()) {
		hasClipboard.value = true;
		const pos = cell.getPosition();
		clipboard = {
			kind: 'node',
			config: {
				shape: cell.getProp('shape'),
				width: cell.getSize().width,
				height: cell.getSize().height,
				label: cell.getProp('label'),
				attrs: JSON.parse(JSON.stringify(cell.getAttrByPath('.') || {})),
				data: JSON.parse(JSON.stringify(cell.getData() || {})),
				ports: JSON.parse(JSON.stringify(cell.getProp('ports') || {})),
				offsetX: pos.x,
				offsetY: pos.y
			}
		};
	} else if (cell.isEdge()) {
		hasClipboard.value = true;
		clipboard = {
			kind: 'edge',
			config: {
				shape: cell.getProp('shape'),
				attrs: JSON.parse(JSON.stringify(cell.getAttrByPath('.') || {})),
				data: JSON.parse(JSON.stringify(cell.getData() || {})),
				sourceId: cell.getSourceCellId(),
				targetId: cell.getTargetCellId()
			}
		};
	}
}

function handlePaste() {
	if (!clipboard || !graph) return;
	if (clipboard.kind === 'node') {
		const c = clipboard.config;
		const type = c.data.primitiveType;
		const color = COLORS[type] || COLORS.VARIABLE;
		const size = [c.width, c.height];

		const pasteX = ctxMenu.value.type === 'blank'
			? (() => {
				const rect = containerRef.value.getBoundingClientRect();
				return graph.clientToLocal(ctxMenu.value.x - rect.left, ctxMenu.value.y - rect.top).x;
			})()
			: c.offsetX + 40;
		const pasteY = ctxMenu.value.type === 'blank'
			? (() => {
				const rect = containerRef.value.getBoundingClientRect();
				return graph.clientToLocal(ctxMenu.value.x - rect.left, ctxMenu.value.y - rect.top).y;
			})()
			: c.offsetY + 40;

		const index = modelStore.addElement(type, {
			coordinates: [Math.round(pasteX), Math.round(pasteY)],
			size
		});
		const el = modelStore.modelJSON.elements[index];

		graph.addNode({
			shape: c.shape,
			x: Math.round(pasteX),
			y: Math.round(pasteY),
			width: c.width,
			height: c.height,
			label: el.name,
			attrs: { body: { fill: color.fill, stroke: color.stroke }, label: { fill: color.text } },
			data: { elementIndex: index, primitiveType: type },
			ports: c.ports
		});
		// Update clipboard offset for consecutive pastes (non-blank menu)
		if (ctxMenu.value.type !== 'blank') {
			c.offsetX += 40;
			c.offsetY += 40;
		}
	} else if (clipboard.kind === 'edge') {
		const c = clipboard.config;
		const type = c.data.primitiveType;
		const sourceCell = graph.getCellById(c.sourceId);
		const targetCell = graph.getCellById(c.targetId);
		if (!sourceCell || !targetCell) return;

		const isSourceCloud = sourceCell.getData()?.isCloud;
		const isTargetCloud = targetCell.getData()?.isCloud;
		function getNodeNameForPaste(cell) {
			if (!cell) return null;
			const d = cell.getData();
			if (d?.elementIndex >= 0) {
				const el = modelStore.modelJSON.elements[d.elementIndex];
				if (el?.name) return el.name;
			}
			return cell.getAttrByPath('label/text') || cell.getProp('label') || null;
		}
		const fromName = !isSourceCloud ? getNodeNameForPaste(sourceCell) : null;
		const toName = !isTargetCloud ? getNodeNameForPaste(targetCell) : null;

		const index = modelStore.addElement(type, {});
		modelStore.updateElement(index, { from: fromName, to: toName });

		const edge = graph.addEdge({
			shape: c.shape,
			source: { cell: c.sourceId },
			target: { cell: c.targetId },
			attrs: c.attrs,
			data: { elementIndex: index, primitiveType: type }
		});
	}
}

function handleDelete() {
	const cell = ctxMenu.value.cell;
	if (!cell) return;
	const data = cell.getData();
	if (!data) return;
	if (data.isGroup) {
		handleDeleteGroup(cell);
		return;
	}
	if (data.elementIndex < 0) return;
	if (cell === selectedEdge) selectedEdge = null;
	modelStore.removeElement(data.elementIndex);
}

function handleReverse() {
	const edge = ctxMenu.value.cell;
	if (!edge || !edge.isEdge()) return;
	const data = edge.getData();
	if (!data) return;

	const sourceId = edge.getSourceCellId();
	const targetId = edge.getTargetCellId();
	const sourcePort = edge.getSourcePortId();
	const targetPort = edge.getTargetPortId();

	const srcConfig = sourceId ? { cell: sourceId, port: sourcePort } : edge.getSource();
	const tgtConfig = targetId ? { cell: targetId, port: targetPort } : edge.getTarget();

	edge.setSource(tgtConfig);
	edge.setTarget(srcConfig);

	const el = modelStore.modelJSON.elements[data.elementIndex];
	if (el) {
		const tmpFrom = el.from;
		el.from = el.to;
		el.to = tmpFrom;
		modelStore.dirty = true;
	}
}

// --- Edge +/- sign label management ---

function handleSign(position, sign) {
	const edge = ctxMenu.value.cell;
	if (!edge || !edge.isEdge()) return;

	const data = edge.getData() || {};
	const key = position === 'start' ? 'signStart' : 'signEnd';

	// Toggle: if same sign already set, remove it
	if (data[key] === sign) {
		data[key] = null;
	} else {
		data[key] = sign;
	}
	edge.setData({ ...data });
	applyEdgeSignLabels(edge);

	// Persist to model JSON
	const idx = data.elementIndex;
	if (idx >= 0) {
		modelStore.updateElement(idx, { display: { signStart: data.signStart || null, signEnd: data.signEnd || null } });
	}
}

function applyEdgeSignLabels(edge) {
	const data = edge.getData() || {};
	const labels = edge.getProp('labels') || [];

	// Remove existing sign labels, keep others
	const filtered = labels.filter(l => !l._signLabel);

	// Add start sign (near source, position ~0.05)
	if (data.signStart) {
		filtered.push(makeSignLabel(data.signStart, { distance: 0.05, offset: -18 }, 'start'));
	}
	// Add end sign (near target, position ~0.95)
	if (data.signEnd) {
		filtered.push(makeSignLabel(data.signEnd, { distance: 0.95, offset: -18 }, 'end'));
	}

	edge.setProp('labels', filtered);
}

function makeSignLabel(sign, position, id) {
	const isPlus = sign === '+';
	return {
		_signLabel: id,
		position,
		attrs: {
			label: {
				text: sign,
				fill: isPlus ? '#409eff' : '#f56c6c',
				fontSize: 14,
				fontWeight: 'bold',
				textAnchor: 'middle',
				textVerticalAnchor: 'middle'
			},
			rect: {
				fill: '#fff',
				fillOpacity: 0.95,
				stroke: isPlus ? '#409eff' : '#f56c6c',
				strokeWidth: 1,
				rx: 4,
				ry: 4,
				refWidth: 1.3,
				refHeight: 1.4,
				refX: -0.15,
				refY: -0.2
			}
		}
	};
}

let stockFlowTipShown = false;

// --- Group functions ---

function handleCreateGroupAction() {
	const selectedCells = graph.getSelectedCells().filter(c => {
		if (!c.isNode()) return false;
		const data = c.getData();
		return data && !data.isCloud && !data.isGroup;
	});

	// Always include the right-clicked source node
	const sourceCell = ctxMenu.value.cell;
	const allCells = [...selectedCells];
	if (sourceCell && sourceCell.isNode() && !sourceCell.getData()?.isCloud && !sourceCell.getData()?.isGroup && !allCells.some(c => c.id === sourceCell.id)) {
		allCells.push(sourceCell);
	}

	if (allCells.length < 2) {
		ElMessage.warning('请选择至少两个节点来创建分组');
		return;
	}

	// Find connected cloud nodes to include in the group
	const cloudNodes = [];
	const cloudIds = new Set();
	for (const node of allCells) {
		const edges = graph.getConnectedEdges(node);
		for (const edge of edges) {
			const src = edge.getSourceCell();
			const tgt = edge.getTargetCell();
			if (src?.getData()?.isCloud && !cloudIds.has(src.id) && !allCells.some(c => c.id === src.id)) {
				cloudIds.add(src.id);
				cloudNodes.push(src);
			}
			if (tgt?.getData()?.isCloud && !cloudIds.has(tgt.id) && !allCells.some(c => c.id === tgt.id)) {
				cloudIds.add(tgt.id);
				cloudNodes.push(tgt);
			}
		}
	}
	const allCellsIncludingClouds = [...allCells, ...cloudNodes];

	// Calculate bounding box in screen coordinates for the frame overlay
	let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
	for (const node of allCellsIncludingClouds) {
		const pos = node.getPosition();
		const size = node.getSize();
		minX = Math.min(minX, pos.x);
		minY = Math.min(minY, pos.y);
		maxX = Math.max(maxX, pos.x + size.width);
		maxY = Math.max(maxY, pos.y + size.height);
	}
	const padding = 30;
	const headerH = 36;
	const tl = graph.localToClient(minX - padding, minY - padding - headerH);
	const br = graph.localToClient(maxX + padding, maxY + padding);
	groupDialogPos.value = {
		x: tl.x,
		y: tl.y,
		width: Math.max(br.x - tl.x, 280),
		height: Math.max(br.y - tl.y, 120),
	};

	groupDialogNodes.value = allCellsIncludingClouds.map(cell => {
		const data = cell.getData();
		const type = data.primitiveType;
		const el = modelStore.elements[data.elementIndex];
		return {
			id: cell.id,
			name: el?.name || cell.getProp('label') || '',
			typeLabel: LABELS[type] || type,
			color: COLORS[type]?.stroke || '#666',
			included: true,
		};
	});
	groupDialogVisible.value = true;
}

function handleCreateGroupConfirm({ name, color, nodeIds }) {
	if (!graph || nodeIds.length === 0) return;
	const childNodes = nodeIds.map(id => graph.getCellById(id)).filter(Boolean);
	if (childNodes.length === 0) return;
	createGroupOnCanvas(childNodes, name, color);
}

function getGroupChildren(groupNode) {
	const data = groupNode.getData();
	if (!data || !data.childIds) return [];
	return data.childIds.map(id => graph.getCellById(id)).filter(Boolean);
}

function createGroupOnCanvas(childNodes, name = '分组', color = '#818cf8') {
	if (!graph || childNodes.length === 0) return;

	let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
	for (const node of childNodes) {
		const pos = node.getPosition();
		const size = node.getSize();
		minX = Math.min(minX, pos.x);
		minY = Math.min(minY, pos.y);
		maxX = Math.max(maxX, pos.x + size.width);
		maxY = Math.max(maxY, pos.y + size.height);
	}

	const padding = 30;
	const headerHeight = 36;
	const groupX = minX - padding;
	const groupY = minY - padding - headerHeight;
	const groupWidth = maxX - minX + padding * 2;
	const groupHeight = maxY - minY + padding * 2 + headerHeight;

	const groupNode = graph.addNode({
		shape: 'sd:group',
		x: groupX,
		y: groupY,
		width: groupWidth,
		height: groupHeight,
		attrs: {
			body: { fill: color + '18', stroke: color },
			headerBg: { fill: color },
		},
		data: {
			isGroup: true,
			collapsed: false,
			expandedSize: { width: groupWidth, height: groupHeight },
			childIds: childNodes.map(n => n.id),
		},
	});
	groupNode.setAttrByPath('headerLabel/text', name);
	groupNode.setAttrByPath('toggleIcon/text', '▼');

	// No parent-child, just send group to back so children stay on top
	groupNode.setProp('zIndex', -1);
	groupNode.toBack();

	return groupNode;
}

function toggleGroup(groupNode) {
	const data = groupNode.getData();
	if (data.collapsed) {
		expandGroup(groupNode);
	} else {
		collapseGroup(groupNode);
	}
}

function collapseGroup(groupNode) {
	const data = groupNode.getData();
	const children = getGroupChildren(groupNode);
	const size = groupNode.getSize();

	for (const child of children) {
		child.setVisible(false);
		const edges = graph.getConnectedEdges(child);
		for (const edge of edges) {
			edge.setVisible(false);
		}
	}

	groupNode.setSize(size.width, 40);
	groupNode.setData({ ...data, collapsed: true, expandedSize: { width: size.width, height: size.height } });
	groupNode.setAttrByPath('toggleIcon/text', '▶');
}

function expandGroup(groupNode) {
	const data = groupNode.getData();
	const children = getGroupChildren(groupNode);

	groupNode.setSize(data.expandedSize.width, data.expandedSize.height);

	for (const child of children) {
		child.setVisible(true);
		const edges = graph.getConnectedEdges(child);
		for (const edge of edges) {
			edge.setVisible(true);
		}
	}

	groupNode.setData({ ...data, collapsed: false });
	groupNode.setAttrByPath('toggleIcon/text', '▼');
}

function handleToggleGroup() {
	const groupNode = ctxMenu.value.cell;
	if (!groupNode) return;
	toggleGroup(groupNode);
}

function handleUngroup() {
	const groupNode = ctxMenu.value.cell;
	if (!groupNode) return;
	const data = groupNode.getData();
	if (data.collapsed) expandGroup(groupNode);

	// Just remove the group node, children keep their absolute positions
	graph.removeCell(groupNode);
}

function handleDeleteGroup(groupNode) {
	const data = groupNode.getData();
	if (data.collapsed) expandGroup(groupNode);

	const children = getGroupChildren(groupNode);

	// Collect cloud children and indices to delete
	const cloudChildren = children.filter(c => c.getData()?.isCloud);
	const indices = children
		.map(c => c.getData()?.elementIndex)
		.filter(idx => idx != null && idx >= 0)
		.sort((a, b) => b - a);

	// Remove cloud children first
	for (const child of cloudChildren) {
		graph.removeCell(child);
	}

	// Remove non-cloud elements from model store (which will trigger removeCellByIndex)
	for (const idx of indices) {
		modelStore.removeElement(idx);
	}

	// Remove the group node last
	graph.removeCell(groupNode);
}

function handleRenameGroup() {
	const groupNode = ctxMenu.value.cell;
	if (!groupNode) return;
	const currentName = groupNode.getAttrByPath('headerLabel/text') || '';
	ElMessageBox.prompt('请输入新的分组名称', '重命名分组', {
		inputValue: currentName,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
	}).then(({ value }) => {
		if (value.trim()) {
			groupNode.setAttrByPath('headerLabel/text', value.trim());
		}
	}).catch(() => { });
}

function initGraph() {
	graph = new Graph({
		container: containerRef.value,
		width: containerRef.value.clientWidth,
		height: containerRef.value.clientHeight,
		background: { color: '#f5f6fa' },
		grid: {
			visible: true,
			type: 'dot',
			args: { color: '#d8dbe5', thickness: 1 }
		},
		panning: { enabled: true, eventTypes: ['leftMouseDown'] },
		mousewheel: { enabled: true, zoomAtMousePosition: true, modifiers: ['ctrl'], minScale: 0.3, maxScale: 3 },
		connecting: {
			connector: { name: 'smooth' },
			allowBlank: true,
			allowLoop: false,
			allowMulti: true,
			allowEdge: true,
			snap: { radius: 30 },
			createEdge({ sourceCell }) {
				const type = editorStore.currentEdgeType;
				if (type === 'FLOW' && sourceCell?.isNode()) {
					const sourceData = sourceCell.getData();
					if (sourceData?.primitiveType === 'VARIABLE' || sourceData?.primitiveType === 'INTERVARIABLE') {
						if (!stockFlowTipShown) {
							stockFlowTipShown = true;
							ElMessage.warning('变量节点不能作为流量线的起始');
							setTimeout(() => { stockFlowTipShown = false; }, 2000);
						}
						return null;
					}
				}
				return graph.createEdge({
					shape: SHAPE_MAP[type] || 'sd:link',
					attrs: { line: { stroke: (COLORS[type] || COLORS.LINK).stroke } },
					data: { elementIndex: -1, primitiveType: type }
				});
			},
			validateConnection({ sourceCell, targetCell }) {
				if (!sourceCell) return false;
				if (sourceCell.getData()?.isGroup) return false;
				if (targetCell?.getData()?.isGroup) return false;
				if (!targetCell) return true;
				// LINK target must be STOCK, VARIABLE, or FLOW
				if (editorStore.currentEdgeType === 'LINK') {
					const targetType = targetCell.getData()?.primitiveType;
					if (!['STOCK', 'VARIABLE', 'INTERVARIABLE', 'FLOW'].includes(targetType)) return false;
				}
				if (targetCell.isEdge && targetCell.isEdge()) return true;
				return sourceCell.id !== targetCell.id;
			}
		},
		highlighting: {
			magnetAdsorbed: {
				name: 'stroke',
				args: { attrs: { fill: '#6366f1', stroke: '#6366f1' } }
			}
		}
	});

	graph.use(new Selection({ enabled: true, rubberband: { enabled: true, modifiers: ['ctrl'] }, showNodeSelectionBox: true }));
	graph.use(new Snapline({ enabled: true }));
	graph.use(new Keyboard({ enabled: true }));
	historyPlugin = new History({ enabled: true });
	graph.use(historyPlugin);

	// Register delete callback from model store
	modelStore.onDeleteElement((deletedIndex) => {
		removeCellByIndex(deletedIndex);
	});

	// Events
	graph.on('node:click', ({ node, e }) => {
		const data = node.getData();
		if (data?.isGroup) {
			const nodePos = node.getPosition();
			const clickLocal = graph.clientToLocal(e.clientX, e.clientY);
			const relativeY = clickLocal.y - nodePos.y;
			if (relativeY <= 32) {
				toggleGroup(node);
			}
			return;
		}
		if (data && !data.isCloud) {
			clearEdgeSelection();
			editorStore.selectElement(data.elementIndex);
			emit('node-click', node);
		}
	});

	graph.on('edge:click', ({ edge }) => {
		const data = edge.getData();
		if (data) {
			if (selectedEdge && selectedEdge !== edge) {
				unhighlightEdge(selectedEdge);
			}
			selectedEdge = edge;
			highlightEdge(edge);
			editorStore.selectElement(data.elementIndex);
			emit('edge-click', edge);
		}
	});

	graph.on('blank:click', () => {
		ctxMenu.value.visible = false;
		clearEdgeSelection();
		editorStore.clearSelection();
		emit('blank-click');
	});

	// Right-click context menus
	graph.on('node:contextmenu', ({ node, e }) => {
		if (e) e.preventDefault();
		const data = node.getData();
		if (!data) return;
		const clientX = e?.clientX ?? 0;
		const clientY = e?.clientY ?? 0;

		if (data.isGroup) {
			ctxMenu.value = { visible: true, x: clientX, y: clientY, type: 'group', cell: node, canGroup: false, groupCollapsed: !!data.collapsed };
			return;
		}

		if (data.isCloud) return;

		const selectedCells = graph.getSelectedCells().filter(c => c.isNode() && !c.getData()?.isCloud && !c.getData()?.isGroup);
		const canGroup = selectedCells.length >= 1;
		ctxMenu.value = { visible: true, x: clientX, y: clientY, type: 'node', cell: node, canGroup, groupCollapsed: false };
	});

	graph.on('edge:contextmenu', ({ edge, e }) => {
		if (e) e.preventDefault();
		const data = edge.getData();
		if (!data) return;
		const clientX = e?.clientX ?? 0;
		const clientY = e?.clientY ?? 0;
		ctxMenu.value = { visible: true, x: clientX, y: clientY, type: 'edge', cell: edge };
	});

	graph.on('blank:contextmenu', ({ e }) => {
		if (e) e.preventDefault();
		const clientX = e?.clientX ?? 0;
		const clientY = e?.clientY ?? 0;
		ctxMenu.value = { visible: true, x: clientX, y: clientY, type: 'blank', cell: null };
	});

	graph.on('cell:click', () => { ctxMenu.value.visible = false; });

	graph.on('node:change:position', ({ node, current, previous }) => {
		if (_loading) return;
		const data = node.getData();
		if (!data) return;
		if (data.isGroup) {
			// Move all children with the group
			if (!previous) return;
			const dx = current.x - previous.x;
			const dy = current.y - previous.y;
			const children = getGroupChildren(node);
			for (const child of children) {
				const pos = child.getPosition();
				child.setPosition(pos.x + dx, pos.y + dy);
			}
			return;
		}
		if (data.isCloud) {
			modelStore.dirty = true;
			return;
		}
		if (data.elementIndex >= 0) {
			const pos = node.getPosition();
			const newCoords = [Math.round(pos.x), Math.round(pos.y)];
			modelStore.updateElement(data.elementIndex, { display: { coordinates: newCoords } });
		}
	});

	let pendingBlankEdge = null;

	graph.on('edge:connected', ({ edge }) => {
		pendingBlankEdge = null;
		const data = edge.getData();
		if (!data || data.elementIndex >= 0) return;
		const targetCell = edge.getTargetCell();
		// LINK: target must be STOCK, VARIABLE, or FLOW
		if (data.primitiveType === 'LINK') {
			const targetType = targetCell?.getData()?.primitiveType;
			if (!['STOCK', 'VARIABLE', 'INTERVARIABLE', 'FLOW'].includes(targetType)) {
				graph.removeCell(edge);
				return;
			}
		}
		if (!targetCell) return;
		finishEdgeConnection(edge);
	});

	// Track mouse up to detect edge dropped on blank
	graph.on('blank:mouseup', () => {
		if (!pendingBlankEdge) return;
		const edge = pendingBlankEdge;
		pendingBlankEdge = null;
		const data = edge.getData();
		if (!data || data.elementIndex >= 0) return;
		if (edge.getTargetCell()) return;

		if (data.primitiveType === 'FLOW') {
			const target = edge.getTarget();
			const pt = target ? { x: target.x || 0, y: target.y || 0 } : { x: 0, y: 0 };
			const cloud = graph.addNode({
				shape: 'sd:cloud',
				x: Math.round(pt.x - 15),
				y: Math.round(pt.y - 11),
				width: 30,
				height: 22,
				data: { elementIndex: -1, isCloud: true, primitiveType: 'CLOUD' },
			});
			const source = edge.getSource();
			const attrs = edge.getAttrByPath('.') || {};
			graph.removeCell(edge);
			const newEdge = graph.addEdge({
				shape: 'sd:flow',
				source,
				target: { cell: cloud.id },
				attrs,
				data: { elementIndex: -1, primitiveType: 'FLOW' },
			});
			finishEdgeConnection(newEdge);
		} else {
			graph.removeCell(edge);
		}
	});

	graph.on('edge:change:target', ({ edge, current }) => {
		const data = edge.getData();
		if (!data || data.elementIndex >= 0) return;
		// Track edges whose target is blank (no cell)
		if (current && !current.cell) {
			pendingBlankEdge = edge;
		}
	});

	function finishEdgeConnection(edge) {
		const data = edge.getData();
		if (!data || data.elementIndex >= 0) return;

		const type = data.primitiveType;
		const sourceCell = edge.getSourceCell();
		const targetCell = edge.getTargetCell();

		const isSourceCloud = sourceCell?.getData()?.isCloud;
		const isTargetCloud = targetCell?.getData()?.isCloud;

		function getNodeName(cell) {
			if (!cell) return null;
			const d = cell.getData();
			if (d?.elementIndex >= 0) {
				const el = modelStore.modelJSON.elements[d.elementIndex];
				if (el?.name) return el.name;
			}
			return cell.getAttrByPath('label/text') || cell.getProp('label') || null;
		}

		const fromName = (!isSourceCloud && sourceCell) ? getNodeName(sourceCell) : null;
		const toName = (!isTargetCloud && targetCell) ? getNodeName(targetCell) : null;

		const index = modelStore.addElement(type, {});
		modelStore.updateElement(index, { from: fromName, to: toName });
		edge.setData({ elementIndex: index, primitiveType: type });
	}

	// Delete key from canvas
	graph.bindKey(['delete', 'backspace'], () => {
		const cells = graph.getSelectedCells();
		if (cells.length) {
			// Collect children of selected groups to skip them
			const childIds = new Set();
			for (const cell of cells) {
				if (cell.getData()?.isGroup) {
					const children = getGroupChildren(cell);
					for (const child of children) {
						childIds.add(child.id);
					}
				}
			}

			const indices = [];
			for (const cell of cells) {
				if (childIds.has(cell.id)) continue;
				const data = cell.getData();
				if (data?.isGroup) {
					handleDeleteGroup(cell);
					continue;
				}
				if (cell.isEdge() && cell === selectedEdge) {
					selectedEdge = null;
				}
				if (data?.isCloud) {
					graph.removeCell(cell);
				} else if (data && data.elementIndex >= 0) {
					indices.push(data.elementIndex);
				}
			}
			indices.sort((a, b) => b - a);
			for (const idx of indices) {
				modelStore.removeElement(idx);
			}
		}
		return false;
	});

	graph.bindKey('ctrl+z', () => { graph.undo(); return false; });
	graph.bindKey('ctrl+y', () => { graph.redo(); return false; });

	graph.on('history:change', () => {
		if (historyPlugin) {
			emit('history-change', {
				canUndo: historyPlugin.canUndo(),
				canRedo: historyPlugin.canRedo()
			});
		}
	});

	emit('ready', graph);
}

function handleDrop(e) {
	e.preventDefault();
	const type = e.dataTransfer.getData('primitive-type');
	if (!type || !NODE_TYPES.includes(type)) return;

	const rect = containerRef.value.getBoundingClientRect();
	const x = graph.clientToLocal(e.clientX - rect.left, e.clientY - rect.top);

	// Cloud nodes are visual-only, not stored in modelJSON
	if (type === 'CLOUD') {
		graph.addNode({
			shape: 'sd:cloud',
			x: Math.round(x.x),
			y: Math.round(x.y),
			width: 30,
			height: 22,
			data: { elementIndex: -1, isCloud: true, primitiveType: 'CLOUD' },
		});
		return;
	}

	const size = type === 'STOCK' ? [150, 60] :
		type === 'VARIABLE' ? [130, 60] :
			type === 'INTERVARIABLE' ? [130, 60] :
				type === 'CONVERTER' ? [120, 70] :
					type === 'STATE' ? [130, 50] : [130, 60];
	const color = COLORS[type];

	const index = modelStore.addElement(type, {
		coordinates: [Math.round(x.x), Math.round(x.y)],
		size
	});

	const el = modelStore.modelJSON.elements[index];

	graph.addNode({
		shape: SHAPE_MAP[type],
		x: Math.round(x.x),
		y: Math.round(x.y),
		width: size[0],
		height: size[1],
		label: el.name,
		attrs: {
			body: { fill: color.fill, stroke: color.stroke },
			label: { fill: color.text }
		},
		data: { elementIndex: index, primitiveType: type },
		ports: {
			groups: {
				top: { position: 'top', attrs: { circle: { r: 6, magnet: true, stroke: color.stroke, fill: '#fff', strokeWidth: 2 } } },
				bottom: { position: 'bottom', attrs: { circle: { r: 6, magnet: true, stroke: color.stroke, fill: '#fff', strokeWidth: 2 } } },
				left: { position: 'left', attrs: { circle: { r: 6, magnet: true, stroke: color.stroke, fill: '#fff', strokeWidth: 2 } } },
				right: { position: 'right', attrs: { circle: { r: 6, magnet: true, stroke: color.stroke, fill: '#fff', strokeWidth: 2 } } }
			},
			items: [
				{ group: 'top', id: 'top' },
				{ group: 'bottom', id: 'bottom' },
				{ group: 'left', id: 'left' },
				{ group: 'right', id: 'right' }
			]
		}
	});
}

function handleDragOver(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}

let resizeObserver = null;

onMounted(() => {
	nextTick(() => {
		initGraph();
		containerRef.value.addEventListener('drop', handleDrop);
		containerRef.value.addEventListener('dragover', handleDragOver);

		editorStore.registerSyncPositions(syncPositionsToStore);

		resizeObserver = new ResizeObserver(() => {
			if (graph && containerRef.value) {
				graph.resize(containerRef.value.clientWidth, containerRef.value.clientHeight);
			}
		});
		resizeObserver.observe(containerRef.value);
	});
});

onUnmounted(() => {
	if (resizeObserver) {
		resizeObserver.disconnect();
		resizeObserver = null;
	}
	if (graph) {
		graph.dispose();
		graph = null;
	}
});

// Sync name changes from property panel to canvas
watch(
	() => {
		const idx = editorStore.selectedElementIndex;
		if (idx == null || idx < 0) return null;
		return { idx, name: modelStore.elements[idx]?.name };
	},
	(val) => {
		if (!val || !graph) return;
		const { idx, name } = val;
		// Update node label
		for (const node of graph.getNodes()) {
			const data = node.getData();
			if (data && data.elementIndex === idx && !data.isCloud) {
				node.setAttrByPath('label/text', name || '');
				return;
			}
		}
		// Update edge label
		for (const edge of graph.getEdges()) {
			const data = edge.getData();
			if (data && data.elementIndex === idx) {
				const existingLabels = edge.getProp('labels') || [];
				const signLabels = existingLabels.filter(l => l._signLabel);
				if (name) {
					edge.setProp('labels', [
						{ attrs: { label: { text: name } } },
						...signLabels
					]);
				} else {
					edge.setProp('labels', signLabels);
				}
				return;
			}
		}
	}
);

// Sync sign changes from property panel to canvas
watch(
	() => {
		const idx = editorStore.selectedElementIndex;
		if (idx == null || idx < 0) return null;
		const el = modelStore.elements[idx];
		if (!el || !['LINK', 'FLOW'].includes(el.type)) return null;
		return { idx, signStart: el.display?.signStart, signEnd: el.display?.signEnd };
	},
	(val) => {
		if (!val || !graph) return;
		const { idx, signStart, signEnd } = val;
		for (const edge of graph.getEdges()) {
			const data = edge.getData();
			if (data && data.elementIndex === idx) {
				const newData = { ...data, signStart: signStart || null, signEnd: signEnd || null };
				edge.setData(newData);
				applyEdgeSignLabels(edge);
				return;
			}
		}
	}
);

function loadGraph(modelJSON) {
	if (graph) {
		_loading = true;
		modelJSONToGraph(modelJSON, graph);
		// Apply sign labels on all edges that have sign data
		for (const edge of graph.getEdges()) {
			const data = edge.getData();
			if (data && (data.signStart || data.signEnd)) {
				applyEdgeSignLabels(edge);
			}
		}
		_loading = false;
		if (historyPlugin) {
			historyPlugin.clean();
			emit('history-change', { canUndo: false, canRedo: false });
		}
	}
}

function getGraph() {
	return graph;
}

function syncPositionsToStore() {
	if (!graph) return;
	// Sync regular node positions
	for (const node of graph.getNodes()) {
		const data = node.getData();
		if (!data || data.elementIndex < 0 || data.isCloud || data.isGroup) continue;
		const pos = node.getPosition();
		modelStore.updateElement(data.elementIndex, {
			display: { coordinates: [Math.round(pos.x), Math.round(pos.y)] }
		});
	}
	// Sync cloud node positions to their connected FLOW elements
	for (const node of graph.getNodes()) {
		const data = node.getData();
		if (!data || !data.isCloud) continue;
		const pos = node.getPosition();
		const cloudCoords = [Math.round(pos.x + 15), Math.round(pos.y + 11)];
		for (const edge of graph.getEdges()) {
			const edgeData = edge.getData();
			if (!edgeData || edgeData.elementIndex < 0) continue;
			if (edge.getSourceCellId() === node.id) {
				modelStore.updateElement(edgeData.elementIndex, {
					display: { from_coordinates: cloudCoords }
				});
			} else if (edge.getTargetCellId() === node.id) {
				modelStore.updateElement(edgeData.elementIndex, {
					display: { to_coordinates: cloudCoords }
				});
			}
		}
	}
	// Sync groups
	const groups = [];
	for (const node of graph.getNodes()) {
		const data = node.getData();
		if (!data?.isGroup) continue;
		const childIds = data.childIds || [];
		const childNames = childIds.map(id => {
			const child = graph.getCellById(id);
			if (!child) return null;
			const childData = child.getData();
			if (!childData || childData.elementIndex < 0) return null;
			return modelStore.modelJSON.elements[childData.elementIndex]?.name;
		}).filter(Boolean);
		groups.push({
			name: node.getAttrByPath('headerLabel/text') || '',
			color: node.getAttrByPath('headerBg/fill') || '#818cf8',
			collapsed: data.collapsed || false,
			childNames,
		});
	}
	modelStore.modelJSON.groups = groups;
}

function undo() {
	if (graph) graph.undo();
}

function redo() {
	if (graph) graph.redo();
}

function clearCanvas() {
	if (!graph) return;
	graph.clearCells();
	modelStore.modelJSON.elements = [];
	modelStore.dirty = true;
	if (historyPlugin) historyPlugin.clean();
	emit('history-change', { canUndo: false, canRedo: false });
}

defineExpose({ loadGraph, getGraph, undo, redo, clearCanvas });
</script>

<style scoped>
.sd-canvas {
	flex: 1;
	min-height: 0;
	width: 100%;
}
</style>

<style>
.sd-canvas .x6-port-body {
	opacity: 0;
	transition: opacity 0.2s;
}

.sd-canvas .x6-node:hover .x6-port-body {
	opacity: 1;
}
</style>
