import AttributeBase from "./AttributeBase";

export default class Filter extends AttributeBase {

    gradient: null;

    constructor(cfg) {
        super(cfg)
        this.names = ['filter'];
        this.type = 'filter';
        this.gradient = null;
        return this;
    }
}
