<template>
  <div class="equation-editor">
    <el-input
      ref="inputRef"
      v-model="localValue"
      type="textarea"
      :rows="rows"
      placeholder="例如 [人口] * 0.02"
      style="font-family: monospace; width: 100%"
      @change="onChange"
      @blur="onBlur"
    />
    <div v-if="variables.length" class="var-section">
      <span class="var-label">变量：</span>
      <el-tooltip v-for="v in variables" :key="v.name" content="点击插入" placement="top" :show-after="500">
        <span class="var-chip" @click="insertFn(`[${v.name}]`)">{{ v.name }}</span>
      </el-tooltip>
    </div>
    <div class="fn-toggle" @click="fnPanelOpen = !fnPanelOpen">
      <span>{{ fnPanelOpen ? '▼' : '▶' }} 函数</span>
    </div>
    <div v-if="fnPanelOpen" class="fn-panel">

      <div class="fn-tabs">
        <span
          v-for="cat in categories"
          :key="cat.key"
          class="fn-tab"
          :class="{ active: activeCat === cat.key }"
          @click="activeCat = cat.key"
        >{{ cat.label }}</span>
      </div>
      <div class="fn-list">
        <el-tooltip
          v-for="fn in activeFunctions"
          :key="fn.label"
          :content="fn.des"
          placement="left"
          :show-after="300"
        >
          <span class="fn-chip" @click="insertFn(fn.label)">{{ fn.label }}</span>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  rows: { type: Number, default: 3 },
  variables: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:modelValue', 'change']);

const localValue = ref(String(props.modelValue ?? ''));
const fnPanelOpen = ref(false);
const activeCat = ref('math');
const inputRef = ref(null);

watch(() => props.modelValue, (v) => { localValue.value = String(v ?? ''); });

const categories = [
  { key: 'math', label: '数学' },
  { key: 'time', label: '时间' },
  { key: 'history', label: '历史' },
  { key: 'random', label: '随机' },
  { key: 'basic', label: '基本' }
];

const allFunctions = {
  math: [
    { label: 'Round()', des: '四舍五入取整' },
    { label: 'Ceiling()', des: '向上取整' },
    { label: 'Floor()', des: '向下取整' },
    { label: 'Cos()', des: '余弦' },
    { label: 'ArcCos()', des: '反余弦' },
    { label: 'Sin()', des: '正弦' },
    { label: 'ArcSin()', des: '反正弦' },
    { label: 'Tan()', des: '正切' },
    { label: 'ArcTan()', des: '反正切' },
    { label: 'Log()', des: '对数' },
    { label: 'ln()', des: '以e为底的对数' },
    { label: 'Exp()', des: '将e指数化' },
    { label: 'Sum()', des: '求和' },
    { label: 'Product()', des: '返回一个向量或数字列表的乘积' },
    { label: 'Max()', des: '最大值' },
    { label: 'Min()', des: '最小值' },
    { label: 'Mean()', des: '均值' },
    { label: 'Median()', des: '中位数' },
    { label: 'stdDev()', des: '标准差' },
    { label: 'Abs()', des: '绝对值' },
    { label: '() mod ()', des: '余数' },
    { label: 'Sqrt()', des: '平方根' },
    { label: 'Sign()', des: '标志 if(Value>0){1} else if(value<0){-1} else if(value==0){0}' },
    { label: 'pi', des: 'Π值 3.14159265' },
    { label: 'e', des: 'e值 2.71828183' },
    { label: 'Logit()', des: '返回该值的对数几率转换值' },
    { label: 'Expit()', des: '返回该值的"返自然对数"转换结果' }
  ],
  time: [
    { label: 'Seconds()', des: '当前时间以秒(s)为单位' },
    { label: 'Minutes()', des: '当前时间以分(m)为单位' },
    { label: 'Hours()', des: '当前时间以时(h)为单位' },
    { label: 'Days()', des: '当前时间以天为单位' },
    { label: 'Weeks()', des: '当前时间以周为单位' },
    { label: 'Months()', des: '当前时间以月为单位' },
    { label: 'Years()', des: '当前时间以年为单位' },
    { label: 'Time()', des: '当前时间' },
    { label: 'Seasonal(Peak=0)', des: '周期性变化的正弦波，周期为1年' }
  ],
  history: [
    { label: 'Delay()', des: 'Delay(延迟元素,延迟时间,延迟元素初始值)' },
    { label: 'Smooth()', des: 'Smooth([Value],length,Initial Value)' },
    { label: 'PastValues()', des: 'PastValues([value],Period=All Time)' },
    { label: 'PastMax()', des: 'PastMax([Value],Period=All Time)' },
    { label: 'PastMin()', des: 'PastMin([Value],Period=All Time)' },
    { label: 'PastMedian()', des: 'PastMedian([Value],Period=All Time)' },
    { label: 'PastMean()', des: 'PastMean([Value],Period=All Time)' },
    { label: 'PastStdDev()', des: 'PastStdDev([Value],Period=All Time)' },
    { label: 'PastCorrelation()', des: 'PastCorrelation([Value],[Value],Period=All Time)' },
    { label: 'Fix()', des: 'Fix(Value,Period=All Time)' }
  ],
  random: [
    { label: 'Rand()', des: 'Rand(min,max)' },
    { label: 'RandNormal()', des: 'RandNormal(均值,标准差)' },
    { label: 'RandLognormal()', des: 'RandLognormal(均值,标准差)' },
    { label: 'RandBoolean()', des: 'RandBoolean(概率)' },
    { label: 'RandBinomial()', des: 'RandBinomial(计数,概率)' },
    { label: 'RandNegativeBinomial()', des: 'RandNegativeBinomial(成功次数,概率)' },
    { label: 'RandPoisson()', des: 'RandPoisson()' },
    { label: 'RandTriangular()', des: 'RandTriangular(最小值,最大值,峰值)' },
    { label: 'RandExp()', des: 'RandExp()' },
    { label: 'RandGamma()', des: 'RandGamma(α,β)' },
    { label: 'RandBeta()', des: 'RandBeta(α,β)' },
    { label: 'RandDist()', des: 'RandDist(X,Y)' },
    { label: 'SetRandSeed()', des: 'SetRandSeed(种子数)' }
  ],
  basic: [
    { label: 'IfThenElse()', des: 'IfThenElse(条件,true执行语句,false执行语句)' },
    { label: 'Pulse()', des: 'Pulse(时间,高度,宽度,重复次数)' },
    { label: 'Step()', des: 'Step(开始,高度为1)' },
    { label: 'Ramp()', des: 'Ramp(起始,终点,高度为1)' },
    { label: 'Pause()', des: '暂停' },
    { label: 'Stop()', des: '停止' }
  ]
};

