import { isTrue } from "../../../Utilities.js";
import { Model } from "../../Model.js";


/** @typedef {import("../../../SharedTypes.js").GraphNode} GraphNode */

const TIME_UNITS = ["SECONDS", "MINUTES", "HOURS", "DAYS", "WEEKS", "MONTHS", "YEARS"];


/**
 * Validates that an object only has the allowedKeys. Keys that aren't
 * on the list but start with "_" are ignored.
 * 
 * @param {string} label
 * @param {object} object 
 * @param {Object<string, string|string[]>} allowed 
 * @param {string[]} errors
 * 
 * @return {boolean} - true if there were no errors
 */
function validateKeys(label, object, allowed, errors) {
  let startErrorsLength = errors.length;

  let keys = Object.keys(object);

  for (let key of keys) {
    if (key[0] === "_") {
      continue;
    }

    if (!(key in allowed)) {
      errors.push(`在${label}中发现无效属性 "${key}"。允许的属性为：${Object.keys(allowed).map(k => `"${k}"`).join(", ")}。`);
      continue;
    } else {
      let type = allowed[key];
      if (type === "string") {
        if (object[key] === null && (key === "from" || key === "to" || key === "signStart" || key === "signEnd")) {
          continue;
        }
        if (typeof object[key] !== "string") {
          errors.push(`属性 "${key}" 需要字符串值。实际值：${object[key]}`);
        }
      } else if (type === "number") {
        if (typeof object[key] !== "number") {
          errors.push(`属性 "${key}" 需要数值。实际值：${object[key]}`);
        }
      } else if (type === "boolean") {
        if (typeof object[key] !== "boolean") {
          errors.push(`属性 "${key}" 需要布尔值。实际值：${object[key]}`);
        }
      } else if (type === "equation") {
        if (typeof object[key] !== "number" && typeof object[key] !== "boolean" && typeof object[key] !== "string") {
          errors.push(`属性 "${key}" 的值无效。实际值：${object[key]}`);
        }
      } else if (type === "array") {
        if (!Array.isArray(object[key])) {
          errors.push(`属性 "${key}" 需要数组值。实际值：${object[key]}`);
        }
      } else if (type === "point") {
        if (!Array.isArray(object[key])) {
          errors.push(`属性 "${key}" 需要 [x, y] 坐标值。实际值：${JSON.stringify(object[key])}`);
        } else {
          if (object[key].length !== 2 || typeof object[key][0] !== "number" || typeof object[key][1] !== "number") {
            errors.push(`属性 "${key}" 需要 [x, y] 坐标值。实际值：${JSON.stringify(object[key])}`);
          }
        }
      } else if (type === "object") {
        if ((typeof object[key] !== "object") || object[key] === null || Array.isArray(object[key])) {
          errors.push(`属性 "${key}" 需要对象值。实际值：${JSON.stringify(object[key])}`);
        }
      } else if (Array.isArray(type)) {
        validateEnum(key, object[key], type, errors);
      } else {
        throw new Error(`validateKeys 中存在未知类型 "${type}"。`);
      }
    }
  }

  if (startErrorsLength === errors.length) {
    // no errors were added
    return true;
  }

  return false;
}


/**
 * @param {string} label 
 * @param {string} value 
 * @param {string[]} allowedValues 
 * @param {string[]} errors 
 */
function validateEnum(label, value, allowedValues, errors) {
  if (value === undefined || value === null) {
    return;
  }

  if (typeof value !== "string") {
    errors.push(`属性 "${label}" 的值 "${value}" 无效。允许的值为：${allowedValues.map(k => `"${k}"`).join(", ")}`);
    return;
  }

  if (value[0] === "_") {
    return;
  }

  if (!allowedValues.includes(value)) {
    errors.push(`属性 "${label}" 的值 "${value}" 无效。允许的值为：${allowedValues.map(k => `"${k}"`).join(", ")}`);
  }
}


/**
 * 
 * @param {object} object 
 * @param {string[]} errors 
 */
