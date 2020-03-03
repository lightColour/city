import * as Util from "@antv/util";
import Linear from "./Linear";

class Pow extends Linear{

  exponent;
  max;
  min;
  tickCount;

  getDefaultCfg() {
    var cfg = super.getDefaultCfg();
    const dist: any = {};
    return Util.mix(dist, cfg, {
      type: 'pow',
      exponent: 2,
      tickCount: 10
    });
  }
  calculateTicks() {
    var self = this;
    var exponent = self.exponent;
    var min;
    var max = Math.ceil(calBase(exponent, self.max));
    if (self.min >= 0) {
      min = Math.floor(calBase(exponent, self.min));
    } else {
      min = 0;
    }
    if (min > max) {
      var tmp = max;
      max = min;
      min = tmp;
    }
    var count = max - min;
    var tickCount = self.tickCount;
    var avg = Math.ceil(count / tickCount);
    var ticks = [];
    for (var i = min; i < max + avg; i = i + avg) {
      ticks.push(Math.pow(i, exponent));
    }
    return ticks;
  }
  _getScalePercent(value) {
    var max = this.max;
    var min = this.min;
    if (max === min) {
      return 0;
    }
    var exponent = this.exponent;
    var percent = (calBase(exponent, value) - calBase(exponent, min)) / (calBase(exponent, max) - calBase(exponent, min));
    return percent;
  }
  scale(value) {
    var percent = this._getScalePercent(value);
    var rangeMin = this.rangeMin();
    var rangeMax = this.rangeMax();
    return rangeMin + percent * (rangeMax - rangeMin);
  }
  invert(value) {
    var percent = (value - this.rangeMin()) / (this.rangeMax() - this.rangeMin());
    var exponent = this.exponent;
    var max = calBase(exponent, this.max);
    var min = calBase(exponent, this.min);
    var tmp = percent * (max - min) + min;
    return Math.pow(tmp, exponent);
  }
}

function calBase(a, b) {
  var e = Math.E;
  var value = Math.pow(e, Math.log(b) / a);
  return value;
}

export default Pow
