declare class AVLTree {
    /**
     * Callback for comparator
     * @callback comparatorCallback
     * @param {Key} a
     * @param {Key} b
     * @returns {number}
     */
    /**
     * @class AVLTree
     * @constructor
     * @param  {comparatorCallback} [comparator]
     * @param  {boolean}            [noDuplicates=false] Disallow duplicates
     */
    constructor(comparator?: (a: Key, b: Key) => number, noDuplicates?: boolean);
    _comparator: (a: Key, b: Key) => number;
    _root: any;
    _size: number;
    _noDuplicates: boolean;
    /**
     * Clear the tree
     * @return {AVLTree}
     */
    destroy(): AVLTree;
    /**
     * Clear the tree
     * @return {AVLTree}
     */
    clear(): AVLTree;
    /**
     * Number of nodes
     * @return {number}
     */
    get size(): number;
    /**
     * Whether the tree contains a node with the given key
     * @param  {Key} key
     * @return {boolean} true/false
     */
    contains(key: Key): boolean;
    /**
     * Successor node
     * @param  {Node} node
     * @return {?Node}
     */
    next(node: Node): Node | null;
    /**
     * Predecessor node
     * @param  {Node} node
     * @return {?Node}
     */
    prev(node: Node): Node | null;
    /**
     * Callback for forEach
     * @callback forEachCallback
     * @param {Node} node
     * @param {number} index
     */
    /**
     * @param  {forEachCallback} callback
     * @return {AVLTree}
     */
    forEach(callback: (node: Node, index: number) => any): AVLTree;
    /**
     * Walk key range from `low` to `high`. Stops if `fn` returns a value.
     * @param  {Key}      low
     * @param  {Key}      high
     * @param  {Function} fn
     * @param  {*?}       ctx
     * @return {SplayTree}
     */
    range(low: Key, high: Key, fn: Function, ctx: any | null): SplayTree;
    /**
     * Returns all keys in order
     * @return {Array<Key>}
     */
    keys(): Array<Key>;
    /**
     * Returns `data` fields of all nodes in order.
     * @return {Array<Value>}
     */
    values(): Array<Value>;
    /**
     * Returns node at given index
     * @param  {number} index
     * @return {?Node}
     */
    at(index: number): Node | null;
    /**
     * Returns node with the minimum key
     * @return {?Node}
     */
    minNode(): Node | null;
    /**
     * Returns node with the max key
     * @return {?Node}
     */
    maxNode(): Node | null;
    /**
     * Min key
     * @return {?Key}
     */
    min(): Key | null;
    /**
     * Max key
     * @return {?Key}
     */
    max(): Key | null;
    /**
     * @return {boolean} true/false
     */
    isEmpty(): boolean;
    /**
     * Removes and returns the node with smallest key
     * @return {?Node}
     */
    pop(): Node | null;
    /**
     * Removes and returns the node with highest key
     * @return {?Node}
     */
    popMax(): Node | null;
    /**
     * Find node by key
     * @param  {Key} key
     * @return {?Node}
     */
    find(key: Key): Node | null;
    /**
     * Insert a node into the tree
     * @param  {Key} key
     * @param  {Value} [data]
     * @return {?Node}
     */
    insert(key: Key, data?: Value): Node | null;
    /**
     * Removes the node from the tree. If not found, returns null.
     * @param  {Key} key
     * @return {?Node}
     */
    remove(key: Key): Node | null;
    /**
     * Bulk-load items
     * @param  {Array<Key>}  keys
     * @param  {Array<Value>}  [values]
     * @param {boolean=} presort
     * @return {AVLTree}
     */
    load(keys?: Array<Key>, values?: Array<Value>, presort?: boolean | undefined): AVLTree;
    /**
     * Returns true if the tree is balanced
     * @return {boolean}
     */
    isBalanced(): boolean;
    /**
     * String representation of the tree - primitive horizontal print-out
     * @param  {function(Node):string} [printNode]
     * @return {string}
     */
    toString(printNode?: (arg0: Node) => string): string;
}
declare namespace AVLTree {
    export { AVLTree as default };
}
export default AVLTree;
export type Node = {
    parent: Node | null;
    left: Node | null;
    right: Node | null;
    balanceFactor: number;
    key: Key;
    data: Value;
};
export type Key = import("../../src/TaskScheduler").Task;
export type Value = any;
