/** @typedef {import("./SharedTypes.js").ValueType} ValueType */
/**
 * @typedef {{ location: Vector<Material>, agent: SAgent }} LocationType
 */
/**
 * @param {import("./Simulator").Simulator} simulate
 */
export function createFunctions(simulate: import("./Simulator").Simulator): void;
/**
 * @param {*} obj
 * @param {import("./Simulator").Simulator} simulate
 *
 * @returns {SAgent}
 */
export function agent(obj: any, simulate: import("./Simulator").Simulator): SAgent;
/**
 * @param {*} obj
 *
 * @returns {SPopulation}
 */
export function agents(obj: any): SPopulation;
/**
 * @param {*} item
 * @param {import("./Simulator").Simulator} simulate
 *
 * @returns {Vector}
 */
export function getPopulation(item: any, simulate: import("./Simulator").Simulator): Vector<any>;
export function testPrimitive(x: any, name: any, primitiveIndexes: any): void;
export type ValueType = import("./SharedTypes.js").ValueType;
export type LocationType = {
    location: Vector<Material>;
    agent: SAgent;
};
import { SAgent } from "./Primitives.js";
import { SPopulation } from "./Primitives.js";
import { Vector } from "./formula/Vector.js";
import { Material } from "./formula/Material.js";
