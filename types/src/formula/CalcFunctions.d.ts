/**
 * @param {import("../Simulator").Simulator} simulate
 */
export function createFunctions(simulate: import("../Simulator").Simulator): void;
/**
 * @param {*} x
 * @param {import("../Simulator").Simulator} simulate
 *
 * @returns
 */
export function makeObjectBase(x: any, simulate: import("../Simulator").Simulator): Vector<{
    (x: any, fingerprint: any, lastSelf: any): any;
    delayEvalParams: any;
}>;
/**
 * @typedef {Object} DefineFunctionParam
 * @property {string} name
 * @property {any=} defaultVal
 * @property {boolean=} noUnits
 * @property {boolean=} noVector
 * @property {boolean=} needVector
 * @property {boolean=} needNum
 * @property {boolean=} leafNeedNum
 * @property {boolean=} vectorize
 * @property {boolean=} allowBoolean
 * @property {boolean=} allowString
 * @property {boolean=} needString
 * @property {boolean=} needPrimitive
 * @property {boolean=} allowOptionalPrimitive
 * @property {boolean=} needAgent
 * @property {boolean=} needAgents
 * @property {boolean=} needPopulation
 */
/**
 * @callback DefineFunctionPrep
 * @param {any[]} args
 * @returns {any}
 */
/**
 * @typedef {{ param: DefineFunctionParam, allowEmpty?: boolean, prep?: DefineFunctionPrep, object?: any }|{ params: DefineFunctionParam[], recurse?: boolean, prep?: DefineFunctionPrep, object?: any }} DefineFunctionDefinition
 */
/**
 * @param {import("../Simulator").Simulator} simulate
 * @param {string} name
 * @param {DefineFunctionDefinition} definition
 * @param {function} fn
 */
export function defineFunction(simulate: import("../Simulator").Simulator, name: string, definition: DefineFunctionDefinition, fn: Function): void;
export function testArgumentsSize(x: any, name: any, min: any, max: any): void;
export type DefineFunctionParam = {
    name: string;
    defaultVal?: any | undefined;
    noUnits?: boolean | undefined;
    noVector?: boolean | undefined;
    needVector?: boolean | undefined;
    needNum?: boolean | undefined;
    leafNeedNum?: boolean | undefined;
    vectorize?: boolean | undefined;
    allowBoolean?: boolean | undefined;
    allowString?: boolean | undefined;
    needString?: boolean | undefined;
    needPrimitive?: boolean | undefined;
    allowOptionalPrimitive?: boolean | undefined;
    needAgent?: boolean | undefined;
    needAgents?: boolean | undefined;
    needPopulation?: boolean | undefined;
};
export type DefineFunctionPrep = (args: any[]) => any;
export type DefineFunctionDefinition = {
    param: DefineFunctionParam;
    allowEmpty?: boolean;
    prep?: DefineFunctionPrep;
    object?: any;
} | {
    params: DefineFunctionParam[];
    recurse?: boolean;
    prep?: DefineFunctionPrep;
    object?: any;
};
import { Vector } from "./Vector.js";
