import { convertUnits, UnitStore } from "./Units.js";
import { fn } from "../CalcMap.js";
import { ModelError } from "./ModelError.js";
import { PrimitiveStore } from "./Formula.js";


export class Material {
  /**
   * @param {number} value
   * @param {import("./Units").UnitStore=} units
   * @param {boolean=} explicitUnits
   */
  constructor(value, units, explicitUnits=true) {
    /** @type {number} */
    this.value = value;
    /** @type {import("./Units").UnitStore|undefined} */
    this.units = units;
    /** @type {boolean} */
    this.explicitUnits = explicitUnits;
  }

  /**
   * @returns {Material}
   */
  toNum() {
    return this;
  }

  toString() {
    if (this.units && !this.units.isUnitless()) {
      return "{" + this.value + " " + this.units.toStringShort() + "}";
    } else {
      return this.value + "";
    }
  }

  fullClone() {
    return new Material(this.value, this.units, this.explicitUnits);
  }

  /**
   * @param {import("./Units").UnitStore} newUnits
   *
   * @returns {Material}
   */
  forceUnits(newUnits) {
    // 单位仅用于展示，不进行任何转换
    this.units = newUnits;
    return this;
  }
}


/** @typedef {"MATERIAL"|"VECTOR"|"PRIMITIVE"|null} OperandType */

/**
 * @param {Material|UnitStore} lhs 
 * @param {Material|UnitStore} rhs 
 * @param {string} type 
 * @param {string=} operator
 * @param {import("./Formula").TreeNode=} lhsNode
 * @param {import("./Formula").TreeNode=} rhsNode
 */
export function unitAlert(lhs, rhs, type, operator, lhsNode, rhsNode) {
}

