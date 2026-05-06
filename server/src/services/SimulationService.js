import { loadModelJSON } from '../../../src/api/Model.js';

export class SimulationService {
  simulate(modelJSON) {
    const model = loadModelJSON(modelJSON);
    const results = model.simulate();

    const times = results.times();
    const primitives = model.find();
    const series = {};

    for (const primitive of primitives) {
      try {
        const data = results.series(primitive);
        if (data && data.length > 0) {
          series[primitive.name] = data;
        }
      } catch (e) {
        // skip primitives without time series data
      }
    }

    // Build table
    const table = times.map((t, i) => {
      const row = { _time: t };
      for (const [name, data] of Object.entries(series)) {
        row[name] = data[i];
      }
      return row;
    });

    return {
      times,
      timeUnits: results.timeUnits || modelJSON.simulation?.time_units || '',
      series,
      table
    };
  }

  validate(modelJSON) {
    const model = loadModelJSON(modelJSON);
    const errors = model.check();
    return {
      valid: !errors || errors.length === 0,
      errors: (errors || []).map(e => ({
        message: e.message || String(e),
        primitiveName: e.primitiveName || null,
        code: e.code || null
      }))
    };
  }
}
