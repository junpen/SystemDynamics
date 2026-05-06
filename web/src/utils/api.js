import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
});

export const simulateApi = {
  run(modelJSON) {
    return api.post('/simulate', modelJSON);
  },
  validate(modelJSON) {
    return api.post('/validate', modelJSON);
  }
};

export const modelsApi = {
  list() {
    return api.get('/models');
  },
  get(id) {
    return api.get(`/models/${id}`);
  },
  create(modelJSON) {
    return api.post('/models', modelJSON);
  },
  update(id, modelJSON) {
    return api.put(`/models/${id}`, modelJSON);
  },
  delete(id) {
    return api.delete(`/models/${id}`);
  }
};

export const examplesApi = {
  list() {
    return api.get('/examples');
  },
  get(name) {
    return api.get(`/examples/${name}`);
  },
  save(modelJSON) {
    return api.post('/examples/save', modelJSON);
  }
};

export default api;
