import AttributeBase from "./AttributeBase";

export default class Shape extends AttributeBase {

    gradient: null;
    values: any = null;

    constructor(cfg) {
        super(cfg)
        this.names = ['shape'];
        this.type = 'shape';
        this.gradient = null;
        return this;
    }

    getLinearValue(percent) {
        var values = this.values;
        var index = Math.round((values.length - 1) * percent);
        return values[index];
    }

    _getAttrValue(scale, value) {
        if (this.values === 'text') {
            return value;
        }
        var values = this.values;
        if (scale.isCategory && !this.linear) {
            var index = scale.translate(value);
            return values[index % values.length];
        }
        var percent = scale.scale(value);
        return this.getLinearValue(percent);
    }
}
