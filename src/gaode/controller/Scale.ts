import Util from "../utils/Util";

class Scale {
    
    ticks;
    formatter;
    range;

    constructor(cfg) {
        var defaultCfg = this.getDefaultCfg();
        Util.mix(this, defaultCfg, cfg);
        this.init();
    }

    getDefaultCfg() {
        return {
            type: 'base',
            formatter: null,
            range: [
                0,
                1
            ],
            ticks: null,
            values: []
        };
    }
    init() {
    }
    getTicks() {
        var self = this;
        var ticks = self.ticks;
        var rst = [];
        Util.each(ticks, function (tick) {
            var obj;
            if (Util.isObject(tick)) {
                obj = tick;
            } else {
                obj = {
                    text: self.getText(tick),
                    tickValue: tick,
                    value: self.scale(tick)
                };
            }
            rst.push(obj);
        });
        return rst;
    }
    getText(value) {
        var formatter = this.formatter;
        value = formatter ? formatter(value) : value;
        if (Util.isNil(value) || !value.toString) {
            value = '';
        }
        return value.toString();
    }
    rangeMin() {
        return this.range[0];
    }
    rangeMax() {
        var range = this.range;
        return range[range.length - 1];
    }
    invert(value) {
        return value;
    }
    translate(value) {
        return value;
    }
    scale(value) {
        return value;
    }
    clone() {
        var self = this;
        var constr = self.constructor;
        var cfg = {};
        Util.each(self, function (v, k) {
            cfg[k] = self[k];
        });
        return new Scale(cfg);
    }
    change(info) {
        this.ticks = null;
        Util.mix(this, info);
        this.init();
        return this;
    }
}

export default Scale
