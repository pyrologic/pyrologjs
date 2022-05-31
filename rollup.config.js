//@file: rollup.config.js
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import rollupTimeStamp from "./build/rollup-plugin-timestamp";

let wc = 0;

function ruBuild() {
    return {
        name: 'ru-init',
        buildStart() {
            wc = 0;
        },
        buildEnd() {
            if ( wc > 0 ) {
                console.log('\x1b[33m%s\x1b[0m', `Build ended with ${wc} warnings!`);
            } else {
                console.log('\x1b[32m%s\x1b[0m', 'Build ended with no warnings.');
            }
        }
    }
}


const config = [
    {
        input: 'src/main.ts',
        output: {
            file: 'dist/pyrolog.js',
            name: 'pyrolog',
            format: 'umd',
            sourcemap: true
        },
        plugins: [
            typescript({ tsconfig: './tsconfig.json' }),
            ruBuild(),
            rollupTimeStamp()
        ],
        onwarn ( { loc, frame, message } ) {
            if ( loc ) {
                console.warn(`#${++wc}: ${loc.file} (${loc.line}:${loc.column}) ${message}`);
                if ( frame ) {
                    console.warn(frame);
                }
            } else {
                console.warn(`#${++wc}: ${message}`);
            }
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