function validateModel(object, errors) {
  let noErrors = validateKeys(
    "模型",
    object,
    {
      "name": "string",
      "description": "string",
      "file_notes": "string",
      "engine": ["SIMULATION_PACKAGE"],
      "simulation": "object",
      "elements": "array",
      "visualizations": "array",
      "engine_settings": "object",
      "groups": "array"
    },
    errors
  );

  if (!noErrors) {
    return;
  }

  if (object.simulation) {
    validateKeys(
      "仿真配置",
      object.simulation,
      {
        "algorithm": ["RK1", "RK4"],
        "time_start": "number",
        "time_length": "number",
        "time_step": "number",
        "time_units": TIME_UNITS
      }, errors);
  }

  if (object.engine_settings) {
    validateKeys(
      "引擎设置",
      object.engine_settings,
      {
        "units": "array",
        "globals": "string"
      }, errors);


    if (object.engine_settings.units && Array.isArray(object.engine_settings.units)) {
      for (let unit of object.engine_settings.units) {
        validateKeys(
          "单位",
          unit,
          {
            "name": "string",
            "base": "string",
            "factor": "number"
          }, errors);
      }
    }
  }

  if (object.visualizations) {
    for (let visualization of object.visualizations) {
      validateKeys(
        "可视化",
        visualization,
        {
          "type": ["TIME_SERIES", "TABLE"],
          "name": "string",
          "elements": "array"
        }, errors);

      if (!visualization.elements) {
        errors.push("可视化需要元素名称数组");
      } else {
        if (Array.isArray(visualization.elements)) {
          for (let el of visualization.elements) {
            if (typeof el !== "string") {
              errors.push("可视化的元素名称必须是字符串。实际值：" + el);
            }
          }
        }
      }
    }
  }



  if (!object.elements) {
    errors.push("模型必须包含元素数组");
  } else {
    for (let element of object.elements) {
      let allowedBase = {
        "type": ["STOCK", "VARIABLE", "INTERVARIABLE", "CONVERTER", "STATE", "FLOW", "LINK", "TRANSITION"],
        "name": "string",
        "description": "string",
        "behavior": "object",
        "display": "object"
      };
      /** @type {Object<string, string|string[]>} */
      let allowedBehavior = {

      };
      /** @type {Object<string, string|string[]>} */
      let allowedDisplay = {
        symbol: "string"
      };

      function assignProperties(base, behavior, display) {
        Object.assign(allowedBase, base);
        Object.assign(allowedBehavior, behavior);
        Object.assign(allowedDisplay, display);
      }

      if (element.type === "STOCK") {
        assignProperties(
          {},
          {
            initial_value: "equation",
            non_negative: "boolean",
            units: "string"
          }, {
            coordinates: "point",
            size: "point",
            interactive: "boolean",
            interactive_min: "number",
            interactive_max: "number"
          });
      } else if (element.type === "VARIABLE") {
        assignProperties(
          {},
          {
            value: "equation",
            units: "string"
          }, {
            coordinates: "point",
            size: "point",
            interactive: "boolean",
            interactive_min: "number",
            interactive_max: "number"
          });
      } else if (element.type === "INTERVARIABLE") {
        assignProperties(
          {},
          {
            value: "equation",
            units: "string"
          }, {
            coordinates: "point",
            size: "point",
            interactive: "boolean",
            interactive_min: "number",
            interactive_max: "number"
          });
      } else if (element.type === "STATE") {
        assignProperties(
          {},
          {
            initial_value: "equation"
          }, {
            coordinates: "point",
            size: "point",
            interactive: "boolean"
          });
      } else if (element.type === "CONVERTER") {
        assignProperties(
          {},
          {
            input: ["TIME", "ELEMENT"],
            input_element: "string",
            interpolation: ["NONE", "LINEAR"],
            data: "array",
            units: "string"
          }, {
            coordinates: "point",
            size: "point"
          });
      } else if (element.type === "FLOW") {
        assignProperties(
          {
            to: "string",
            from: "string"
          },
          {
            value: "equation",
            non_negative: "boolean",
            units: "string",
          }, {
            to_coordinates: "point",
            from_coordinates: "point",
            interactive: "boolean",
            interactive_min: "number",
            interactive_max: "number",
            signStart: "string",
            signEnd: "string"
          });
      } else if (element.type === "TRANSITION") {
        assignProperties(
          {
            to: "string",
            from: "string"
          },{
            value: "equation",
            trigger: ["PROBABILITY", "TIMEOUT", "CONDITION"]
          }, {
            to_coordinates: "point",
            from_coordinates: "point",
            interactive: "boolean",
            interactive_min: "number",
            interactive_max: "number"
          });
      } else if (element.type === "LINK") {
        assignProperties(
          {
            to: "string",
            from: "string"
          },{
            polarity: ["NEUTRAL", "POSITIVE", "NEGATIVE"]
          }, {
            to_coordinates: "point",
            from_coordinates: "point",
            signStart: "string",
            signEnd: "string"
          });
      }

      if (validateKeys("元素", element, allowedBase, errors)) {
        if (element.behavior) {
          validateKeys("元素的 \"behavior\"", element.behavior, allowedBehavior, errors);
        }
        if (element.display) {
          validateKeys("元素的 \"display\"", element.display, allowedDisplay, errors);
        }
      }
    }
  }

  if (object.groups) {
    for (const group of object.groups) {
      validateKeys("分组", group, {
        "name": "string",
        "color": "string",
        "collapsed": "boolean",
        "childNames": "array"
      }, errors);
    }
  }
}




