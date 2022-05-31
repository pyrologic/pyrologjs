export default class RollupBuildInfo {
    constructor() {
        this.wcount = 0;
    }

    static getInstance() {
        return singleton;
    }

    buildStart() {
        this.wcount = 0;
    }

    buildEnd() {
        const wc = this.wcount;
        if ( wc > 0 ) {
            console.log('\x1b[33m%s\x1b[0m', `Build ended with ${wc} warnings!`);
        } else {
            console.log('\x1b[32m%s\x1b[0m', 'Build ended with no warnings.');
        }
    }

    plugin() {
        const self = this;
        return {
            name: 'ru-build-info',
            buildStart() {
                self.buildStart();
            },
            buildEnd() {
                self.buildEnd();
            }
        }
    }

    onwarn ( { loc, frame, message } ) {
        if ( loc ) {
            console.warn(`#${++this.wcount}: ${loc.file} (${loc.line}:${loc.column}) ${message}`);
            if ( frame ) {
                console.warn(frame);
            }
        } else {
            console.warn(`#${++this.wcount}: ${message}`);
        }
    }
}

const singleton = new RollupBuildInfo();