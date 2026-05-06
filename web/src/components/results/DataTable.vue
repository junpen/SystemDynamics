<template>
  <el-table :data="tableData" stripe size="default" :max-height="maxHeight" style="width: 100%">
    <el-table-column prop="_time" label="时间" width="120" fixed sortable />
    <el-table-column
      v-for="col in columns"
      :key="col"
      :prop="col"
      :label="col"
      width="140"
      sortable
    >
      <template #default="{ row }">
        {{ formatNumber(row[col]) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  results: { type: Object, required: true },
  maxHeight: { type: Number, default: 350 }
});

const columns = computed(() => {
  if (!props.results?.table?.[0]) return [];
  return Object.keys(props.results.table[0]).filter(k => k !== '_time');
});

const tableData = computed(() => {
  return props.results?.table || [];
});

function formatNumber(val) {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'number') {
    return Math.abs(val) >= 1000 ? val.toFixed(1) : val.toFixed(4);
  }
  return val;
}
</script>
