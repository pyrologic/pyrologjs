//@file: rollup.config.prod.js
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import rollupTimeStamp from "./build/rollup-plugin-timestamp";
import RollupBuildInfo from './build/rollup-plugin-buildinfo';

const rbi = RollupBuildInfo.getInstance();

const config = [
    {
        input: 'src/main.ts',
        output: {
            file: 'dist/pyrolog.min.js',
            name: 'pyrolog',
            format: 'umd',
            sourcemap: true,
            plugins: [ terser() ]
        },
        plugins: [
            typescript({ tsconfig: './tsconfig.prod.json' }),
            rbi.plugin(),
            rollupTimeStamp()
        ],
        onwarn ( { loc, frame, message } ) {
            rbi.onwarn( { loc, frame, message } );
        }
    },
    {
        // path to your declaration files root
        input: './dist/dts-prod/main.d.ts',
        output: [ { file: 'dist/pyrolog.min.d.ts', format: 'es' } ],
        plugins: [ dts() ],
    }
];

export default config;
