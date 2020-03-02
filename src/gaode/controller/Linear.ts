import Scale from "./Scale";
import Util from "../utils/Util";
import NumberAuto from "./NumberAuto";

class Linear extends Scale{
  getDefaultCfg() {
    var cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      type: 'linear',
      isLinear: true,
      min: null,
      minLimit: null,
      max: null,
      maxLimit: null,
      nice: false,
      tickCount: null,
      tickInterval: null,
      snapArray: null
    });
  }
  init() {
    var self = this;
    if (!self.ticks) {
      self.min = self.translate(self.min);
      self.max = self.translate(self.max);
      self.initTicks();
    } else {
      var ticks = self.ticks;
      var firstValue = self.translate(ticks[0]);
      var lastValue = self.translate(ticks[ticks.length - 1]);
      if (Util.isNil(self.min) || self.min > firstValue) {
        self.min = firstValue;
      }
      if (Util.isNil(self.max) || self.max < lastValue) {
        self.max = lastValue;
      }
    }
  }
  calculateTicks() {
    var self = this;
    var min = self.min;
    var max = self.max;
    var count = self.tickCount;
    var interval = self.tickInterval;
    if (max < min) {
      throw new Error('max: '.concat(max, ' should not be less than min: ').concat(min));
    }
    var tmp = NumberAuto({
      min: min,
      max: max,
      minLimit: self.minLimit,
      maxLimit: self.maxLimit,
      minCount: count,
      maxCount: count,
      interval: interval,
      snapArray: this.snapArray
    });
    return tmp.ticks;
  }
  initTicks() {
    var self = this;
    var calTicks = self.calculateTicks();
    if (self.nice) {
      self.ticks = calTicks;
      self.min = calTicks[0];
      self.max = calTicks[calTicks.length - 1];
    } else {
      var ticks = [];
      Util.each(calTicks, function (tick) {
        if (tick >= self.min && tick <= self.max) {
          ticks.push(tick);
        }
      });
      if (!ticks.length) {
        ticks.push(self.min);
        ticks.push(self.max);
      }
      self.ticks = ticks;
    }
  }
  scale(value) {
    if (value === null || value === undefined) {
      return NaN;
    }
    var max = this.max;
    var min = this.min;
    if (max === min) {
      return 0;
    }
    var percent = (value - min) / (max - min);
    var rangeMin = this.rangeMin();
    var rangeMax = this.rangeMax();
    return rangeMin + percent * (rangeMax - rangeMin);
  }
  invert(value) {
    var percent = (value - this.rangeMin()) / (this.rangeMax() - this.rangeMin());
    return this.min + percent * (this.max - this.min);
  }
}

export default Linear
