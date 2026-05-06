/** @typedef {import("./SharedTypes.js").TriggerType} TriggerType */
/** @typedef {import("./SharedTypes.js").StockTypeType} StockTypeType */
export class DNA {
    /**
     * @param {import("./api/Blocks").Primitive} primitive
     * @param {string=} id
     */
    constructor(primitive: import("./api/Blocks").Primitive, id?: string | undefined);
    primitive: import("./api/Blocks").Primitive;
    /** @type {string} */
    id: string;
    /** @type {string} */
    name: string;
    /** @type {import('./formula/Units').UnitStore} */
    units: import("./formula/Units").UnitStore;
    /** @type {import('./Simulator').SolverType} */
    solver: import("./Simulator").SolverType;
    /** @type {boolean} */
    frozen: boolean;
    /** @type {boolean} */
    slider: boolean;
    /** @type {string} */
    targetId: string;
    /** @type {string} */
    sourceId: string;
    /** @type {any} */
    value: any;
    /** @type {TriggerType} */
    trigger: TriggerType;
    /** @type {boolean} */
    repeat: boolean;
    /** @type {import("./formula/Material").Material} */
    delay: import("./formula/Material").Material;
    /** @type {StockTypeType} */
    stockType: StockTypeType;
    /** @type {boolean} */
    recalculate: boolean;
    /** @type {boolean} */
    nonNegative: boolean;
    /** @type {import("./formula/Material").Material} */
    residency: import("./formula/Material").Material;
    /** @type {string} */
    source: string;
    /** @type {string} */
    interpolation: string;
    /** @type {any} */
    triggerValue: any;
    /** @type {import("./formula/Material").Material[]} */
    inputs: import("./formula/Material").Material[];
    /** @type {import("./formula/Material").Material[]} */
    outputs: import("./formula/Material").Material[];
    /** @type {boolean} */
    flowUnitless: boolean;
    /** @type {boolean} */
    useMaxConstraint: boolean;
    /** @type {boolean} */
    useMinConstraint: boolean;
    /** @type {any} */
    minConstraint: any;
    /** @type {number} */
    maxConstraint: number;
    /** @type {number} */
    toBase: number;
    /** @type {boolean} */
    unitless: boolean;
    /** @type {any} */
    equation: any;
    /** @type {import('./Primitives').SPopulation} */
    agents: import("./Primitives").SPopulation;
    /** @type {boolean} */
    noOutput: boolean;
    /** @type {DNA} */
    neighborProxyDNA: DNA;
    /** @type {import("./api/Blocks").Primitive[]} */
    extraLinksPrimitives: import("./api/Blocks").Primitive[];
    /** @type {boolean} */
    adoptUnits: boolean;
}
export type TriggerType = import("./SharedTypes.js").TriggerType;
export type StockTypeType = import("./SharedTypes.js").StockTypeType;
