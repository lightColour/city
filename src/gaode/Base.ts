import EventEmitter from "wolfy87-eventemitter"

export default class Base extends EventEmitter {

    attr: {}
    destroyed: boolean = false;

    constructor(cfg) {
        super();
    }

    getDefaultCfg() {
        return {};
    }

    get(name: string) {
        return this.attr[name];
    }

    set(name: string, value) {
        this.attr[name] = value;
    }

    destroy() {
        this.attr = {};
        this.removeAllListeners();
        this.destroyed = true;
    }
}