/**
 * @param {string} units
 */
function mapTimeUnits(units) {
  const uc = (units || "").toUpperCase();

  if (TIME_UNITS.includes(uc)) {
    return uc;
  }

  return "DAYS";
}


/**
 * @param {string} val 
 * @returns 
 */
function toNumberOrString(val) {
  if (val == null) return "";

  const trimmed = val.trim();
  const parsed = parseFloat(trimmed);
  
  if (!isNaN(parsed) && /^[+-]?\d+(\.\d+)?$/.test(trimmed)) {
    return parsed;
  }

  return trimmed;
}


/**
 * @param {GraphNode} node 
 * @param {{x: number, y: number}} coordinates 
 */
function shiftGeometry(node, coordinates) {
  let newCoords = { x: coordinates.x, y: coordinates.y };
  let p = node.parent;
  
  while (p && p.geometry) {
    newCoords.x += p.geometry.x;
    newCoords.y += p.geometry.y;
    p = p.parent;
  }

  newCoords.x = Math.round(newCoords.x);
  newCoords.y = Math.round(newCoords.y);

  return newCoords;
}



/**
 * @type {Object<string, function(GraphNode, Model):object>}
 */
let processors = {
  base: (element) => {
    let el = {
      name: element.getAttribute("name"),
    };

    if (element.value.nodeName === "Link" && el.name === "Link") {
      // "Link" isn't shown in the UI on Links, so we remove it from the JSON
      delete el.name;
    }

    if (element.getAttribute("Note")) {
      el.description = element.getAttribute("Note");
    }

    let interactive = isTrue(element.getAttribute("ShowSlider"));

    if (interactive) {
      el.display = {
        interactive: true
      };
    }

    let symbol = element.getAttribute("Image");
    if (symbol && symbol.startsWith("emoji:")) {
      el.display = el.display || {};
      el.display.symbol = symbol.slice(6);
    }

    return el;
  },
  // mixins
  node: (element) => {
    let c = shiftGeometry(element, element.geometry);
    return {
      display: {
        coordinates: [c.x, c.y],
        size: [element.geometry.width, element.geometry.height]
      }
    };
  },
  connector: (element) => {
    let base = {
      from: element.source ? element.source.getAttribute("name") : null,
      to: element.target ? element.target.getAttribute("name") : null,
    };


    if (!element.source || !element.target) {
      let display = {};

      if (!element.source && element.geometry.sourcePoint) {
        let c = shiftGeometry(element, element.geometry.sourcePoint);
        display.from_coordinates = [c.x, c.y];
        base.display = display;
      }

      if (!element.target && element.geometry.targetPoint) {
        let c = shiftGeometry(element, element.geometry.targetPoint);
        display.to_coordinates = [c.x, c.y];
        base.display = display;
      }
    }

    return base;
  },
  scalarInteractive: (element) => {
    let shouldShowSlider = isTrue(element.getAttribute("ShowSlider"));

    if (!shouldShowSlider) {
      return null;
    }

    return {
      display: {
        interactive_min: +element.getAttribute("SliderMin"),
        interactive_max: +element.getAttribute("SliderMax")
      }
    };
  },
  units: (element) => {
    let units = element.getAttribute("Units");
    if (units && units.toLowerCase() !== "unitless" && units !== "1") {
      return {
        behavior: {
          units
        }
      };
    }
  },
  // types
  Stock: (element) => {
    let el = {
      type: "STOCK",
      behavior: {
        initial_value: toNumberOrString(element.getAttribute("InitialValue"))
      },
    };
    if (isTrue(element.getAttribute("NonNegative"))) {
      el.behavior.non_negative = true;
    }
    return el;
  },
  Flow: (element) => {
    let el = {
      type: "FLOW",
      behavior: {
        value: toNumberOrString(element.getAttribute("FlowRate")),
      },
    };

    if (isTrue(element.getAttribute("OnlyPositive"))) {
      el.behavior.non_negative = true;
    }
    return el;
  },
  Variable: (element) => {
    let res = {
      type: "VARIABLE"
    };

    let eq = element.getAttribute("Equation");

    if (eq !== undefined && eq !== "") {
      res.behavior = {
        value: toNumberOrString(eq),
      };
    }
    return res;
  },
  Intervariable: (element) => {
    let res = {
      type: "INTERVARIABLE"
    };

    let eq = element.getAttribute("Equation");

    if (eq !== undefined && eq !== "") {
      res.behavior = {
        value: toNumberOrString(eq),
      };
    }
    return res;
  },
  Converter: (element, model) => {
    let rawData = element.getAttribute("Data") || "";
    let pairs = [];
    rawData.split(";").forEach(token => {
      let t = token.trim();
      if (!t) return;
      let match = t.split(",").map(x => x.trim());
      if (match.length === 2) {
        let inVal = parseFloat(match[0]);
        let outVal = parseFloat(match[1]);
        if (!isNaN(inVal) && !isNaN(outVal)) {
          pairs.push([inVal, outVal]);
        } else {
          console.warn(`Invalid data pair in Converter: "${t}". Expected format "input,output".`);
        }
      } else if (match.length) {
        console.warn(`Invalid data pair in Converter: "${t}". Expected format "input,output".`);
      }
    });

    /** @type {string} */
    let sourceAttr = element.getAttribute("Source") || "";
    let source = "ELEMENT";
    let sourceElement = "";
    if (sourceAttr === "Time") {
      source = "TIME";
    } else {
      let el = model.getId(sourceAttr);
      sourceElement = el ? el._node.getAttribute("name") : "";
    }

    let interpolation = element.getAttribute("Interpolation");

    let el = {
      type: "CONVERTER",
      behavior: {
        input: source,
        interpolation: interpolation === "Linear" ? "LINEAR" : "NONE",
        data: pairs,
      },
    };

    if (source === "ELEMENT") {
      el.behavior.input_element = sourceElement;
    }

    return el;
  },
  State: (element) => {
    return {
      type: "STATE",
      behavior: {
        initial_value: isTrue(element.getAttribute("Active")),
      },
    };
  },
  Transition: (element) => {
    let trigger = element.getAttribute("Trigger");
    if (trigger === "Probability") {
      trigger = "PROBABILITY";
    } else if (trigger === "Condition") {
      trigger = "CONDITION";
    } else if (trigger === "Timeout") {
      trigger = "TIMEOUT";
    } else {
      console.warn(`Unknown trigger type in Transition: "${trigger}". Expected "Probability", "Condition", or "Timeout".`);
    }

    return {
      type: "TRANSITION",
      behavior: {
        trigger,
        value: toNumberOrString(element.getAttribute("Value"))
      },
    };
  },
  Link: (element) => {
    let el = {
      type: "LINK"
    };

    let style = element.style;

    if (style?.includes?.("END_ANNOTATION=+")) {
      el.behavior = {
        polarity: "POSITIVE"
      };
    } else if (style?.includes?.("END_ANNOTATION=-")) {
      el.behavior = {
        polarity: "NEGATIVE"
      };
    }
    

    return el;
  },
};





