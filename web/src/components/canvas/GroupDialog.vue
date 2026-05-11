<template>
  <Teleport to="body">
    <div v-if="visible" class="group-frame-backdrop">
      <div class="group-frame" :style="frameStyle" @click.stop>
        <div class="group-frame-header" :style="{ backgroundColor: selectedColor }">
          <input
            v-model="groupName"
            placeholder="请输入分组名称"
            class="group-name-input"
          />
          <div class="color-dots">
            <div
              v-for="color in groupColors"
              :key="color"
              class="color-dot"
              :class="{ active: selectedColor === color }"
              :style="{ backgroundColor: color }"
              @click="selectedColor = color"
            />
          </div>
        </div>
        <div class="group-frame-footer">
          <button class="frame-btn frame-btn-cancel" @click="handleClose">取消</button>
          <button class="frame-btn frame-btn-confirm" :disabled="!groupName.trim()" @click="handleCreate">确认创建</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  visible: Boolean,
  nodes: { type: Array, default: () => [] },
  position: { type: Object, default: () => ({ x: 0, y: 0, width: 300, height: 200 }) },
});

const emit = defineEmits(['update:visible', 'create']);

const groupName = ref('');
const selectedColor = ref('#818cf8');

const groupColors = [
  '#818cf8', '#6366f1', '#3b82f6', '#06b6d4',
  '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
];

const frameStyle = computed(() => ({
  left: props.position.x + 'px',
  top: props.position.y + 'px',
  width: props.position.width + 'px',
  height: props.position.height + 'px',
  borderColor: selectedColor.value,
  backgroundColor: selectedColor.value + '18',
}));

watch(() => props.visible, (val) => {
  if (val) {
    groupName.value = '';
    selectedColor.value = '#818cf8';
  }
});

function handleClose() {
  emit('update:visible', false);
}

function handleCreate() {
  if (!groupName.value.trim()) return;
  emit('create', {
    name: groupName.value.trim(),
    color: selectedColor.value,
    nodeIds: props.nodes.map(n => n.id),
  });
  handleClose();
}
</script>

<style scoped>
.group-frame-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9998;
}

.group-frame {
  position: fixed;
  border: 2.5px dashed;
  border-radius: 10px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  min-width: 320px;
}

.group-frame-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  min-height: 40px;
  flex-shrink: 0;
}

.group-name-input {
  border: none;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 13px;
  width: 140px;
  outline: none;
}
.group-name-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.color-dots {
  display: flex;
  gap: 3px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: pointer;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  transition: transform 0.15s;
}
.color-dot:hover {
  transform: scale(1.25);
}
.color-dot.active {
  border-color: #fff;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
}

.group-frame-footer {
  margin-top: auto;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 10px;
  flex-shrink: 0;
}

.frame-btn {
  border: none;
  padding: 8px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}
.frame-btn-cancel {
  background: rgba(0, 0, 0, 0.06);
  color: #666;
}
.frame-btn-cancel:hover {
  background: rgba(0, 0, 0, 0.12);
}
.frame-btn-confirm {
  background: #4f6ef7;
  color: #fff;
}
.frame-btn-confirm:hover {
  background: #3b5de7;
}
.frame-btn-confirm:disabled {
  background: #c0c4cc;
  cursor: not-allowed;
}
</style>
