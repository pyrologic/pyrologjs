//@file: rollup.config.js
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import { PyrologicRollupPlugin } from "@pyrologic/rollup-plugin";

const plugin = PyrologicRollupPlugin.getInstance();

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
