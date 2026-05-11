<template>
	<!-- 模型设置对话框 -->
	<el-dialog v-model="editorStore.showModelSettings" title="模型设置" width="480px">
		<el-form label-width="120px" size="default">
			<el-form-item label="模型名称">
				<el-input v-model="modelStore.modelJSON.name" />
			</el-form-item>
			<el-form-item label="求解算法">
				<el-select v-model="modelStore.modelJSON.simulation.algorithm">
					<el-option label="欧拉法 (RK1)" value="RK1" />
					<el-option label="龙格-库塔法 (RK4)" value="RK4" />
				</el-select>
			</el-form-item>
			<el-form-item label="起始时间">
				<el-input-number v-model="modelStore.modelJSON.simulation.time_start" :step="1" />
			</el-form-item>
			<el-form-item label="模拟时长">
				<el-input-number v-model="modelStore.modelJSON.simulation.time_length" :min="1" :step="1" />
			</el-form-item>
			<el-form-item label="时间步长">
				<el-input-number v-model="modelStore.modelJSON.simulation.time_step" :min="0.001" :step="0.1" />
			</el-form-item>
			<el-form-item label="时间单位">
				<el-select v-model="modelStore.modelJSON.simulation.time_units">
					<el-option v-for="(label, key) in TIME_UNIT_LABELS" :key="key" :label="label" :value="key" />
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="editorStore.showModelSettings = false">关闭</el-button>
		</template>
	</el-dialog>

	<!-- 保存对话框 -->
	<el-dialog v-model="editorStore.showSaveDialog" title="保存模型" width="400px">
		<el-form label-width="80px">
			<el-form-item label="名称">
				<el-input v-model="modelStore.modelJSON.name" />
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="modelStore.modelJSON.description" type="textarea" :rows="3" />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="editorStore.showSaveDialog = false">取消</el-button>
			<el-button type="primary" @click="saveModel" :loading="saving">保存</el-button>
		</template>
	</el-dialog>

	<!-- 加载对话框 -->
	<el-dialog v-model="editorStore.showLoadDialog" title="加载模型" width="560px" class="load-dialog">
		<el-tabs v-model="loadTab">
			<el-tab-pane label="已保存模型" name="saved">
				<el-table :data="modelList" stripe @row-click="loadModel" highlight-current-row v-loading="loadingModels"
					empty-text="暂无已保存模型">
					<el-table-column prop="name" label="名称" />
					<el-table-column prop="updatedAt" label="最后修改" width="180">
						<template #default="{ row }">{{ formatDate(row.updatedAt) }}</template>
					</el-table-column>
					<el-table-column width="80">
						<template #default="{ row }">
							<el-button type="danger" size="small" @click.stop="deleteModel(row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="示例模型" name="examples">
				<div class="example-grid">
					<div v-for="ex in exampleList" :key="ex.id" class="example-card" @click="loadExampleFromLoadDialog(ex.id)">
						<div class="example-name">{{ ex.name }}</div>
						<div class="example-desc">{{ ex.description }}</div>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
		<template #footer>
			<el-button @click="editorStore.showLoadDialog = false">关闭</el-button>
		</template>
	</el-dialog>

	<!-- 导入对话框 -->
	<el-dialog v-model="editorStore.showImportDialog" title="导入模型" width="400px">
		<el-upload drag :auto-upload="false" accept=".json" :limit="1" :on-change="handleFileImport">
			<el-icon style="font-size: 40px; color: #909399;">
				<Upload />
			</el-icon>
			<div>将 JSON 文件拖到此处，或点击上传</div>
		</el-upload>
		<template #footer>
			<el-button @click="editorStore.showImportDialog = false">关闭</el-button>
		</template>
	</el-dialog>

	<!-- 示例浏览器对话框 -->
	<el-dialog v-model="editorStore.showExampleDialog" title="示例模型" width="560px">
		<div class="example-grid">
			<div v-for="ex in exampleList" :key="ex.id" class="example-card" @click="loadExample(ex.id)">
				<div class="example-name">{{ ex.name }}</div>
				<div class="example-desc">{{ ex.description }}</div>
			</div>
		</div>
		<template #footer>
			<el-button @click="editorStore.showExampleDialog = false">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script setup>
