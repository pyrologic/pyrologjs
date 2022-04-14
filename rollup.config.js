// rollup.config.js
import typescript from "@rollup/plugin-typescript";
// import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/main.ts',
    output: {
        file: 'dist/pyrolog.js',
        format: 'umd',
        sourcemap: true
    },
    // output: [
    //    { file: 'dist/pyrolog.min.js', format: 'umd', sourcemap: true, plugins: [ typescript(), terser() ] } 
    // ],
    plugins: [ typescript() ]
};