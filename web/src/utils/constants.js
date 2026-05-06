export const PRIMITIVE_TYPES = {
  STOCK: 'STOCK',
  VARIABLE: 'VARIABLE',
  CONVERTER: 'CONVERTER',
  FLOW: 'FLOW',
  LINK: 'LINK',
  STATE: 'STATE'
};

export const NODE_TYPES = [PRIMITIVE_TYPES.STOCK, PRIMITIVE_TYPES.VARIABLE, PRIMITIVE_TYPES.CONVERTER, PRIMITIVE_TYPES.STATE, 'CLOUD'];
export const EDGE_TYPES = [PRIMITIVE_TYPES.FLOW, PRIMITIVE_TYPES.LINK];

export const TIME_UNITS = ['SECONDS', 'MINUTES', 'HOURS', 'DAYS', 'WEEKS', 'MONTHS', 'YEARS'];
export const ALGORITHMS = ['Euler', 'RK4'];
export const INTERPOLATIONS = ['LINEAR', 'DISCRETE'];

export const SHAPE_MAP = {
  [PRIMITIVE_TYPES.STOCK]: 'sd:stock',
  [PRIMITIVE_TYPES.VARIABLE]: 'sd:variable',
  [PRIMITIVE_TYPES.CONVERTER]: 'sd:converter',
  [PRIMITIVE_TYPES.STATE]: 'sd:state',
  CLOUD: 'sd:cloud',
  [PRIMITIVE_TYPES.FLOW]: 'sd:flow',
  [PRIMITIVE_TYPES.LINK]: 'sd:link'
};

export const COLORS = {
  STOCK: { fill: '#dbeafe', stroke: '#3b82f6', text: '#1e40af' },
  VARIABLE: { fill: '#fef3c7', stroke: '#f59e0b', text: '#92400e' },
  CONVERTER: { fill: '#ede9fe', stroke: '#8b5cf6', text: '#5b21b6' },
  STATE: { fill: '#d1fae5', stroke: '#10b981', text: '#065f46' },
  CLOUD: { fill: '#e5e7eb', stroke: '#9ca3af', text: '#6b7280' },
  FLOW: { stroke: '#3b82f6' },
  LINK: { stroke: '#9ca3af' }
};

export const LABELS = {
  STOCK: '存量',
  VARIABLE: '变量',
  CONVERTER: '转换器',
  FLOW: '流量',
  LINK: '连接',
  STATE: '状态',
  CLOUD: '源/汇'
};

export const TYPE_LABELS = {
  STOCK: '存量',
  VARIABLE: '变量',
  CONVERTER: '转换器',
  FLOW: '流量',
  LINK: '连接',
  STATE: '状态',
  CLOUD: '源/汇'
};

export const TIME_UNIT_LABELS = {
  SECONDS: '秒',
  MINUTES: '分钟',
  HOURS: '小时',
  DAYS: '天',
  WEEKS: '周',
  MONTHS: '月',
  YEARS: '年'
};

export const ALGORITHM_LABELS = {
  Euler: '欧拉法 (Euler)',
  RK4: '龙格-库塔法 (RK4)'
};

export const INTERPOLATION_LABELS = {
  LINEAR: '线性插值',
  DISCRETE: '离散'
};

export const INPUT_SOURCE_LABELS = {
  TIME: '时间',
  ELEMENT: '元素'
};
