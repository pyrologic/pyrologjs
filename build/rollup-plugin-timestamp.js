export default function rollupTimeStamp(args) {
    return {
        name: 'rollup-timestamp',
        buildStart() {
            let name = '';
            if ( typeof args === 'string') {
                name = args;
            } else if ( typeof args === 'object' ) {
                name = args.name;
            }
            if ( typeof name === 'string' && name.length > 0 ) {
                console.log( `\n[${new Date().toLocaleString()}] New "${name}" build.\n`);
            } else {
                console.log( ( '\n[' + new Date().toLocaleString() + ']' ) + ' New rollup build.\n' );
            }
            return null;
        }
    }
}