/**
   * @param {Model} model
   * @param {string} id 
   */
function idToName(model, id) {
  try {
    let primitive = model.getId(id);
    return primitive.name;
  } catch (e) {
    // if the primitive with the given id doesn't exist, return null
    return null;
  }
}


/**
 * Converts a Model object into a JSON string following the ModelJSON specification.
 * 
 * @param {Model} model
 * @returns {object} The ModleJSON object representing the model.
 */
export function createModelJSON(model) {
  const fileNotes = [];

  const mySetting = model.settings;
  const sim = {
    algorithm: mySetting.getAttribute("SolutionAlgorithm") === "RK1" ? "RK1" : "RK4",
    time_start: parseFloat(mySetting.getAttribute("TimeStart") || "0"),
    time_length: parseFloat(mySetting.getAttribute("TimeLength") || "10"),
    time_step: parseFloat(mySetting.getAttribute("TimeStep") || "1"),
    time_units: mapTimeUnits(mySetting.getAttribute("TimeUnits"))
  };


  /** @type {Object<string, object>} */
  let nameMap = Object.create(null);
  const elements = [];

  function doProcessors(types, node) {
    /** @type {any} */
    let element = {};
    for (let type of types) {
      if (processors[type]) {
        let data = processors[type](node._node, node.model);
        if (data) {
          // merge data into element, objects with the same key will also be merged
          for (let key in data) {
            if (key in element) {
              if (key === "behavior" && type[0].toUpperCase() === type[0]) {
                // the type specific behavior properties should be first
                element[key] = { ...data[key], ...element[key] };
              } else {
                element[key] = { ...element[key], ...data[key] };
              }

            } else {
              element[key] = data[key];
            }
          }
        }
      }
    }

    // for cleanup
    let finalElement = {
      type: element.type
    };

    if (element.name) {
      finalElement.name = element.name;
    }

    if (element.description) {
      finalElement.description = element.description;
    }

    Object.assign(finalElement, element);

    elements.push(finalElement);

    if ("name" in element) {
      if (element.type !== "LINK" && nameMap[element.name.toLowerCase()]) {
        throw new Error(`Duplicate primitive name: ${element.name}. Primitives other than links must have unique names in ModelJSON.`);
      }

      nameMap[element.name.toLowerCase()] = finalElement;
    }
  }

  let items = model.find();
  items.forEach(item => {
    switch (item._node.value.nodeName) {
    case "Stock":
      return doProcessors(["base", "scalarInteractive", "node", "units", "Stock"], item);
    case "Flow":
      return doProcessors(["base", "scalarInteractive", "connector", "units", "Flow"], item);
    case "Variable":
      return doProcessors(["base", "scalarInteractive", "node", "units", "Variable"], item);
    case "Intervariable":
      return doProcessors(["base", "scalarInteractive", "node", "units", "Intervariable"], item);
    case "Converter":
      return doProcessors(["base", "node", "units", "Converter"], item);
    case "State":
      return doProcessors(["base", "node", "State"], item);
    case "Transition":
      return doProcessors(["base", "connector", "Transition"], item);
    case "Link":
      return doProcessors(["base", "connector", "Link"], item);
    case "Text":
      return;
    case "Picture":
      return;
    case "Display":
      return;
    case "Setting":
      return;
    case "Ghost":
      return;
    case "Folder":
      return;
    default:
      fileNotes.push(`Skipped primitive: ${item._node.getAttribute("name") || "Unnamed"}`);
    }
  });



  // Construct JSON
  const modelJSON = {
    engine: "SIMULATION_PACKAGE",
  };

  if (fileNotes.length) {
    modelJSON.file_notes = fileNotes.join("\n") || undefined;
  }

  if (model.name) {
    modelJSON.name = model.name;
  }
  if (model.description) {
    modelJSON.description = model.description;
  }

  modelJSON.simulation = sim;
  modelJSON.elements = elements;

  let engineSettings = {};

  let customUnits = model.customUnits;
  if (customUnits.length) {
    engineSettings.units = customUnits.map(u => {
      let o = {
        name: u.name,
      };

      if (u.target?.trim()) {
        o.base = u.target;
        o.factor = u.scale;
      }

      return o;
    });
  }

  if (model.globals?.trim()) {
    engineSettings.globals = model.globals;
  }

  if (Object.keys(engineSettings).length) {
    modelJSON.engine_settings = engineSettings;
  }


  let visualizations = [];
  model.visualizations.forEach(display => {
    if (display.type === "Time Series" || display.type === "Tabular" || display.type === "Scatterplot") {
      let viz = {
        name: display.name,
      };
      if (display.type === "Scatterplot" || display.type === "Time Series") {
        viz.type = "TIME_SERIES";
      } else if (display.type === "Tabular") {
        viz.type = "TABLE";
      }
      viz.elements = display.primitives.map(id => idToName(model, id)).filter(n => !!n);
      
      if (viz.elements.length) {
        visualizations.push(viz);
      }
    }
  });

  if (visualizations.length) {
    modelJSON.visualizations = visualizations;
  }


  return modelJSON;
}



