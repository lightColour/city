import Util from "../utils/Util";

import fecha from "fecha";
import TimeUtil from "./TimeUtil";
import TimeAuto from "./TimeAuto";
import Linear from "./Linear";

class Time extends Linear {

    values;
    minTickInterval;
    min;
    max;
    tickCount;
    tickInterval;
    formatter;
    mask;

    getDefaultCfg() {
        var cfg = super.getDefaultCfg();
        const dist: any = {};
        return Util.mix(dist, cfg, {
            type: 'time',
            mask: 'YYYY-MM-DD'
        });
    }
    init() {
        var self = this;
        var values = self.values;
        if (values && values.length) {
            var timeStamps = [];
            var min = Infinity;
            var secondMin = min;
            var max = 0;
            Util.each(values, function (v) {
                var timeStamp = self._toTimeStamp(v);
                if (isNaN(timeStamp)) {
                    throw new TypeError('Invalid Time: '.concat(v));
                }
                if (min > timeStamp) {
                    secondMin = min;
                    min = timeStamp;
                } else if (secondMin > timeStamp) {
                    secondMin = timeStamp;
                }
                if (max < timeStamp) {
                    max = timeStamp;
                }
                timeStamps.push(timeStamp);
            });
            if (values.length > 1) {
                self.minTickInterval = secondMin - min;
            }
            if (Util.isNil(self.min) || self._toTimeStamp(self.min) > min) {
                self.min = min;
            }
            if (Util.isNil(self.max) || self._toTimeStamp(self.max) < max) {
                self.max = max;
            }
        }
        super.init()
    }
    calculateTicks() {
        var self = this;
        var min = self.min;
        var max = self.max;
        var count = self.tickCount;
        var interval = self.tickInterval;
        var tmp = TimeAuto({
            min: min,
            max: max,
            minCount: count,
            maxCount: count,
            interval: interval,
            minInterval: self.minTickInterval
        });
        return tmp.ticks;
    }
    getText(value) {
        var formatter = this.formatter;
        value = this.translate(value);
        value = formatter ? formatter(value) : fecha.format(value, this.mask);
        return value;
    }
    scale(value) {
        if (Util.isString(value)) {
            value = this.translate(value);
        }
        return super.scale(value);
    }
    translate(value) {
        return this._toTimeStamp(value);
    }
    _toTimeStamp(value) {
        return TimeUtil.toTimeStamp(value);
    }

}

export default Time
