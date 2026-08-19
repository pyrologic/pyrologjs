//@file: rollup.config.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import { PyrologicRollupPlugin } from "@pyrologic/rollup-plugin";

const plugin = PyrologicRollupPlugin.getInstance();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// the package version, burned into the build via src/version.ts
// (single source of truth: package.json)
const PKG_VERSION = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "package.json"), "utf8")
).version;

/**
 * generates src/version.ts before each build so the burned-in version stays in
 * sync with package.json. The file is git-ignored and regenerated on every build.
 */
function versionPlugin() {
    return {
        name: "pyrolog-version",
        buildStart() {
            const fpath = path.resolve(__dirname, "src", "version.ts");
            console.log("PyroLogJS version:", PKG_VERSION);
            const data =
                "// GENERATED FILE — do not edit. Written by rollup.config.mjs at build time.\n" +
                "// Single source of truth: the \"version\" field in package.json.\n" +
                `const VERSION = ${JSON.stringify(PKG_VERSION)};\n` +
                "export { VERSION };\n";
            fs.writeFileSync(fpath, data);
        }
    };
}

const config = [
    {
        input: 'src/main.ts',
        output: [
            {
                // readable bundle: consumers can tree-shake / minify it themselves
                file: 'dist/pyrolog.js',
                name: 'pyrolog',
                format: 'es',
                sourcemap: true
            },
            {
                // ready-to-use minified bundle with its own source map for debugging
                file: 'dist/pyrolog.min.js',
                name: 'pyrolog',
                format: 'es',
                sourcemap: true,
                plugins: [ terser() ]
            }
        ],
        plugins: [
            versionPlugin(),
            typescript({ tsconfig: './tsconfig.json' }),
            plugin.infoPlugin(),
            plugin.timestampPlugin('PyroLogJS')
        ],
        onwarn ( { loc, frame, message } ) {
            plugin.onwarn( { loc, frame, message } );
        }
    },
    {
        // path to your declaration files root
        input: './dist/dts/main.d.ts',
        output: [ { file: 'dist/pyrolog.d.ts', format: 'es' } ],
        plugins: [ dts() ],
    }
];

export default config;
