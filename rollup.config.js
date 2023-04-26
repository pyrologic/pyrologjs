//@file: rollup.config.js
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import workerLoader from './plugins/web-worker-loader/index.js';
import { PyrologicRollupPlugin } from "@pyrologic/rollup-plugin";

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

const plugin = PyrologicRollupPlugin.getInstance();

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
            workerLoader({ targetPlatform: 'base64', pattern: /.+\.worker\.(?:js|ts)$/, extensions: extensions }),
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
