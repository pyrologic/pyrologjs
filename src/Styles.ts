/**
 * styling of logging messages
 * see https://developer.chrome.com/docs/devtools/console/format-style
 */

import { LevelStrings } from "./Level";

/**
 * color reference
 */
export interface ColorRef {
    /** foreground color reference */
    readonly fgRef: number;
    /** background color reference */
    readonly bgRef: number;
}

/**
 * all supported color values
 */
export const Colors = {
    BLACK:      { fgRef: 30, bgRef:  40 } as ColorRef,
    RED:        { fgRef: 31, bgRef:  41 } as ColorRef,
    GREEN:      { fgRef: 32, bgRef:  42 } as ColorRef,
    ORANGE:     { fgRef: 33, bgRef:  43 } as ColorRef,
    DARKBLUE:   { fgRef: 34, bgRef:  44 } as ColorRef,
    PURPLE:     { fgRef: 35, bgRef:  45 } as ColorRef,
    TURQUOISE:  { fgRef: 36, bgRef:  46 } as ColorRef,
    GRAY:       { fgRef: 37, bgRef:  47 } as ColorRef,
    DARKGRAY:   { fgRef: 90, bgRef: 100 } as ColorRef,
    LIGHTRED:   { fgRef: 91, bgRef: 101 } as ColorRef,
    LIGHTGREEN: { fgRef: 92, bgRef: 102 } as ColorRef,
    YELLOW:     { fgRef: 93, bgRef: 103 } as ColorRef,
    BLUE:       { fgRef: 94, bgRef: 104 } as ColorRef,
    PINK:       { fgRef: 95, bgRef: 105 } as ColorRef,
    CYAN:       { fgRef: 96, bgRef: 106 } as ColorRef,
    WHITE:      { fgRef: 97, bgRef: 107 } as ColorRef,
    NONE:       { fgRef:  0, bgRef:   0 } as ColorRef,
} as const;


/**
 * supported text styles
 */
export interface TextStyle {
    readonly bold: boolean;
    readonly italic: boolean;
    readonly underline: boolean;
    readonly linethrough: boolean;
}

/**
 * a logging style definition
 */
export interface StyleDef {
    /** the foreground/text color */
    readonly color: ColorRef;
    /** the background color */
    readonly background: ColorRef;
    /** additional text style attributes */
    readonly styles: TextStyle;
}

/** a map providing style definitions for logging levels */
export type LevelStyles = Map<LevelStrings, StyleDef>;

