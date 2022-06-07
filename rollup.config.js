//@file: rollup.config.js
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import rollupTimeStamp from "./build/rollup-plugin-timestamp";
import RollupBuildInfo from './build/rollup-plugin-buildinfo';

const rbi = RollupBuildInfo.getInstance();

const config = [
    {
        input: 'src/main.ts',
        output: {
            file: 'dist/pyrolog.js',
            name: 'pyrolog',
            format: 'es',
            sourcemap: true
        },
        plugins: [
            typescript({ tsconfig: './tsconfig.json' }),
            rbi.plugin(),
            rollupTimeStamp('PyroLogJS')
        ],
        onwarn ( { loc, frame, message } ) {
            rbi.onwarn( { loc, frame, message } );
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
