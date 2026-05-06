import { SHAPE_MAP, COLORS, NODE_TYPES, EDGE_TYPES } from './constants.js';

import { LABELS } from './constants.js';

let nameCounter = {};

const TYPE_BASE_NAMES = {
  STOCK: '存量',
  VARIABLE: '变量',
  CONVERTER: '转换器',
  STATE: '状态',
  FLOW: '流量'
};

function nextName(type) {
  if (!nameCounter[type]) nameCounter[type] = 0;
  nameCounter[type]++;
  const base = TYPE_BASE_NAMES[type] || type;
  return `${base} ${nameCounter[type]}`;
}

export function resetNameCounter() {
  nameCounter = {};
}

export function createDefaultElement(type, overrides = {}) {
  const defaults = {
    STOCK: { behavior: { initial_value: 0, non_negative: false }, display: { size: [150, 60] } },
    VARIABLE: { behavior: { value: '0' }, display: { size: [130, 60] } },
    CONVERTER: { behavior: { input: 'TIME', interpolation: 'LINEAR', data: [[0, 0], [1, 1]] }, display: { size: [120, 70] } },
    STATE: { behavior: { initial_value: false }, display: { size: [130, 50] } },
    FLOW: { behavior: { value: '0', non_negative: false }, display: {} },
    LINK: { behavior: {}, display: {} }
  };

  const name = type === 'LINK' ? '' : nextName(type);
  const def = defaults[type] || {};

  return {
    type,
    name,
    ...def,
    ...overrides,
    behavior: { ...def.behavior, ...(overrides.behavior || {}) },
    display: { ...def.display, ...(overrides.display || {}) }
  };
}

export function modelJSONToGraph(modelJSON, graph) {
  graph.clearCells();
  if (!modelJSON || !modelJSON.elements) return;

  const nodeMap = {};

  // First pass: create nodes
  for (let i = 0; i < modelJSON.elements.length; i++) {
    const el = modelJSON.elements[i];
    if (!NODE_TYPES.includes(el.type)) continue;

    const coords = el.display?.coordinates || [100 + i * 150, 200];
    const size = el.display?.size || [130, 60];
    const color = COLORS[el.type] || COLORS.VARIABLE;

    const node = graph.addNode({
      shape: SHAPE_MAP[el.type],
      x: coords[0],
      y: coords[1],
      width: size[0],
      height: size[1],
      label: el.name,
      attrs: {
        body: { fill: color.fill, stroke: color.stroke },
        label: { fill: color.text }
      },
      data: { elementIndex: i, primitiveType: el.type },
      ports: {
        groups: {
          top: { position: 'top', attrs: { circle: { r: 5, magnet: true, stroke: color.stroke, fill: '#fff', strokeWidth: 1.5 } } },
          bottom: { position: 'bottom', attrs: { circle: { r: 5, magnet: true, stroke: color.stroke, fill: '#fff', strokeWidth: 1.5 } } },
          left: { position: 'left', attrs: { circle: { r: 5, magnet: true, stroke: color.stroke, fill: '#fff', strokeWidth: 1.5 } } },
          right: { position: 'right', attrs: { circle: { r: 5, magnet: true, stroke: color.stroke, fill: '#fff', strokeWidth: 1.5 } } }
        },
        items: [
          { group: 'top', id: 'top' },
          { group: 'bottom', id: 'bottom' },
          { group: 'left', id: 'left' },
          { group: 'right', id: 'right' }
        ]
      }
    });
    nodeMap[el.name] = node;
    nodeMap[i] = node;
  }

  const edgeMap = {};

  // Second pass: create FLOW edges first (LINKs may reference them)
  for (let i = 0; i < modelJSON.elements.length; i++) {
    const el = modelJSON.elements[i];
    if (el.type !== 'FLOW') continue;

    const color = COLORS[el.type] || COLORS.LINK;
    let sourceNode = nodeMap[el.from];
    let targetNode = nodeMap[el.to];

    // Create cloud nodes for flows with no source/target
    if (!sourceNode) {
      let cx, cy;
      if (el.display?.from_coordinates) {
        cx = el.display.from_coordinates[0];
        cy = el.display.from_coordinates[1];
      } else if (targetNode) {
        const tPos = targetNode.getPosition();
        cx = tPos.x - 80;
        cy = tPos.y + 20;
      } else {
        cx = 100;
        cy = 200;
      }
      sourceNode = graph.addNode({
        shape: 'sd:cloud',
        x: cx - 15,
        y: cy - 11,
        width: 30,
        height: 22,
        data: { elementIndex: -1, isCloud: true, primitiveType: 'CLOUD' },
      });
    }
    if (!targetNode) {
      let cx, cy;
      if (el.display?.to_coordinates) {
        cx = el.display.to_coordinates[0];
        cy = el.display.to_coordinates[1];
      } else if (sourceNode) {
        const sPos = sourceNode.getPosition();
        const sSize = sourceNode.getSize();
        cx = sPos.x + (sSize.width || 120) + 60;
        cy = sPos.y + 20;
      } else {
        cx = 300;
        cy = 200;
      }
      targetNode = graph.addNode({
        shape: 'sd:cloud',
        x: cx - 15,
        y: cy - 11,
        width: 30,
        height: 22,
        data: { elementIndex: -1, isCloud: true, primitiveType: 'CLOUD' },
      });
    }

    const edgeConfig = {
      shape: SHAPE_MAP[el.type],
      source: { cell: sourceNode.id },
      target: { cell: targetNode.id },
      attrs: {
        line: { stroke: color.stroke }
      },
      data: {
        elementIndex: i,
        primitiveType: el.type,
        signStart: el.display?.signStart || null,
        signEnd: el.display?.signEnd || null
      },
      labels: el.name ? [{ attrs: { label: { text: el.name } } }] : undefined
    };

    const edge = graph.addEdge(edgeConfig);
    if (el.name) edgeMap[el.name] = edge;
  }

  // Third pass: create LINK edges (may connect to FLOW edges)
  for (let i = 0; i < modelJSON.elements.length; i++) {
    const el = modelJSON.elements[i];
    if (el.type !== 'LINK') continue;

    const color = COLORS[el.type] || COLORS.LINK;
    let source = nodeMap[el.from] || edgeMap[el.from];
    let target = nodeMap[el.to] || edgeMap[el.to];

    if (!source || !target) continue;

    const edgeConfig = {
      shape: SHAPE_MAP[el.type],
      source: { cell: source.id },
      target: { cell: target.id },
      attrs: {
        line: { stroke: color.stroke }
      },
      data: {
        elementIndex: i,
        primitiveType: el.type,
        signStart: el.display?.signStart || null,
        signEnd: el.display?.signEnd || null
      },
      labels: el.name ? [{ attrs: { label: { text: el.name } } }] : undefined
    };

    graph.addEdge(edgeConfig);
  }
}

