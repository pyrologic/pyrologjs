# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`@pyrologic/pyrologjs` is a small, dependency-free logging library for JavaScript/TypeScript (browser, Node.js, Deno). Written entirely in TypeScript and bundled with rollup. The published bundle is intentionally **not** minified/mangled so consumers can bundle and compress it their own way.

## Commands

- `npm run build` — bundle `src/main.ts` into `dist/` via rollup (ES module `dist/pyrolog.js` + `dist/pyrolog.d.ts` + source map).
- `npm run watch` — rebuild on change (25ms debounce).

There is **no test suite, linter, or test runner** configured. Type checking happens as part of the rollup build via `@rollup/plugin-typescript` (`tsconfig.json` has `strict` and `noUnusedLocals`).

The build has two rollup passes: one compiles TS → `dist/pyrolog.js` and emits declarations into `dist/dts/`; the second (`rollup-plugin-dts`) rolls those up into a single `dist/pyrolog.d.ts`.

## Architecture

Everything is accessed through the **`PyroLog` singleton** (`PyroLog.getInstance()`). `main.ts` defines this class and is the single entry point / export barrel — anything meant to be public must be re-exported from the `export { ... }` block at the bottom of `main.ts`.

Key layering:

- **`PyroLog` (main.ts)** — thin public facade. Nearly every method delegates to `LoggerFactory`. Also defines and exports `JsLevel` (a plain-object mirror of the `Level` enum, needed because TS enums don't survive compilation for JS consumers).
- **`LoggerFactory`** — the real engine (module-level singleton). Owns the map of live `PyroLogger` instances, the active `ConfigTree`, the current appender, and the current prefix generator. Implements `StyleProvider` so loggers can resolve styles back through it. When `applyConfiguration()` runs, it rebuilds the config tree and **re-configures all existing loggers in place** (level, writeFnc, styles) — loggers are long-lived and mutated, not recreated.
- **`ConfigTree` / `Node`** — holds the hierarchical, dot-separated logger configuration. `findConfig(name)` walks up the tree to find the best-matching (closest ancestor) config, falling back to the default config. This is the Log4j-style inheritance model. The default config is keyed by the internal name `@default` (see `Const.ts`; root node is `@rootNode`).
- **`PyroLogger` (implements `Logger`)** — a single logger instance. Holds its own level, styles, prefix generator, and appender reference. Level gating: a message is written only if its level ≥ the logger's configured level and neither the logger nor the global `suspended` flag is set.
- **`GlobalOptions`** (singleton) — cross-cutting flags (`useDebug`, `suspended`) and global per-level styles that apply to all loggers when no more-specific style exists.

Style resolution order (in `LoggerFactory.getStyleDef`): logger's config item → walk up parent config items → `GlobalOptions` global level style.

### Interface / implementation naming convention

Public **interfaces** get plain names; concrete implementations are prefixed `Pyro`:
- `Logger` (interface) ↔ `PyroLogger` (impl)
- `ConfigItem` (interface) ↔ `PyroConfigItem` (impl)
- `PrefixGenerator` (interface) ↔ `PyroPrefixGenerator` (impl) / `CallbackPrefixGenerator` (callback-backed impl)
- `Appender` (interface) ↔ `CallbackAppender` (impl)

Loggers/config items/appenders/prefix generators are created through factory methods on `PyroLog`/`LoggerFactory`, not `new`-ed directly by consumers.

### Level enum

`Level` (ascending threshold order): `ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL, OFF`. String↔enum conversion helpers live in `Level.ts` (`Level2String`, `String2Level`, `forEachLevel`, etc.). `LevelStrings` is the string-literal union used in public config APIs.

## Conventions

- Logger names are dot-separated hierarchical paths; they are normalized/trimmed via `Utils.normalizePath`. Names must not start or end with a period.
- Console styling uses ANSI sequences and is auto-disabled on Gecko/Firefox (`Utils.canConsoleStyles` sniffs the environment).
- The library must remain dependency-free. Guard environment access (`navigator`, `process`) with `typeof` checks + try/catch, as in `utils.ts`, so it works across browser/Node/Deno.

Full public API and usage examples are documented in `README.md`.
