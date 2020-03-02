import Scale from "./Scale";
import Util from "../utils/Util";

class Identity extends Scale {
  getDefaultCfg() {
    var cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      isIdentity: true,
      type: 'identity',
      value: null
    });
  }

  getText() {
    return this.value.toString();
  }

  scale(value) {
    if (this.value !== value && Util.isNumber(value)) {
      return value;
    }
    return this.range[0];
  }

  invert() {
    return this.value;
  }
}

export default Identity
