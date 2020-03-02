import ColorUtil from "../../utils/ColorUtil";
import AttributeBase from "./AttributeBase";
import Util from "../../utils/Util";

export default class Color extends AttributeBase {

    gradient:any = null;
    linear: boolean = false;

    constructor(cfg) {
        super(cfg)
        this.names = ['color'];
        this.type = 'color';
        this.gradient = null;
        if (Util.isString(this.values)) {
            this.linear = true;
        }
        return this;
    }

    getLinearValue(percent) {
        var gradient = this.gradient;
        if (!gradient) {
            var values = this.values;
            gradient = ColorUtil.gradient(values);
            this.gradient = gradient;
        }
        var color = gradient(percent);
        return color;
    }
}
