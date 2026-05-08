import { defineStore } from 'pinia';
import { ref } from 'vue';
import { resultsApi } from '../utils/api.js';

export const useResultsHistoryStore = defineStore('resultsHistory', () => {
	const records = ref([]);

	async function loadFromServer() {
		try {
			const res = await resultsApi.list();
			records.value = res.data.results || [];
		} catch {
			records.value = [];
		}
	}

	async function saveResult(name, modelName, results) {
		const record = {
			id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
			name,
			timestamp: new Date().toISOString(),
			modelName,
			results
		};
		await resultsApi.save(record);
		records.value.unshift(record);
		return record;
	}

	async function deleteResult(id) {
		await resultsApi.delete(id);
		records.value = records.value.filter(r => r.id !== id);
	}

	async function clearAll() {
		await resultsApi.clearAll();
		records.value = [];
	}

	async function getResult(id) {
		const local = records.value.find(r => r.id === id);
		if (local) return local;
		try {
			const res = await resultsApi.get(id);
			return res.data;
		} catch {
			return null;
		}
	}

	loadFromServer();

	return { records, saveResult, deleteResult, clearAll, getResult, loadFromServer };
});
