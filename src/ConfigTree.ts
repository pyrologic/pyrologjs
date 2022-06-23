/**
 * configuration tree
 */

import { ConfigItem } from "./ConfigItem";
import { Utils } from "./utils";
import { DEFAULT_CONFIG } from "./LoggerFactory";
import { Level } from "./Level";
import { PyroConfigItem } from "./PyroConfigItem";

/**
 * a tree node class
 */
class Node {
    private nodeCfg: ConfigItem | null;
    private readonly childNodes: Map<String, Node>;

    constructor(nc: ConfigItem | null) {
        this.nodeCfg = nc;
        this.childNodes = new Map<String, Node>();
    }

    get config() {
        return this.nodeCfg;
    }

    hasConfig(): boolean {
        return this.nodeCfg !== null;
    }

    setConfig(cf: ConfigItem) {
        this.nodeCfg = cf;
    }

    hasChild(name: string): boolean {
        return this.childNodes.has(name);
    }

    getChild(name: string): Node | undefined {
        return this.childNodes.get(name);
    }

    addChild(name: string, child: Node): void {
        if ( !this.hasChild(name) ) {
            this.childNodes.set(Utils.ensureName(name), child);
        }
    }
}

/**
 * the class ConfigTree holds the hierarchical logger configuration
 */
export class ConfigTree {
    private readonly _rootNode: Node;

    /**
     * constructs a new instance
     * @param {ConfigItem} rc root configuration item; provides the default configuration
     */
    private constructor(rc: ConfigItem) {
        this._rootNode = new Node(rc);
    }

    /**
     * @returns {Node} the root node
     */
    get rootNode(): Node {
        return this._rootNode;
    }

    /**
     * @returns {ConfigItem} the default configurations
     */
    get defaultConfig(): ConfigItem {
        return this._rootNode.config as ConfigItem;
    }

    /**
     * applies a logger configuration
     * @param config array of configuration items
     */
    private _applyConfiguration(config: ConfigItem[]): void {
        for ( let ci of config ) {
            const names = ci.name.split('.');
            Utils.checkNames(names, `Invalid logger path "${ci.name}"!`);
            const node = this._ensureNode(this._rootNode, names, 1);
            node.setConfig(ci);
        }
    }

    /**
     * ensures that a tree node exists for a given path
     * @param {Node} node parent node
     * @param {string[]} names node path
     * @param {Number} level current recursion level
     * @returns {Node} the child node referred by the path
     */
    private _ensureNode(node: Node, names: string[], level: number): Node {
        const name = names[level-1];
        if ( !node.hasChild(name) ) {
            node.addChild(name, new Node(null));
        }
        const child = node.getChild(name) as Node;
        return level < names.length ? this._ensureNode(child, names, level+1) : child;
    }

    /**
     * applies a logger configuration
     * @param config array of configuration items
     */
    static applyConfiguration(config: ConfigItem[]): ConfigTree {
        let nci: Array<ConfigItem> = [];
        let dci: ConfigItem|null = null;
        for ( let ci of config ) {
            const name = Utils.ensureName(ci.name);
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