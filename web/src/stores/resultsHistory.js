import { defineStore } from 'pinia';
import { ref } from 'vue';

const STORAGE_KEY = 'sd_simulation_results_history';

export const useResultsHistoryStore = defineStore('resultsHistory', () => {
	const records = ref(loadFromStorage());

	function loadFromStorage() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	}

	function persist() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value));
	}

	function saveResult(name, modelName, results) {
		const record = {
			id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
			name,
			timestamp: new Date().toISOString(),
			modelName,
			results
		};
		records.value.unshift(record);
		persist();
		return record;
	}

	function deleteResult(id) {
		records.value = records.value.filter(r => r.id !== id);
		persist();
	}

	function clearAll() {
		records.value = [];
		persist();
	}

	function getResult(id) {
		return records.value.find(r => r.id === id) || null;
	}

	return { records, saveResult, deleteResult, clearAll, getResult };
});
