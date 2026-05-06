<template>
  <div class="home-view">
    <div class="hero">
      <h1>系统动力学模拟器</h1>
      <p>在浏览器中构建、模拟和可视化系统动力学模型</p>
      <div class="actions">
        <el-button type="primary" size="large" @click="newModel">新建模型</el-button>
        <el-button size="large" @click="loadExample">浏览示例</el-button>
      </div>
    </div>

    <div class="features">
      <div class="feature-card" v-for="f in features" :key="f.title">
        <div class="feature-icon">{{ f.icon }}</div>
        <h3>{{ f.title }}</h3>
        <p>{{ f.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const features = [
  { icon: '📊', title: '可视化建模', desc: '拖拽添加存量、流量、变量和转换器，构建系统动力学图' },
  { icon: '⚡', title: '快速模拟', desc: '使用欧拉法或龙格-库塔法求解器运行模拟，支持自定义时间步长' },
  { icon: '📈', title: '丰富图表', desc: '基于 ECharts 的交互式时序图表和数据表格' },
  { icon: '💾', title: '保存与分享', desc: '保存模型、导入导出 JSON，浏览预置示例模型' }
];

function newModel() {
  router.push('/editor');
}

function loadExample() {
  router.push('/editor');
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 40px;
}

.hero {
  text-align: center;
  margin-bottom: 60px;
}

.hero h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 12px;
}

.hero p {
  font-size: 18px;
  opacity: 0.85;
  margin-bottom: 32px;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1000px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.feature-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.feature-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 13px;
  opacity: 0.8;
  line-height: 1.5;
}
</style>
