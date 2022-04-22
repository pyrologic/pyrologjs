//@file: rollup.config.js
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import rollupTimeStamp from "./build/rollup-plugin-timestamp";

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
            rollupTimeStamp()
        ]
    },
    {
        // path to your declaration files root
        input: './dist/dts/main.d.ts',
        output: [ { file: 'dist/pyrolog.d.ts', format: 'es' } ],
        plugins: [ dts() ],
    }
];

export default config;
