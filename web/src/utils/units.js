/**
 * Categorized unit suggestions for simulation primitives.
 * Based on DEFAULT_UNITS in src/formula/Units.js.
 */

function g(label, units) {
  return { label, options: units.map(u => typeof u === 'string' ? { value: u, label: u } : u) };
}

export const UNIT_GROUPS = [
  g('无量纲', ['Unitless']),
  g('常用中文单位', [
    { value: '人', label: '人（人数）' },
    { value: '个', label: '个（计数）' },
    { value: '万', label: '万（数量级）' },
    { value: '辆', label: '辆（车辆）' },
    { value: '架', label: '架（飞机）' },
    { value: '艘', label: '艘（舰船）' },
    { value: '吨', label: '吨' },
    { value: '万元', label: '万元' },
    { value: '元', label: '元' },
  ]),
  g('时间', ['Seconds', 'Minutes', 'Hours', 'Days', 'Weeks', 'Months', 'Quarters', 'Years']),
  g('长度', ['Meters', 'Centimeters', 'Millimeters', 'Kilometers', 'Inches', 'Feet', 'Yards', 'Miles']),
  g('面积', ['Meters^2', 'Centimeters^2', 'Kilometers^2', 'Acres', 'Hectares']),
  g('体积', ['Meters^3', 'Centimeters^3', 'Liters', 'Gallons']),
  g('质量', ['Grams', 'Kilograms', 'Milligrams', 'Pounds', 'Tonnes']),
  g('货币', ['Dollars', 'Euros']),
  g('速度', ['Meters/Seconds', 'Kilometers/Hours', 'Miles/Hours']),
  g('能量', ['Joules', 'Kilojoules', 'Calories', 'Kilocalories']),
  g('功率', ['Watts', 'Kilowatts', 'Megawatts', 'Gigawatts']),
  g('力学', ['Newtons', 'Pascals', 'Kilopascals', 'Bars', 'Atmospheres']),
  g('电磁', ['Amperes', 'Volts', 'Millivolts', 'Kilovolts', 'Coulombs']),
  g('化学', ['Moles']),
  g('温度', ['Degrees', 'Radians']),
  g('流量常用（/时间）', [
    { value: '1/Years', label: '1/Years' },
    { value: '1/Seconds', label: '1/Seconds' },
    { value: '1/Hours', label: '1/Hours' },
    { value: '1/Days', label: '1/Days' },
    { value: 'Meters/Years', label: 'Meters/Years' },
    { value: 'Kilometers/Years', label: 'Kilometers/Years' },
    { value: 'Kilograms/Years', label: 'Kilograms/Years' },
    { value: 'Dollars/Years', label: 'Dollars/Years' },
    { value: '人/Years', label: '人/Years' },
    { value: '元/Years', label: '元/Years' },
    { value: '万元/Years', label: '万元/Years' },
  ]),
];
