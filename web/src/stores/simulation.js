import { defineStore } from 'pinia';
import { ref } from 'vue';
import { simulateApi } from '../utils/api.js';

export const useSimulationStore = defineStore('simulation', () => {
  const status = ref('idle'); // 'idle' | 'running' | 'success' | 'error'
  const results = ref(null);
  const error = ref(null);

  async function runSimulation(modelJSON) {
    status.value = 'running';
    error.value = null;
    results.value = null;

    try {
      const res = await simulateApi.run(modelJSON);
      results.value = res.data;
      status.value = 'success';
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message || '仿真运行失败';
      error.value = {
        message: msg,
        primitiveName: err.response?.data?.errorPrimitiveName || null,
        errorCode: err.response?.data?.errorCode || null
      };
      status.value = 'error';
      throw err;
    }
  }

  function clearResults() {
    results.value = null;
    error.value = null;
    status.value = 'idle';
  }

  return { status, results, error, runSimulation, clearResults };
});
