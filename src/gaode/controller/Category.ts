import Scale from "./Scale";
import Util from "../utils/Util";
import CatAuto from "./CatAuto";

class Category extends Scale {
    getDefaultCfg() {
        var cfg = super.getDefaultCfg();
        return Util.mix({}, cfg, {
            type: 'cat',
            tickCount: null,
            isCategory: true
        });
    }

    init() {
        var self = this;
        var values = self.values;
        var tickCount = self.tickCount;
        Util.each(values, function (v, i) {
            values[i] = v.toString();
        });
        if (!self.ticks) {
            var ticks = values;
            if (tickCount) {
                var temp = CatAuto({
                    maxCount: tickCount,
                    data: values
                });
                ticks = temp.ticks;
            }
            this.ticks = ticks;
        }
    }

    getText(value) {
        if (this.values.indexOf(value) === -1 && Util.isNumber(value)) {
            value = this.values[Math.round(value)];
        }
        return super.getDefaultCfg(value);
    }

    translate(value) {
        var index = this.values.indexOf(value);
        if (index === -1 && Util.isNumber(value)) {
            index = value;
        } else if (index === -1) {
            index = NaN;
        }
        return index;
    }

    scale(value) {
        var rangeMin = this.rangeMin();
        var rangeMax = this.rangeMax();
        var percent;
        if (Util.isString(value) || this.values.indexOf(value) !== -1) {
            value = this.translate(value);
        }
        if (this.values.length > 1) {
            percent = value / (this.values.length - 1);
        } else {
            percent = value;
        }
        return rangeMin + percent * (rangeMax - rangeMin);
    }

    invert(value) {
        if (Util.isString(value)) {
            return value;
        }
        var min = this.rangeMin();
        var max = this.rangeMax();
        if (value < min) {
            value = min;
        }
        if (value > max) {
            value = max;
        }
        var percent = (value - min) / (max - min);
        var index = Math.round(percent * (this.values.length - 1)) % this.values.length;
        index = index || 0;
        return this.values[index];
    }

}
export default Category;
