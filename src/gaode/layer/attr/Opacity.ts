import AttributeBase from "./AttributeBase";

export default class Opacity extends AttributeBase {

    gradient: null;

    constructor(cfg) {
        super(cfg)
        this.names = ['opacity'];
        this.type = 'opacity';
        this.gradient = null;
        return this;
    }
}
