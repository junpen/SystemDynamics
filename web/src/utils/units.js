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
  g('时间', [
    { value: 'Seconds', label: 'Seconds（秒）' },
    { value: 'Minutes', label: 'Minutes（分钟）' },
    { value: 'Hours', label: 'Hours（小时）' },
    { value: 'Days', label: 'Days（天）' },
    { value: 'Weeks', label: 'Weeks（周）' },
    { value: 'Months', label: 'Months（月）' },
    { value: 'Quarters', label: 'Quarters（季度）' },
    { value: 'Years', label: 'Years（年）' },
  ]),
  g('长度', [
    { value: 'Meters', label: 'Meters（米）' },
    { value: 'Centimeters', label: 'Centimeters（厘米）' },
    { value: 'Millimeters', label: 'Millimeters（毫米）' },
    { value: 'Kilometers', label: 'Kilometers（千米）' },
    { value: 'Inches', label: 'Inches（英寸）' },
    { value: 'Feet', label: 'Feet（英尺）' },
    { value: 'Yards', label: 'Yards（码）' },
    { value: 'Miles', label: 'Miles（英里）' },
  ]),
  g('面积', [
    { value: 'Meters^2', label: 'Meters^2（平方米）' },
    { value: 'Centimeters^2', label: 'Centimeters^2（平方厘米）' },
    { value: 'Kilometers^2', label: 'Kilometers^2（平方千米）' },
    { value: 'Acres', label: 'Acres（英亩）' },
    { value: 'Hectares', label: 'Hectares（公顷）' },
  ]),
  g('体积', [
    { value: 'Meters^3', label: 'Meters^3（立方米）' },
    { value: 'Centimeters^3', label: 'Centimeters^3（立方厘米）' },
    { value: 'Liters', label: 'Liters（升）' },
    { value: 'Gallons', label: 'Gallons（加仑）' },
  ]),
  g('质量', [
    { value: 'Grams', label: 'Grams（克）' },
    { value: 'Kilograms', label: 'Kilograms（千克）' },
    { value: 'Milligrams', label: 'Milligrams（毫克）' },
    { value: 'Pounds', label: 'Pounds（磅）' },
    { value: 'Tonnes', label: 'Tonnes（公吨）' },
  ]),
  g('货币', [
    { value: 'Dollars', label: 'Dollars（美元）' },
    { value: 'Euros', label: 'Euros（欧元）' },
  ]),
  g('速度', [
    { value: 'Meters/Seconds', label: 'Meters/Seconds（米/秒）' },
    { value: 'Kilometers/Hours', label: 'Kilometers/Hours（千米/时）' },
    { value: 'Miles/Hours', label: 'Miles/Hours（英里/时）' },
  ]),
  g('能量', [
    { value: 'Joules', label: 'Joules（焦耳）' },
    { value: 'Kilojoules', label: 'Kilojoules（千焦）' },
    { value: 'Calories', label: 'Calories（卡路里）' },
    { value: 'Kilocalories', label: 'Kilocalories（千卡）' },
  ]),
  g('功率', [
    { value: 'Watts', label: 'Watts（瓦特）' },
    { value: 'Kilowatts', label: 'Kilowatts（千瓦）' },
    { value: 'Megawatts', label: 'Megawatts（兆瓦）' },
    { value: 'Gigawatts', label: 'Gigawatts（吉瓦）' },
  ]),
  g('力学', [
    { value: 'Newtons', label: 'Newtons（牛顿）' },
    { value: 'Pascals', label: 'Pascals（帕斯卡）' },
    { value: 'Kilopascals', label: 'Kilopascals（千帕）' },
    { value: 'Bars', label: 'Bars（巴）' },
    { value: 'Atmospheres', label: 'Atmospheres（大气压）' },
  ]),
  g('电磁', [
    { value: 'Amperes', label: 'Amperes（安培）' },
    { value: 'Volts', label: 'Volts（伏特）' },
    { value: 'Millivolts', label: 'Millivolts（毫伏）' },
    { value: 'Kilovolts', label: 'Kilovolts（千伏）' },
    { value: 'Coulombs', label: 'Coulombs（库仑）' },
  ]),
  g('化学', [
    { value: 'Moles', label: 'Moles（摩尔）' },
  ]),
  g('温度', [
    { value: 'Degrees', label: 'Degrees（度）' },
    { value: 'Radians', label: 'Radians（弧度）' },
  ]),
  g('流量常用（/时间）', [
    { value: 'Liters per Second', label: 'Liters per Second（升/秒）' },
    { value: 'Liters per Minute', label: 'Liters per Minute（升/分）' },
    { value: 'Cubic Meters per Second', label: 'Cubic Meters per Second（立方米/秒）' },
    { value: 'Gallons per Second', label: 'Gallons per Second（加仑/秒）' },
    { value: 'Gallons per Minute', label: 'Gallons per Minute（加仑/分）' },
    { value: '1/Years', label: '1/Years（每年）' },
    { value: '1/Seconds', label: '1/Seconds（每秒）' },
    { value: '1/Hours', label: '1/Hours（每小时）' },
    { value: '1/Days', label: '1/Days（每天）' },
    { value: 'Meters/Years', label: 'Meters/Years（米/年）' },
    { value: 'Kilometers/Years', label: 'Kilometers/Years（千米/年）' },
    { value: 'Kilograms/Years', label: 'Kilograms/Years（千克/年）' },
    { value: 'Dollars/Years', label: 'Dollars/Years（美元/年）' },
    { value: '人/Years', label: '人/Years（人/年）' },
    { value: '元/Years', label: '元/Years（元/年）' },
    { value: '万元/Years', label: '万元/Years（万元/年）' },
  ]),
];
