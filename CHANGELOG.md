# Changelog

All notable changes to **@pyrologic/pyrologjs** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.2.0] - 2026-08-19

### Changed
- **BREAKING** (released as a minor bump — see note below): Replaced the `Level`
  TypeScript `enum` with a plain, frozen const object of the same numeric values
  (`ALL` = 0 … `OFF` = 7). `Level` is now directly usable from plain JavaScript
  consumers, not just TypeScript. Type-level uses that relied on `Level` being an
  `enum` type may need adjusting; runtime member access (`Level.INFO`) is unchanged.
- Consolidated the level helper functions (`Level2String`, `Level2LevelString`,
  `String2LevelString`, `String2Level`) to look level names up via a reverse map
  instead of `switch` statements; added the `isLevelString` type guard.

### Deprecated
- `JsLevel` is now merely an alias for `Level` and is kept only for backwards
  compatibility. New code should import and use `Level` directly.

### Notes
- Although the `Level` change is technically breaking, this is released as a minor
  version because the package is consumed only by projects under our own control,
  where upgrade timing is coordinated. If it is ever published for external
  consumers, breaking changes should resume warranting a major bump.

## [2.1.0] - 2026-07-15

### Added
- Ready-to-use minified bundle (`dist/pyrolog.min.js`) with its own source map,
  importable via the `@pyrologic/pyrologjs/min` subpath.

### Changed
- Package configured as ESM and TypeScript target modernized.
- Updated development dependencies to their latest versions.

### Fixed
- Excluded Safari (WebKit) from ANSI console styling detection.
- Corrected spelling and grammar in the README.

## [2.0.1] - 2025-09-09

### Changed
- Documentation improvements in the README.

## [2.0.0] - 2025-09-09

### Added
- Styling of log output: text color, background color and text attributes
  (bold, italic, underline, line-through) via ANSI sequences.
- Global per-level styles and logger-specific styles, settable through the API
  and via configuration items.
- Style resolution that walks up the configuration tree to find the closest
  matching style definition.
- Detection of whether the runtime environment supports console styling.
- `forEachLevel()` level helper.

## [1.4.1] - 2025-08-08

### Changed
- Switched the project fully to npm; removed leftover yarn tooling and files.

## [1.4.0] - 2025-08-07

### Added
- New logging level `FATAL`.

### Changed
- Level `OFF` is now never enabled for logging.
- Exported `Utils` publicly as `PyroLogUtils`.

## [1.3.7] - 2025-06-25

### Changed
- Dependency updates.

## [1.3.6] - 2024-09-25

### Changed
- Upgraded Node.js, yarn and rollup toolchain.
- Corrected the git repository URL.

## [1.3.5] - 2024-02-08

### Added
- Exported the `PyroLogger` class for JavaScript clients.

## [1.3.4] - 2023-04-24

### Fixed
- Corrected calling function/method name detection.

### Changed
- Upgraded TypeScript and rollup.

## [1.3.3] - 2023-02-03

### Added
- Allow the "write function name" flag to be defined globally (on the default logger).

### Changed
- Default `writeFnc` to `null` so loggers can inherit it from the default configuration.

## [1.3.2] - 2022-10-04

### Added
- Individual loggers can be set to a "suspended" state.

## [1.3.1] - 2022-09-02

### Added
- Support for global options (`useDebug`, `suspended`).

## [1.3.0] - 2022-08-30

### Added
- Custom prefix generators, including a callback-function-based variant.
- Exposed the `writeFnc` and `fncOffset` logger properties.
- Exported the `Utils` class.

## [1.2.1] - 2022-07-05

### Changed
- Documentation improvements.

## [1.2.0] - 2022-07-03

### Added
- Hierarchical, Log4j-style logger configuration with best-match inheritance.
- Exported `Level2String`.

### Changed
- Logger names are normalized/trimmed and path errors are handled.

## [1.1.4] - 2022-06-17

### Fixed
- Corrected a misspelled method name.

## [1.1.3] - 2022-06-17

### Added
- `Logger.isTraceEnabled()` shortcut method.

## [1.1.2] - 2022-06-17

### Added
- Timestamp prepended to each logging output.

## [1.1.1] - 2022-06-12

### Added
- Offset for the call stack used to resolve the name of the calling function.

## [1.1.0] - 2022-06-09

### Added
- "Write function name" support: loggers can emit the name of the calling
  function/method alongside each message.

## [1.0.0] - 2022-06-02

### Added
- Initial release: the `PyroLog` singleton, hierarchical loggers with per-level
  gating, `console.debug()`/`console.log()` selection via `useDebug`, the `OFF`
  level, appenders, stack-trace helpers, and the `JsLevel` JavaScript mirror of
  the `Level` enum. Built as an ES module for use in browsers, Node.js and Deno.

[Unreleased]: https://github.com/pyrologic/pyrologjs/compare/v2.2.0...HEAD
[2.2.0]: https://github.com/pyrologic/pyrologjs/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/pyrologic/pyrologjs/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/pyrologic/pyrologjs/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/pyrologic/pyrologjs/compare/v1.4.0...v2.0.0
[1.4.0]: https://github.com/pyrologic/pyrologjs/compare/v1.3.7...v1.4.0
[1.3.7]: https://github.com/pyrologic/pyrologjs/compare/v1.3.5...v1.3.7
[1.3.5]: https://github.com/pyrologic/pyrologjs/compare/v1.3.4...v1.3.5
[1.3.4]: https://github.com/pyrologic/pyrologjs/compare/v1.3.3...v1.3.4
[1.3.3]: https://github.com/pyrologic/pyrologjs/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/pyrologic/pyrologjs/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/pyrologic/pyrologjs/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/pyrologic/pyrologjs/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/pyrologic/pyrologjs/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/pyrologic/pyrologjs/compare/v1.1.4...v1.2.0
[1.1.4]: https://github.com/pyrologic/pyrologjs/compare/v1.1.2...v1.1.4
[1.1.2]: https://github.com/pyrologic/pyrologjs/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/pyrologic/pyrologjs/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/pyrologic/pyrologjs/releases/tag/v1.1.0
