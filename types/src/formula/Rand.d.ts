/**
 * @param {import("../Simulator").Simulator} simulate
 * @param {number=} minVal
 * @param {number=} maxVal
 *
 * @return {number}
 */
export function Rand(simulate: import("../Simulator").Simulator, minVal?: number | undefined, maxVal?: number | undefined): number;
/**
 * @param {import("../Simulator").Simulator} simulate
 * @param {number=} mu
 * @param {number=} sigma
 *
 * @returns {number}
 */
export function RandNormal(simulate: import("../Simulator").Simulator, mu?: number | undefined, sigma?: number | undefined): number;
/**
 * @param {import("../Simulator").Simulator} simulate
 * @param {number=} lambda
 *
 * @returns {number}
 */
export function RandExp(simulate: import("../Simulator").Simulator, lambda?: number | undefined): number;
/**
 * @param {import("../Simulator").Simulator} simulate
 * @param {number} mu
 * @param {number} sigma
 *
 * @returns {number}
 */
export function RandLognormal(simulate: import("../Simulator").Simulator, mu: number, sigma: number): number;
/**
 * Based on:
 *   https://github.com/numpy/numpy/blob/623bc1fae1d47df24e7f1e29321d0c0ba2771ce0/numpy/random/src/distributions/distributions.c
 *
 * @param {import("../Simulator").Simulator} simulate
 * @param {number} count
 * @param {number} probability
 *
 * @returns {number}
 */
export function RandBinomial(simulate: import("../Simulator").Simulator, count: number, probability: number): number;
/**
 * @param {import("../Simulator").Simulator} simulate
 * @param {number} successes
 * @param {number} probability
 *
 * @returns {number}
 */
export function RandNegativeBinomial(simulate: import("../Simulator").Simulator, successes: number, probability: number): number;
/**
 * @param {import("../Simulator").Simulator} simulate
 * @param {number} lambda
 *
 * @returns {number}
 */
export function RandPoisson(simulate: import("../Simulator").Simulator, lambda: number): number;
/**
 * @param {import("../Simulator").Simulator} simulate
 * @param {number} alpha
 * @param {number} beta
 *
 * @returns {number}
 */
export function RandGamma(simulate: import("../Simulator").Simulator, alpha: number, beta: number): number;
/**
 * @param {import("../Simulator").Simulator} simulate
 * @param {number} alpha
 * @param {number} beta
 *
 * @returns {number}
 */
export function RandBeta(simulate: import("../Simulator").Simulator, alpha: number, beta: number): number;
/**
 * @param {import("../Simulator").Simulator} simulate
 * @param {number} minimum
 * @param {number} maximum
 * @param {number} peak
 *
 * @returns {number}
 */
export function RandTriangular(simulate: import("../Simulator").Simulator, minimum: number, maximum: number, peak: number): number;
/**
 * @param {import("../Simulator").Simulator} simulate
 * @param {number[]} x
 * @param {number[]} y
 *
 * @returns {number}
 */
export function RandDist(simulate: import("../Simulator").Simulator, x: number[], y: number[]): number;
export class RandList {
    /**
     * @param {import("../Simulator").Simulator} simulate
     */
    constructor(simulate: import("../Simulator").Simulator);
    simulate: import("../Simulator").Simulator;
    /** @type {number[]} */
    vals: number[];
    /**
     * @param {number} i
     *
     * @returns {number}
     */
    get(i: number): number;
}