const activeFunctions = computed(() => allFunctions[activeCat.value] || []);

function insertFn(label) {
  const el = inputRef.value?.$el?.querySelector('textarea') || inputRef.value?.textarea;
  let pos = typeof el?.selectionStart === 'number' ? el.selectionStart : localValue.value.length;
  const before = localValue.value.slice(0, pos);
  const after = localValue.value.slice(pos);
  localValue.value = before + label + after;
  pos += label.length;
  emit('update:modelValue', localValue.value);
  emit('change', localValue.value);
  nextTick(() => {
    if (el) {
      el.focus();
      el.setSelectionRange(pos, pos);
    }
  });
}

function onChange() {
  emit('update:modelValue', localValue.value);
  emit('change', localValue.value);
}

function onBlur() {
  emit('change', localValue.value);
}
</script>

<style scoped>
.equation-editor {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.var-section {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.var-label {
  font-size: 13px;
  color: var(--text-muted, #9299ad);
}

.var-chip {
  font-size: 13px;
  font-family: monospace;
  padding: 3px 8px;
  border-radius: 5px;
  background: #ecfdf5;
  border: 1px solid #6ee7b7;
  cursor: pointer;
  user-select: none;
  color: #059669;
}

.var-chip:hover {
  background: #d1fae5;
  border-color: #059669;
}

.fn-toggle {
  font-size: 14px;
  color: var(--accent-blue, #4f6ef7);
  cursor: pointer;
  user-select: none;
  padding: 3px 0;
}

.fn-toggle:hover {
  text-decoration: underline;
}

.fn-panel {
  border: 1px solid var(--border-color, #e2e6ef);
  border-radius: 8px;
  background: var(--bg-card, #fff);
  padding: 6px;
}

.fn-tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.fn-tab {
  font-size: 13px;
  padding: 3px 10px;
  border-radius: 5px;
  cursor: pointer;
  color: var(--text-secondary, #5a6178);
  background: var(--bg-panel, #f7f8fc);
  border: 1px solid var(--border-color, #e2e6ef);
  user-select: none;
}

.fn-tab:hover {
  color: var(--accent-blue, #4f6ef7);
  border-color: var(--accent-blue, #4f6ef7);
}

.fn-tab.active {
  color: #fff;
  background: var(--accent-indigo, #6366f1);
  border-color: var(--accent-indigo, #6366f1);
}

.fn-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-height: 180px;
  overflow-y: auto;
}

.fn-chip {
  font-size: 13px;
  font-family: monospace;
  padding: 3px 8px;
  border-radius: 5px;
  background: var(--bg-panel, #f7f8fc);
  border: 1px solid var(--border-color, #e2e6ef);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  color: var(--text-primary, #1e2433);
}

.fn-chip:hover {
  color: var(--accent-blue, #4f6ef7);
  border-color: var(--accent-blue, #4f6ef7);
  background: #eef0ff;
}
</style>
