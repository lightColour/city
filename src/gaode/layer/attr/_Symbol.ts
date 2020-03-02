import AttributeBase from "./AttributeBase";

export default class _Symbol extends AttributeBase {

    gradient: null;

    constructor(cfg) {
        super(cfg)
        this.names = ['symbol'];
        this.type = 'symbol';
        this.gradient = null;
        return this;
    }
}
