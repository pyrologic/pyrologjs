/**
 * configuration tree
 */

import { ConfigItem } from "./ConfigItem";
import { Utils } from "./utils";
import { DEFAULT_CONFIG } from "./LoggerFactory";
import { Level } from "./Level";
import { PyroConfigItem } from "./PyroConfigItem";

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
            this.childNodes.set(Utils.verifyName(name), child);
        }
    }
}


export class ConfigTree {
    private readonly rootNode: Node;

    constructor(rc: ConfigItem) {
        this.rootNode = new Node(rc);
    }

    private _applyConfiguration(config: ConfigItem[]): void {
        for ( let ci of config ) {
            const names = ci.name.split('.');
            names.forEach((n) => {
                if ( !Utils.verifyName(n) ) {
                    throw new Error(`Invalid logger path "${ci.name}"!`);
                }
            });
            const node = this._ensureNode(this.rootNode, names, 1);
            node.setConfig(ci);
        }
    }

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
            const name = Utils.verifyName(ci.name);
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
            // create default
            dci = new PyroConfigItem(DEFAULT_CONFIG, 'ERROR', false);
        }
        const tree = new ConfigTree(dci);
        if ( nci.length > 0 ) {
            tree._applyConfiguration(nci);
        }
        return tree;
    }
}