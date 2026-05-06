/**
 * Converts a Model object into a JSON string following the ModelJSON specification.
 *
 * @param {Model} model
 * @returns {object} The ModleJSON object representing the model.
 */
export function createModelJSON(model: Model): object;
/**
 * Loads a ModelJSON string into a new Model instance.
 *
 * @param {object} data
 * @returns {Model} A new Model object reflecting the parsed ModelJSON.
 */
export function loadModelJSON(data: object): Model;
export type GraphNode = import("../../../SharedTypes.js").GraphNode;
import { Model } from "../../Model.js";
