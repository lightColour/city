import ColorUtil from "../../utils/ColorUtil";
import Util from "../../utils/Util";

export default class AttributeBase {

    type: string = null;
    name: string = null;
    method: null;
    values: Array<any> = [];
    scales: Array<any> = [];
    linear: boolean = false;

    names: Array<any> = [];

    count2: number = 0;

    constructor(cfg) {
        this.type = 'base';
        this.name = null;
        this.method = null;
        this.values = [];
        this.scales = [];
        this.linear = null;
        Util.mix(this, cfg);
    }

    get(name) {
        return this[name];
    }

    set(name, value) {
        this[name] = value;
    }

    getAttrValue(scale, value) {
        var values = this.values;
        if (scale.isCategory && !this.linear) {
            var index = scale.translate(value);
            return values[index % values.length];
        }
        var percent = scale.scale(value);
        return this.getLinearValue(percent);
    }

    getLinearValue(percent) {
        var values = this.values;
        var steps = values.length - 1;
        var step = Math.floor(steps * percent);
        var leftPercent = steps * percent - step;
        var start = values[step];
        var end = step === steps ? start : values[step + 1];
        var rstValue = start + (end - start) * leftPercent;
        return rstValue;
    }

    callback(value: any) {
        var self = this;
        var scale = self.scales[0];
        var rstValue = null;
        if (scale.type === 'identity') {
            rstValue = scale.value;
        } else {
            rstValue = self.getAttrValue(scale, value);
        }
        return rstValue;
    }

    getNames() {
        var scales = this.scales;
        var names = this.names;
        var length = Math.min(scales.length, names.length);
        var rst = [];
        for (var i = 0; i < length; i++) {
            rst.push(names[i]);
        }
        return rst;
    }

    getFields() {
        var scales = this.scales;
        var rst = [];
        Util.each(scales, function (scale) {
            rst.push(scale.field);
        });
        return rst;
    }

    getScale(name) {
        var scales = this.scales;
        var names = this.names;
        var index = names.indexOf(name);
        return scales[index];
    }

    mapping() {
        if (this.count2 == 0) {
            console.log(222222)
            console.log(arguments)
            this.count2++;
        }
        
        var scales = this.scales;
        var callback = this.callback;
        let params: any = new Array(_len);
        for (var _len = arguments.length, _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }
        var values = params;
        if (callback) {
            for (var i = 0; i < params.length; i++) {
                params[i] = this.toOriginParam(params[i], scales[i]);
            }
            values = callback.apply(this, params);
        }
        if (this.type === 'color' && !Util.isArray(values)) {
            values = ColorUtil.toRGB(values).map(function (e) {
                return e / 255;
            });
        }
        if (!Util.isArray(values)) {
            values = [values];
        }
        return values;
    }

    toOriginParam(param, scale) {
        console.log(param, scale)
        var rst = param;
        if (!scale.isLinear) {
            if (Util.isArray(param)) {
                rst = [];
                for (var i = 0; i < param.length; i++) {
                    rst.push(toScaleString(scale, param[i]));
                }
            } else {
                rst = toScaleString(scale, param);
            }
        }
        return rst;
    }
}


function toScaleString(scale, value) {
    if (Util.isString(value)) {
        return value;
    }
    return scale.invert(scale.scale(value));
}
