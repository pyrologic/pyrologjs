/**
 * configuration tree
 */

import { ConfigItem } from "./ConfigItem";
import { Utils } from "./utils";
import { DEFAULT_CONFIG, ROOT_NODE_NAME } from "./Const";
import { Level } from "./Level";
import { PyroConfigItem } from "./PyroConfigItem";


/**
 * an internal tree node class
 */
class Node {
    private readonly _name: string;
    private _parent: Node | null;
    private _config: ConfigItem | null;
    private readonly _children: Map<String, Node>;

    constructor(n: string, p: Node | null, nc: ConfigItem | null) {
        this._name = Utils.ensureName(n);
        if ( (p !== null) && (n === ROOT_NODE_NAME) ) {
            throw new Error('Cannot create child node with internal root node name!');
        }
        this._parent = p;
        this._config = nc;
        this._children = new Map<String, Node>();
        if ( p !== null ) {
            p._addChild(this);
        }
    }

    get name() {
        return this._name;
    }

    get parent() {
        return this._parent;
    }

    get config() {
        return this._config;
    }

    hasConfig(): boolean {
        return this._config !== null;
    }

    setConfig(cf: ConfigItem) {
        this._config = cf;
    }

    hasChild(name: string): boolean {
        return this._children.has(name);
    }

    getChild(name: string): Node | undefined {
        return this._children.get(name);
    }

    private _addChild(child: Node): void {
        if ( child._parent !== this ) {
            throw new Error('Invalid child node with different parent node!');
        }
        if ( !this.hasChild(child.name) ) {
            this._children.set(Utils.ensureName(child.name), child);
        } else {
            throw new Error(`Duplicate node "${child.name}"!`);
        }
    }
}


/**
 * the class ConfigTree holds the hierarchical logger configuration
 */
export class ConfigTree {

    /** tree's root node */
    private readonly _rootNode: Node;

    /**
     * constructs a new instance
     * @param {ConfigItem} rc root configuration item; provides the default configuration
     */
    private constructor(rc: ConfigItem) {
        this._rootNode = new Node(ROOT_NODE_NAME, null, rc);
    }

    /**
     * @returns {ConfigItem} the default configurations
     */
    get defaultConfig(): ConfigItem {
        return this._rootNode.config as ConfigItem;
    }

    /**
     * searches for a matching logger configuration in the configuration tree
     * @param {string} name logger name
     * @returns {ConfigItem} the matching logger configuration or null if something went wrong
     */
    findConfig(name: string): ConfigItem | null {
        let node: Node | null = this._findNode(this._rootNode, Utils.getPath(name), 1);
        while ( (node !== null) && (node.config === null) ) {
            node = node.parent;
        }
        return (node !== null) ? node.config : this._rootNode.config;
    }

    /**
     * searches for a node in the configuration tree
     * @param {Node} node parent node 
     * @param {string[]} path configuration node path 
     * @param {number} level recursion level 
     * @returns {Node} the matching node
     */
    private _findNode(node: Node, path: string[], level: number): Node {
        if ( level > path.length ) {
            return node;
        }
        const child = node.getChild(path[level-1]);
        if ( child !== undefined ) {
            return this._findNode(child, path, level+1);
        } else {
            return node;
        } 
    }

    /**
     * applies a logger configuration
     * @param config array of configuration items
     */
    private _applyConfiguration(config: ConfigItem[]): void {
        for ( let ci of config ) {
            try {
                const names = Utils.getPath(ci.name);
                const node = this._ensureNode(this._rootNode, names, 1);
                node.setConfig(ci);
                console.debug(`Configuration node "${names.join('.')}" is set to level "${ci.level}."`);
            } catch ( error ) {
                console.error('Skipping invalid configuration item.', error);
            }
        }
    }

    /**
     * ensures that a tree node exists for a given path
     * @param {Node} node parent node
     * @param {string[]} path configuration node path
     * @param {Number} level current recursion level
     * @returns {Node} the child node referred by the path
     */
    private _ensureNode(node: Node, path: string[], level: number): Node {
        const name = path[level-1];
        if ( !node.hasChild(name) ) {
            new Node(name, node, null);
        }
        const child = node.getChild(name) as Node;
        return level < path.length ? this._ensureNode(child, path, level+1) : child;
    }

    /**
     * applies a logger configuration
     * @param config array of configuration items
     */
    static applyConfiguration(config: ConfigItem[]): ConfigTree {
        let nci: Array<ConfigItem> = [];
        let dci: ConfigItem|null = null;
        for ( let ci of config ) {
            const name = Utils.normalizePath(ci.name);
            const level = Level[ci.level];
            if ( typeof level === 'undefined' ) {
                throw new Error(`Invalid level "${ci.level}"!`);
            }
            if ( DEFAULT_CONFIG === name ) {
                if ( dci === null ) {
                    dci = ci;
                }
            } else {
                nci.push(ci);
            }
        }
        if ( dci === null ) {
            // create default configuration
            dci = new PyroConfigItem(DEFAULT_CONFIG, 'ERROR', false);
        }
        const tree = new ConfigTree(dci);
        if ( nci.length > 0 ) {
            tree._applyConfiguration(nci);
        }
        return tree;
    }
}