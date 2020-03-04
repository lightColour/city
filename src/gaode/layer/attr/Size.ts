import AttributeBase from "./AttributeBase";
import Util from "../../utils/Util";

export default class Size extends AttributeBase {

    gradient: null;
    domainIndex: number = null;

    constructor(cfg) {
        super(cfg)
        this.names = ['size'];
        this.type = 'size';
        this.gradient = null;
        this.domainIndex = 0;
        return this;
    }

    mapping() {
        var self = this;
        var outputs = [];
        var scales = self.scales;
        var arr: any = Array.prototype.slice.call(arguments);
        if (self.values.length === 0) {
            var callback = this.callback.bind(this);
            outputs.push(callback.apply(void 0, arr));
        } else {
            if (!Util.isArray(self.values[0])) {
                self.values = [self.values];
            }
            for (var i = 0; i < scales.length; i++) {
                outputs.push(self.scaling(scales[i], arr[i]));
            }
        }
        this.domainIndex = 0;
        return outputs;
    }

    scaling(scale, v) {
        if (scale.type === 'identity') {
            return v;
        } else if (scale.type === 'linear') {
            var percent = scale.scale(v);
            return this.getLinearValue(percent);
        }
    }

    getLinearValue(percent) {
        var values = this.values[this.domainIndex];
        var steps = values.length - 1;
        var step = Math.floor(steps * percent);
        var leftPercent = steps * percent - step;
        var start = values[step];
        var end = step === steps ? start : values[step + 1];
        var rstValue = start + (end - start) * leftPercent;
        this.domainIndex += 1;
        return rstValue;
    }
}
