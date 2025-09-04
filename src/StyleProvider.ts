/**
 * helper interface to avoid dependency cycles
 */

import { Level } from "./Level";
import { StyleDef } from "./Styles";

export interface StyleProvider {

    /**
     * retrieves the style definition for a specific logger and the given logging level
     * @param name logger name
     * @param level logging level
     * @returns the style definition or undefined if there is no matching style definition
     */
    getStyleDef(name: string, level: Level): StyleDef | undefined;
}