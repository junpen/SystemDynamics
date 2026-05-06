export let fn: {
    /**
     * @param {number} a
     * @param {number} b
     * @returns
     */
    "+": (a: number, b: number) => number;
    /**
     * @param {number} a
     * @param {number=} b
     * @returns
     */
    "-": (a: number, b?: number | undefined) => number;
    /**
     * @param {number} a
     * @param {number} b
     * @returns
     */
    "*": (a: number, b: number) => number;
    /**
     * @param {number} a
     * @param {number} b
     * @returns
     */
    "/": (a: number, b: number) => number;
    "=": (a: any, b: any) => boolean;
    /**
     * @param {number} a
     * @param {number} b
     * @returns
     */
    "<": (a: number, b: number) => boolean;
    /**
     * @param {number} a
     * @param {number} b
     * @returns
     */
    "<=": (a: number, b: number) => boolean;
    /**
     * @param {number} a
     * @param {number} b
     * @returns
     */
    ">": (a: number, b: number) => boolean;
    /**
     * @param {number} a
     * @param {number} b
     * @returns
     */
    ">=": (a: number, b: number) => boolean;
    /**
     * @param {number} a
     * @param {number} b
     * @returns
     */
    mod: (a: number, b: number) => number;
    /**
     * @param {number} a
     * @param {number} b
     * @returns
     */
    expt: (a: number, b: number) => number;
    abs: (x: number) => number;
    sin: (x: number) => number;
    asin: (x: number) => number;
    cos: (x: number) => number;
    acos: (x: number) => number;
    tan: (x: number) => number;
    atan: (x: number) => number;
    sqrt: (x: number) => number;
    /**
     * @param {number} a
     * @param {number=} b
     * @returns
     */
    log: (a: number, b?: number | undefined) => number;
    exp: (x: number) => number;
    round: (x: number) => number;
    floor: (x: number) => number;
    ceiling: (x: number) => number;
};
