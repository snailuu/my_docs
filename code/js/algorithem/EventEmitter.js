const { type } = require("os");

class EventEmitter {
    constructor() {
        this.event = {}
    }

    on(type, cb) {
        if (!this.event[type]) {
            this.event[type] = [];
        }
        this.event[type].push(cb);
    }



    off(type, cb) {
        if (!this.event[type]) {
            return;
        }
        this.event[type] = this.event[type].filter(item => item !== cb)
    }


    once(type, cb) {
        const fn = (...args) => {
            cb(...args);
            this.off(type, fn);
        }
        this.on(type, fn);
    }

    emit(type, ...args) {
        if (!this.event[type]) {
            return
        }

        this.event[type].forEach(cb => {
            cb(...args);
        })
    }
}

let ev = new EventEmitter();

const fn1 = (a, b) => {
    console.log(a, b, 'fn1');
}
const fn2 = (a, b) => {
    console.log(a, b, 'fn2');
}
const fn3 = (a, b) => {
    console.log(a, b, 3);
}

ev.on('run', fn1)
ev.once('run', fn2)
ev.emit('run', 1, 1)
ev.emit('run', 2, 2)
    // 1 1 fn1
    // 1 1 fn2
    // 2 2 fn1