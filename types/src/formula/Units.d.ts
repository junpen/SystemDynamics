/**
 * @param {UnitStore} source
 * @param {UnitStore} target
 * @param {boolean=} allowUnitApplication
 *
 * @returns {number}
 */
export function convertUnits(source: UnitStore, target: UnitStore, allowUnitApplication?: boolean | undefined): number;
export class UnitStore {
    /**
     * @param {UnitManager} manager
     * @param {string[]} names
     * @param {number[]} exponents
     */
    constructor(manager: UnitManager, names: string[], exponents: number[]);
    manager: UnitManager;
    names: string[];
    exponents: number[];
    /** @type {number} */
    toBase: number;
    /** @type {UnitStore} */
    baseUnits: UnitStore;
    /** @type {Map<UnitStore, [number, UnitStore, boolean]>} */
    multiples: Map<UnitStore, [number, UnitStore, boolean]>;
    /** @type {Map<UnitStore, [number, UnitStore, boolean]>} */
    divisions: Map<UnitStore, [number, UnitStore, boolean]>;
    id: string;
    isUnitless(): boolean;
    /**
     * Also check if the units would simplify to unitless.
     *
     * @returns
     */
    isDeepUnitless(): boolean;
    addBase(): void;
    /**
     * @param {number} exponent
     * @returns {UnitStore}
     */
    power(exponent: number): UnitStore;
    /**
     * @returns {string}
     */
    toStringShort(): string;
    /**
     * @param {UnitStore} rhs
     * @param {boolean} multiplication (false if division)
     *
     * @returns {[number, UnitStore, boolean]}
     */
    multiply(rhs: UnitStore, multiplication: boolean): [number, UnitStore, boolean];
    /**
     * @returns {string}
     */
    toString(): string;
}
export class UnitManager {
    /** @type {UnitDefinition[]} */
    unitDefinitions: UnitDefinition[];
    /** @type {Object<string, UnitDefinition>} */
    cachedUnits: {
        [x: string]: UnitDefinition;
    };
    /**
     * @type {Object<string, UnitStore>}
     */
    unitsBank: {
        [x: string]: UnitStore;
    };
    /**
     * @param {UnitDefinition[]} units
     */
    addUnits(units: UnitDefinition[]): void;
    /**
     * @param {string} name
     *
     * @returns {UnitDefinition}
     */
    findSource(name: string): UnitDefinition;
    /**
     * @param {string[]} names
     * @param {number[]} exponents
     * @param {boolean=} checkNames
     * @param {boolean=} alwaysReturn - units must be returned, when calling setBase
     *
     * @returns {UnitStore}
     */
    getUnitStore(names: string[], exponents: number[], checkNames?: boolean | undefined, alwaysReturn?: boolean | undefined): UnitStore;
    /**
     * @param {string} expandString
     *
     * @returns {UnitStore}
     */
    unitsFromString(expandString: string): UnitStore;
}
export type UnitDefinition = {
    sourceString?: string | undefined;
    source?: RegExp | undefined;
    targetString?: string | undefined;
    target?: UnitStore | undefined;
    scale: number;
};