import { Upload } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, watch } from 'vue';
import { useEditorStore } from '../../stores/editor.js';
import { useModelStore } from '../../stores/model.js';
import { examplesApi, modelsApi } from '../../utils/api.js';
import { TIME_UNIT_LABELS } from '../../utils/constants.js';

const modelStore = useModelStore();
const editorStore = useEditorStore();

const saving = ref(false);
const loadingModels = ref(false);
const modelList = ref([]);
const exampleList = ref([]);
const loadTab = ref('saved');

const emit = defineEmits(['model-loaded']);

async function fetchExamples() {
	try {
		const res = await examplesApi.list();
		exampleList.value = res.data.examples || [];
	} catch (e) {
		ElMessage.error('加载示例列表失败');
	}
}

watch(() => editorStore.showLoadDialog, async (val) => {
	if (val) {
		loadTab.value = 'saved';
		loadingModels.value = true;
		try {
			const res = await modelsApi.list();
			modelList.value = res.data.models || [];
		} catch (e) {
			ElMessage.error('加载模型列表失败');
		}
		loadingModels.value = false;
		fetchExamples();
	}
});

watch(() => editorStore.showExampleDialog, async (val) => {
	if (val) {
		fetchExamples();
	}
});

async function saveModel() {
	saving.value = true;
	try {
		editorStore.syncPositions();
		const result = await modelStore.save();
		editorStore.showSaveDialog = false;
		ElMessage.success(result.action === 'updated' ? '模型已更新' : '新模型已保存');
	} catch (e) {
		ElMessage.error('保存模型失败');
	}
	saving.value = false;
}

async function loadModel(row) {
	try {
		await modelStore.load(row.id);
		editorStore.showLoadDialog = false;
		ElMessage.success(`已加载: ${row.name}`);
		emit('model-loaded');
	} catch (e) {
		ElMessage.error('加载模型失败');
	}
}

async function deleteModel(id) {
	try {
		await ElMessageBox.confirm('确定要删除该模型吗？此操作不可撤销。', '删除模型', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		});
		await modelsApi.delete(id);
		modelList.value = modelList.value.filter(m => m.id !== id);
		ElMessage.success('模型已删除');
	} catch (e) {
		if (e !== 'cancel') {
			ElMessage.error('删除模型失败');
		}
	}
}

async function loadExample(name) {
	try {
		const res = await examplesApi.get(name);
		modelStore.newModel();
		modelStore.loadModelJSON(res.data);
		editorStore.showExampleDialog = false;
		ElMessage.success(`已加载示例: ${res.data.name}`);
		emit('model-loaded');
	} catch (e) {
		ElMessage.error('加载示例失败');
	}
}

async function loadExampleFromLoadDialog(name) {
	try {
		const res = await examplesApi.get(name);
		modelStore.newModel();
		modelStore.loadModelJSON(res.data);
		editorStore.showLoadDialog = false;
		ElMessage.success(`已加载示例: ${res.data.name}`);
		emit('model-loaded');
	} catch (e) {
		ElMessage.error('加载示例失败');
	}
}

function handleFileImport(file) {
	const reader = new FileReader();
	reader.onload = (e) => {
		try {
			const json = JSON.parse(e.target.result);
			modelStore.newModel();
			modelStore.loadModelJSON(json);
			editorStore.showImportDialog = false;
			ElMessage.success('模型导入成功');
			emit('model-loaded');
		} catch (err) {
			ElMessage.error('无效的 JSON 文件');
		}
	};
	reader.readAsText(file.raw);
}

function formatDate(dateStr) {
	if (!dateStr) return '';
	return new Date(dateStr).toLocaleString('zh-CN');
}
</script>

<style scoped>
:deep(.el-tabs__content) {
	padding-top: 3px;
}

.example-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;
}

.example-card {
	border: 1px solid var(--border-color, #e2e6ef);
	border-radius: 10px;
	padding: 14px;
	cursor: pointer;
	transition: all 0.2s ease;
	background: var(--bg-card, #fff);
}

.example-card:hover {
	border-color: var(--accent-blue, #4f6ef7);
	box-shadow: 0 4px 12px rgba(79, 110, 247, 0.15);
	transform: translateY(-1px);
}

.example-name {
	font-size: 14px;
	font-weight: 600;
	color: var(--text-primary, #1e2433);
	margin-bottom: 4px;
}

.example-desc {
	font-size: 12px;
	color: var(--text-muted, #9299ad);
}
</style>
