import EventEmitter from "wolfy87-eventemitter"
import Util from "./utils/Util";

export default class Base extends EventEmitter {

    attrs: {}
    destroyed: boolean = false;

    constructor(cfg) {
        super();
        const attrs = { visible: true };
        const defaultCfg = this.getDefaultCfg();
        this.attrs = attrs;
        Util.assign(attrs, defaultCfg, cfg);
    }

    getDefaultCfg() {
        return {};
    }

    get(name: string) {
        return this.attrs[name];
    }

    set(name: string, value) {
        this.attrs[name] = value;
    }

    destroy() {
        this.attrs = {};
        this.removeAllListeners();
        this.destroyed = true;
    }
}