/**
 * Loads a ModelJSON string into a new Model instance.
 * 
 * @param {object} data
 * @returns {Model} A new Model object reflecting the parsed ModelJSON.
 */
export function loadModelJSON(data) {
  if (!data || !(data instanceof Object)) {
    throwModelJSONError(["ModelJSON 数据不是有效的对象。"]);
  }


  /** @type {string[]} */
  let errors = [];


  validateModel(data, errors);
  

  const model = new Model();


  if (data.name) {
    model.name = data.name;
  }
  if (data.description) {
    model.description = data.description;
  }
  const sim = data.simulation || {};

  model.algorithm = sim.algorithm === "RK1" ? "Euler" : "RK4";
  model.timeStart = sim.time_start ?? 0;
  model.timeLength = sim.time_length ?? 10;
  model.timeStep = sim.time_step ?? 1;
  let units = sim.time_units;
  if (!units) {
    // default units to years
    model.timeUnits = "Years";
  } else if (TIME_UNITS.includes(units)) {
    model.timeUnits = units.charAt(0) + units.slice(1).toLowerCase();
  }


  const elements = Array.isArray(data.elements) ? data.elements.slice() : [];

  const TYPE_ORDER = {
    "STOCK": 1,
    "VARIABLE": 1,
    "INTERVARIABLE": 1,
    "STATE": 1,
    "FLOW": 3,
    "TRANSITION": 3,
    "CONVERTER": 4,
    "LINK": 5
  };

  elements.sort((a, b) => (TYPE_ORDER[a.type] || 99) - (TYPE_ORDER[b.type] || 99));

  const nameMap = Object.create(null);

  // We need to run this after everything is created
  // converters by depend on other converters.
  let converterFns = [];

  /** @type {number} */
  let elementIndex = -1;
  for (const el of elements) {
    elementIndex++;

    const { type, name, description, behavior = {}, display = {} } = el;
    
    let newPrimitive = null;

    /**
     * @param {import("../../Blocks").Primitive} prim
     */
    function setGeometry(prim) {
      const [x, y] = display.coordinates || [0, 0];
      const [w, h] = display.size || [100, 60];


      prim._node.geometry.x = x;
      prim._node.geometry.y = y;
      prim._node.geometry.width = w;
      prim._node.geometry.height = h;
    }


    switch (type) {
    case "STOCK": {
      newPrimitive = model.Stock({
        name,
        initial: behavior.initial_value ?? "0",
        nonNegative: !!behavior.non_negative
      });

      if (behavior.units) {
        newPrimitive._node.setAttribute("Units", behavior.units);
      }
      setGeometry(newPrimitive);
      break;
    }

    case "VARIABLE": {
      newPrimitive = model.Variable({
        name,
        value: behavior.value ?? ""
      });
      if (behavior.units) {
        newPrimitive._node.setAttribute("Units", behavior.units);
      }
      setGeometry(newPrimitive);
      break;
    }

    case "INTERVARIABLE": {
      newPrimitive = model.Intervariable({
        name,
        value: behavior.value ?? ""
      });
      if (behavior.units) {
        newPrimitive._node.setAttribute("Units", behavior.units);
      }
      setGeometry(newPrimitive);
      break;
    }

    case "STATE": {
      newPrimitive = model.State({
        name,
        startActive: behavior.initial_value ?? false
      });
      setGeometry(newPrimitive);
      break;
    }

    case "CONVERTER": {

      let values = [];
      if (behavior.data) {
        for (let row of behavior.data) {
          if (!Array.isArray(row) || row.length!== 2) {
            errors.push("Converter data should be an array of [x, y] pairs, got a row of : " + row);
            continue;
          }
          values.push({ x: row[0], y: row[1] });
        }
      }
      const interp = (behavior.interpolation === "LINEAR") ? "Linear" : "None";

      newPrimitive = model.Converter({
        name,
        values
      });

      setGeometry(newPrimitive);

      newPrimitive._node.setAttribute("Source", "Time");
      newPrimitive._node.setAttribute("Interpolation", interp);
      if (behavior.units) {
        newPrimitive._node.setAttribute("Units", behavior.units);
      }

      if (behavior.input === "ELEMENT") {
        if (!behavior.input_element) {
          errors.push(`转换器 "${name}" 缺少输入元素。`);
        } else{
          converterFns.push(() => {
            if (behavior.input_element.toLowerCase() in nameMap) {
              let el = nameMap[behavior.input_element.toLowerCase()];
              // check that there is a link between the converter and the input element
              let connected = !!model.findLinks((l) => l.start === el && l.end === newPrimitive).length;

              if (!connected) {
                errors.push(`转换器输入元素 "${behavior.input_element}" 未连接到转换器 "${name}"。`);
              } else {
                newPrimitive._node.setAttribute("Source", el.id);
              }
            } else {
              errors.push(`转换器输入元素 "${behavior.input_element}" 未找到。`);
            }
          });
        }
      }

      break;
    }

    case "FLOW": {
      const fromName = el.from || null;
      const toName = el.to || null;
      if (fromName && !(fromName.toLowerCase() in nameMap)) {
        errors.push(`流量 "from" 元素 "${fromName}" 未找到。`);
      }
      if (toName && !(toName.toLowerCase() in nameMap)) {
        errors.push(`流量 "to" 元素 "${toName}" 未找到。`);
      }
      const fromPrim = fromName ? nameMap[fromName.toLowerCase()] : null;
      const toPrim = toName ? nameMap[toName.toLowerCase()] : null;

      newPrimitive = model.Flow(fromPrim, toPrim, {
        name,
        rate: behavior.value ?? "0",
        nonNegative: !!behavior.non_negative
      });

      if (!fromPrim && display.from_coordinates) {
        newPrimitive._node.geometry.sourcePoint = {
          x: display.from_coordinates[0],
          y: display.from_coordinates[1]
        };
      }
      if (!toPrim && display.to_coordinates) {
        newPrimitive._node.geometry.targetPoint = {
          x: display.to_coordinates[0],
          y: display.to_coordinates[1]
        };
      }
      if (behavior.units) {
        newPrimitive._node.setAttribute("Units", behavior.units);
      }
      break;
    }

    case "TRANSITION": {
      const fromName = el.from || null;
      const toName = el.to || null;
      if (fromName && !(fromName.toLowerCase() in nameMap)) {
        errors.push(`转换 "from" 元素 "${fromName}" 未找到。`);
      }
      if (toName && !(toName.toLowerCase() in nameMap)) {
        errors.push(`转换 "to" 元素 "${toName}" 未找到。`);
      }
      const fromPrim = fromName ? nameMap[fromName.toLowerCase()] : null;
      const toPrim = toName ? nameMap[toName.toLowerCase()] : null;

      newPrimitive = model.Transition(fromPrim, toPrim, {
        name,
        value: behavior.value ?? ""
      });

      if (!fromPrim && display.from_coordinates) {
        newPrimitive._node.geometry.sourcePoint = {
          x: display.from_coordinates[0],
          y: display.from_coordinates[1]
        };
      }
      if (!toPrim && display.to_coordinates) {
        newPrimitive._node.geometry.targetPoint = {
          x: display.to_coordinates[0],
          y: display.to_coordinates[1]
        };
      }

      let trigVal = null;
      if ((!behavior.trigger) || behavior.trigger === "TIMEOUT") {
        // default to TIMEOUT
        trigVal = "Timeout";
      } else if (behavior.trigger === "CONDITION") {
        trigVal = "Condition";
      } else if (behavior.trigger === "PROBABILITY") {
        trigVal = "Probability";
      }

      newPrimitive._node.setAttribute("Trigger", trigVal);
      break;
    }

    case "LINK": {
      const fromName = el.from || null;
      const toName = el.to || null;
      if (fromName && !(fromName.toLowerCase() in nameMap)) {
        errors.push(`连接 "from" 元素 "${fromName}" 未找到。`);
      }
      if (toName && !(toName.toLowerCase() in nameMap)) {
        errors.push(`连接 "to" 元素 "${toName}" 未找到。`);
      }
      const fromPrim = fromName ? nameMap[fromName.toLowerCase()] : null;
      const toPrim = toName ? nameMap[toName.toLowerCase()] : null;

      newPrimitive = model.Link(fromPrim, toPrim, {
        name
      });

      if (!fromPrim && display.from_coordinates) {
        newPrimitive._node.geometry.sourcePoint = {
          x: display.from_coordinates[0],
          y: display.from_coordinates[1]
        };
      }
      if (!toPrim && display.to_coordinates) {
        newPrimitive._node.geometry.targetPoint = {
          x: display.to_coordinates[0],
          y: display.to_coordinates[1]
        };
      }

      if (behavior.polarity === "POSITIVE") {
        newPrimitive._node.style = "END_ANNOTATION=+";
      } else if (behavior.polarity === "NEGATIVE") {
        newPrimitive._node.style = "END_ANNOTATION=-";
      }

      break;
    }

    default:
      let errorMessage = "";
      if (type) {
        errorMessage = `未知元素类型：${type}。应为 "STOCK"、"VARIABLE"、"STATE"、"CONVERTER"、"FLOW"、"TRANSITION" 或 "LINK"。`;
      } else {
        errorMessage = `元素缺少类型：${JSON.stringify(el)}。`;
      }

      errorMessage += ` 索引位置：${elementIndex}。`;
      errors.push(errorMessage);

      break;
    }

    if (newPrimitive) {
      if (description) {
        newPrimitive._node.setAttribute("Note", description);
      }
      if (display.interactive) {
        newPrimitive._node.setAttribute("ShowSlider", "true");
        if ("interactive_min" in display) {
          newPrimitive._node.setAttribute("SliderMin", display.interactive_min);
        }
        if ("interactive_max" in display) {
          newPrimitive._node.setAttribute("SliderMax", display.interactive_max);
        }
      }
      if (display.symbol) {
        newPrimitive._node.setAttribute("Image", `emoji:${display.symbol}`);
      } 

      if (name && type !== "LINK") {
        if (nameMap[name.toLowerCase()]) {
          errors.push(`重复的元素名称：${name}。除 LINK 外，所有元素名称必须唯一（不区分大小写）。`);
        }

        nameMap[name.toLowerCase()] = newPrimitive;
      }
    }
  }


  for (const fn of converterFns) {
    fn();
  }


  if (data.engine_settings?.units && Array.isArray(data.engine_settings.units)) {
    model.customUnits = data.engine_settings.units.map(u => ({
      name: u.name,
      target: ("base" in u) ? u.base : "",
      scale: ("factor" in u) ? u.factor : 1
    }));
  }

  if (data.engine_settings?.globals) {
    model.globals = data.engine_settings.globals;
  }


  if (Array.isArray(data.visualizations)) {
    data.visualizations.forEach((viz) => {
      const { type, name, elements = [] } = viz;
      let dType = "Time Series";
      if (type === "TABLE") {
        dType = "Tabular";
      }

      const ids = elements
        .map(nm => nameMap[nm.toLowerCase()] ? nameMap[nm.toLowerCase()].id : null)
        .filter(id => !!id);

      model.visualizations.push({
        name,
        type: dType,
        primitives: ids
      });
    });
  }

  if (errors.length) {
    throwModelJSONError(errors);
  }

  return model;
}


class ModelJSONError extends Error {
  constructor(message, errorList = []) {
    super(message);
    this.name = "ModelJSONError";
    this.errors = errorList;
  }
}

/**
 * 
 * @param {string[]} errorList 
 */
function throwModelJSONError(errorList) {
  const message = `加载模型 JSON 时发生错误：\n\n${errorList.map(e => "- " + e).join("\n")}`;
  throw new ModelJSONError(message, errorList);
}
