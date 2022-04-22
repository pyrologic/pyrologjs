export default function rollupTimeStamp() {
    return {
        name: 'rollup-timestamp',
        buildStart() {
            console.log( ( '\n[' + new Date().toLocaleString() + ']' ) + ' New rollup build.\n' );
            return null;
        }
    }
}
