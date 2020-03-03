import Linear from "./Linear";
import * as Util from "@antv/util";

class Log extends Linear {

    base;
    min;
    max;
    values;
    _minTick;
    positiveMin;
    tickCount;

    getDefaultCfg() {
        var cfg = super.getDefaultCfg();
        const dist: any = {};
        return Util.mix(dist, cfg, {
            type: 'log',
            base: 2,
            tickCount: 10,
            _minTick: null
        });
    }

    calculateTicks() {
        var self = this;
        var base = self.base;
        var minTick;
        if (self.min < 0) {
            throw new Error('The minimum value must be greater than zero!');
        }
        var maxTick = log(base, self.max);
        if (self.min > 0) {
            minTick = Math.floor(log(base, self.min));
        } else {
            var values = self.values;
            var positiveMin = self.max;
            Util.each(values, function (value) {
                if (value > 0 && value < positiveMin) {
                    positiveMin = value;
                }
            });
            if (positiveMin === self.max) {
                positiveMin = self.max / base;
            }
            if (positiveMin > 1) {
                positiveMin = 1;
            }
            minTick = Math.floor(log(base, positiveMin));
            self._minTick = minTick;
            self.positiveMin = positiveMin;
        }
        var count = maxTick - minTick;
        var tickCount = self.tickCount;
        var avg = Math.ceil(count / tickCount);
        var ticks = [];
        for (var i = minTick; i < maxTick + avg; i = i + avg) {
            ticks.push(Math.pow(base, i));
        }
        if (self.min === 0) {
            ticks.unshift(0);
        }
        return ticks;
    }

    _getScalePercent(value) {
        var max = this.max;
        var min = this.min;
        if (max === min) {
            return 0;
        }
        if (value <= 0) {
            return 0;
        }
        var base = this.base;
        var positiveMin = this.positiveMin;
        if (positiveMin) {
            min = positiveMin * 1 / base;
        }
        var percent;
        if (value < positiveMin) {
            percent = value / positiveMin / (log(base, max) - log(base, min));
        } else {
            percent = (log(base, value) - log(base, min)) / (log(base, max) - log(base, min));
        }
        return percent;
    }

    scale(value) {
        var percent = this._getScalePercent(value);
        var rangeMin = this.rangeMin();
        var rangeMax = this.rangeMax();
        return rangeMin + percent * (rangeMax - rangeMin);
    }

    invert(value) {
        var base = this.base;
        var max = log(base, this.max);
        var rangeMin = this.rangeMin();
        var range = this.rangeMax() - rangeMin;
        var min;
        var positiveMin = this.positiveMin;
        if (positiveMin) {
            if (value === 0) {
                return 0;
            }
            min = log(base, positiveMin / base);
            var appendPercent = 1 / (max - min) * range;
            if (value < appendPercent) {
                return value / appendPercent * positiveMin;
            }
        } else {
            min = log(base, this.min);
        }
        var percent = (value - rangeMin) / range;
        var tmp = percent * (max - min) + min;
        return Math.pow(base, tmp);
    }
}

function log(a, b) {
    if (a === 1) {
        return 1;
    }
    return Math.log(b) / Math.log(a);
}

export default Log
