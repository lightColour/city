import * as Util from "@antv/util";
import TimeUtil from "./TimeUtil";

import fecha from "fecha";
import Category from "./Category";
import CatAuto from "./CatAuto";

class TimeCategory extends Category {

    values: any = null;
    ticks: any = null;
    tickCount;
    formatter;
    mask;

    getDefaultCfg() {
        var cfg = super.getDefaultCfg();
        return Util.mix({}, cfg, {
            type: 'timeCat',
            mask: 'YYYY-MM-DD',
            tickCount: 7
        });
    }

    init() {
        var self = this;
        var values = this.values;
        Util.each(values, function (v, i) {
            values[i] = self._toTimeStamp(v);
        });
        values.sort(function (v1, v2) {
            return v1 - v2;
        });
        if (!self.ticks) {
            self.ticks = this.calculateTicks(false);
        }
    }

    calculateTicks(formated) {
        var self = this;
        var count = self.tickCount;
        var ticks;
        if (count) {
            var temp = CatAuto({
                maxCount: count,
                data: self.values
            });
            ticks = temp['ticks'];
        } else {
            ticks = self.values;
        }
        if (formated) {
            Util.each(ticks, function (value, index) {
                ticks[index] = fecha.format(value, self.mask);
            });
        }
        return ticks;
    }

    translate(value) {
        value = this._toTimeStamp(value);
        var index = this.values.indexOf(value);
        if (index === -1) {
            if (Util.isNumber(value) && value < this.values.length) {
                index = value;
            } else {
                index = NaN;
            }
        }
        return index;
    }

    scale(value) {
        var rangeMin = this.rangeMin();
        var rangeMax = this.rangeMax();
        var index = this.translate(value);
        var percent;
        if (this.values.length === 1) {
            percent = index;
        } else if (index > -1) {
            percent = index / (this.values.length - 1);
        } else {
            percent = 0;
        }
        return rangeMin + percent * (rangeMax - rangeMin);
    }

    getText(value) {
        var result = null;
        var index = this.translate(value);
        if (index > -1) {
            result = this.values[index];
        } else {
            result = value;
        }
        var formatter = this.formatter;
        result = parseInt(result, 10);
        result = formatter ? formatter(result) : fecha.format(result, this.mask);
        return result;
    }

    getTicks() {
        var self = this;
        var ticks = this.ticks;
        var rst = [];
        Util.each(ticks, function (tick) {
            var obj;
            if (Util.isObject(tick)) {
                obj = tick;
            } else {
                obj = {
                    text: Util.isString(tick) ? tick : self.getText(tick),
                    tickValue: tick,
                    value: self.scale(tick)
                };
            }
            rst.push(obj);
        });
        return rst;
    }
    _toTimeStamp(value) {
        return TimeUtil.toTimeStamp(value);
    }
}

export default TimeCategory
