<template>
  <router-view />
</template>

<script setup>
</script>

<style>
:root {
  --bg-primary: #f0f2f5;
  --bg-panel: #f7f8fc;
  --bg-card: #ffffff;
  --header-gradient-from: #1a1f36;
  --header-gradient-to: #2d3561;
  --accent-blue: #4f6ef7;
  --accent-indigo: #6366f1;
  --border-color: #e2e6ef;
  --border-light: #eef0f6;
  --text-primary: #1e2433;
  --text-secondary: #5a6178;
  --text-muted: #9299ad;
  --shadow-sm: 0 1px 3px rgba(30, 36, 51, 0.06);
  --shadow-md: 0 2px 8px rgba(30, 36, 51, 0.08);
  --shadow-lg: 0 4px 16px rgba(30, 36, 51, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #c5c9d6;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a0a5b5;
}

/* Element Plus overrides */
.el-button {
  border-radius: 6px !important;
}
.el-input__wrapper,
.el-textarea__inner,
.el-select__wrapper {
  border-radius: 6px !important;
}
.el-tag {
  border-radius: 5px !important;
}
.el-divider--vertical {
  border-color: rgba(255, 255, 255, 0.2) !important;
}
</style>
