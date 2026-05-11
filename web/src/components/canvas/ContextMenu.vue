<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="sd-ctx-menu"
      :style="{ left: x + 'px', top: y + 'px' }"
      @click.stop
      @contextmenu.prevent
    >
      <template v-for="(item, i) in menuItems" :key="item.action || 'divider-' + i">
        <div v-if="item.divider" class="sd-ctx-divider" />
        <div
          v-else
          class="sd-ctx-item"
          :class="{ danger: item.danger, disabled: item.action === 'paste' && pasteDisabled }"
          @click="handleAction(item.action)"
        >
          <el-icon v-if="item.icon" :size="14"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </div>
      </template>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { CopyDocument, DocumentCopy, Delete, Sort, CirclePlus, Remove, FolderAdd, EditPen, Fold, Expand, TrendCharts } from '@element-plus/icons-vue';

const props = defineProps({
  visible: Boolean,
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  menuType: { type: String, default: 'node' },
  pasteDisabled: { type: Boolean, default: true },
  canGroup: { type: Boolean, default: false },
  groupCollapsed: { type: Boolean, default: false },
});

const emit = defineEmits([
  'close', 'copy', 'paste', 'delete', 'reverse', 'view-chart',
  'sign-start-plus', 'sign-start-minus', 'sign-end-plus', 'sign-end-minus',
  'create-group', 'toggle-group', 'ungroup', 'rename-group'
]);

const blankItems = [
  { action: 'paste', label: '粘贴', icon: DocumentCopy }
];

const edgeItems = [
  { action: 'copy', label: '复制', icon: CopyDocument },
  { action: 'delete', label: '删除', icon: Delete, danger: true },
  { action: 'reverse', label: '反转箭头', icon: Sort },
  { divider: true },
  { action: 'view-chart', label: '查看模拟结果', icon: TrendCharts },
  { divider: true },
  { action: 'sign-start-plus', label: '起始位置 + 号', icon: CirclePlus },
  { action: 'sign-start-minus', label: '起始位置 - 号', icon: Remove },
  { action: 'sign-end-plus', label: '结束位置 + 号', icon: CirclePlus },
  { action: 'sign-end-minus', label: '结束位置 - 号', icon: Remove }
];

const groupItems = computed(() => [
  { action: 'rename-group', label: '重命名分组', icon: EditPen },
  { action: 'toggle-group', label: props.groupCollapsed ? '展开分组' : '折叠分组', icon: props.groupCollapsed ? Expand : Fold },
  { action: 'ungroup', label: '取消分组', icon: Remove },
  { divider: true },
  { action: 'delete', label: '删除', icon: Delete, danger: true },
]);

const menuItems = computed(() => {
  if (props.menuType === 'edge') return edgeItems;
  if (props.menuType === 'blank') return blankItems;
  if (props.menuType === 'group') return groupItems.value;

  const items = [
    { action: 'copy', label: '复制', icon: CopyDocument },
    { action: 'paste', label: '粘贴', icon: DocumentCopy },
    { divider: true },
    { action: 'view-chart', label: '查看模拟结果', icon: TrendCharts },
  ];
  if (props.canGroup) {
    items.push({ divider: true });
    items.push({ action: 'create-group', label: '创建分组', icon: FolderAdd });
  }
  items.push({ divider: true });
  items.push({ action: 'delete', label: '删除', icon: Delete, danger: true });
  return items;
});

function handleAction(action) {
  if (action === 'paste' && props.pasteDisabled) return;
  emit(action);
  emit('close');
}
</script>

<style scoped>
.sd-ctx-menu {
  position: fixed;
  z-index: 9999;
  min-width: 160px;
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-color, #e2e6ef);
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(30, 36, 51, 0.15);
  padding: 4px 0;
}

.sd-ctx-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--text-secondary, #5a6178);
  cursor: pointer;
  transition: all 0.15s;
}

.sd-ctx-item:hover {
  background: #eef0ff;
  color: var(--accent-blue, #4f6ef7);
}

.sd-ctx-item.danger:hover {
  background: #fef0f0;
  color: #f56c6c;
}

.sd-ctx-item.disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.sd-ctx-item.disabled:hover {
  background: transparent;
  color: #c0c4cc;
}

.sd-ctx-divider {
  height: 1px;
  margin: 4px 8px;
  background: var(--border-light, #eef0f6);
}
</style>