export function graphToModelJSON(graph, baseModelJSON) {
  const elements = [];
  const cells = graph.getCells();
  const indexMap = {};

  // Process nodes first
  for (const cell of cells) {
    if (!cell.isNode()) continue;
    const data = cell.getData();
    if (!data) continue;

    const origIndex = data.elementIndex;
    const origElement = baseModelJSON?.elements?.[origIndex] || {};

    const element = {
      ...origElement,
      type: data.primitiveType,
      name: cell.getAttrByPath('label/text') || cell.prop('labels/0/attrs/label/text') || origElement.name || '',
      display: {
        ...(origElement.display || {}),
        coordinates: [Math.round(cell.getPosition().x), Math.round(cell.getPosition().y)],
        size: [Math.round(cell.getSize().width), Math.round(cell.getSize().height)]
      }
    };

    indexMap[cell.id] = elements.length;
    elements.push(element);
  }

  // Process edges
  for (const cell of cells) {
    if (!cell.isEdge()) continue;
    const data = cell.getData();
    if (!data) continue;

    const origIndex = data.elementIndex;
    const origElement = baseModelJSON?.elements?.[origIndex] || {};

    const sourceCell = cell.getSourceCell();
    const targetCell = cell.getTargetCell();

    const isSourceCloud = sourceCell?.getData()?.isCloud;
    const isTargetCloud = targetCell?.getData()?.isCloud;

    const fromName = isSourceCloud ? null
      : sourceCell ? elements[indexMap[sourceCell.id]]?.name
      : origElement.from;
    const toName = isTargetCloud ? null
      : targetCell ? elements[indexMap[targetCell.id]]?.name
      : origElement.to;

    const element = {
      ...origElement,
      type: data.primitiveType,
      from: fromName || null,
      to: toName || null,
      display: {
        ...(origElement.display || {}),
        ...(data.signStart ? { signStart: data.signStart } : {}),
        ...(data.signEnd ? { signEnd: data.signEnd } : {})
      }
    };

    if (isSourceCloud && sourceCell) {
      const pos = sourceCell.getPosition();
      element.display.from_coordinates = [Math.round(pos.x + 15), Math.round(pos.y + 11)];
    } else if (!sourceCell) {
      const sourcePoint = cell.getSourcePoint();
      element.display.from_coordinates = [Math.round(sourcePoint.x), Math.round(sourcePoint.y)];
    }
    if (isTargetCloud && targetCell) {
      const pos = targetCell.getPosition();
      element.display.to_coordinates = [Math.round(pos.x + 15), Math.round(pos.y + 11)];
    } else if (!targetCell) {
      const targetPoint = cell.getTargetPoint();
      element.display.to_coordinates = [Math.round(targetPoint.x), Math.round(targetPoint.y)];
    }

    elements.push(element);
  }

  return {
    ...baseModelJSON,
    elements
  };
}
