/**
 * @param {*} x
 * @param {import("../Simulator").Simulator} simulate
 */
export function stringify(x: any, simulate: import("../Simulator").Simulator): String | Vector<any>;
/**
 * @param {*} mat
 * @param {import("../Simulator").Simulator} simulate
 * @param {any[]} items
 * @param {*} fill
 */
export function selectFromMatrix(mat: any, simulate: import("../Simulator").Simulator, items: any[], fill: any): any;
/**
 * @param {Vector} vec
 * @param {import("../Simulator").Simulator} simulate
 * @param {*} items
 * @param {*} fill
 * @param {boolean=} doNotClone
 */
export function selectFromVector(vec: Vector<any>, simulate: import("../Simulator").Simulator, items: any, fill: any, doNotClone?: boolean | undefined): {
    data: Vector<any>;
    collapsed?: undefined;
    parent?: undefined;
} | {
    data: any;
    collapsed: boolean;
    parent?: undefined;
} | {
    collapsed: boolean;
    parent: Vector<any>;
    data: any;
};
export function strictEquals(a: any, b: any): boolean;
import { Vector } from "./Vector.js";
