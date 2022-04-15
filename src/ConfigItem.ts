import { Level } from "./Level";

export type LevelStrings = keyof typeof Level;

export interface ConfigItem {
    readonly name: string;
    readonly level: LevelStrings;
}