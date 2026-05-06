export class AggregateSeries {
    /**
     * @param {import("./Simulator").Simulator} simulate
     * @param {Material} mSpacing
     */
    constructor(simulate: import("./Simulator").Simulator, mSpacing: Material);
    simulate: import("./Simulator").Simulator;
    /** @type {Material} */
    spacing: Material;
    /** @type {Material[]} */
    oldValues: Material[];
    get(data: any): Material;
}
import { Material } from "./formula/Material.js";
