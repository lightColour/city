import Util from "../utils/Util";
import AutoUtil from "./AutoUtil";
import Global from '../Global';

var MIN_COUNT = 5;
var MAX_COUNT = 7;
export default function (info) {
  var min = info.min;
  var max = info.max;
  var interval = info.interval;
  var ticks = [];
  var minCount = info.minCount || MIN_COUNT;
  var maxCount = info.maxCount || MAX_COUNT;
  var isFixedCount = minCount === maxCount;
  var minLimit = Util.isNil(info.minLimit) ? -Infinity : info.minLimit;
  var maxLimit = Util.isNil(info.maxLimit) ? Infinity : info.maxLimit;
  var avgCount = (minCount + maxCount) / 2;
  var count = avgCount;
  var snapArray = info.snapArray ? info.snapArray : isFixedCount ? Global.snapCountArray : Global.snapArray;
  if (min === minLimit && max === maxLimit && isFixedCount) {
    interval = (max - min) / (count - 1);
  }
  if (Util.isNil(min)) {
    min = 0;
  }
  if (Util.isNil(max)) {
    max = 0;
  }
  if (max === min) {
    if (min === 0) {
      max = 1;
    } else {
      if (min > 0) {
        min = 0;
      } else {
        max = 0;
      }
    }
    if (max - min < 5 && !interval && max - min >= 1) {
      interval = 1;
    }
  }
  if (Util.isNil(interval)) {
    var temp = (max - min) / (avgCount - 1);
    interval = AutoUtil.snapFactorTo(temp, snapArray, 'ceil');
    if (maxCount !== minCount) {
      count = parseInt(`${(max - min) / interval}`, 10);
      if (count > maxCount) {
        count = maxCount;
      }
      if (count < minCount) {
        count = minCount;
      }
      interval = AutoUtil.snapFactorTo((max - min) / (count - 1), snapArray, 'floor');
    }
  }
  if (info.interval || maxCount !== minCount) {
    max = Math.min(AutoUtil.snapMultiple(max, interval, 'ceil'), maxLimit);
    min = Math.max(AutoUtil.snapMultiple(min, interval, 'floor'), minLimit);
    count = Math.round((max - min) / interval);
    min = Util.fixedBase(min, interval);
    max = Util.fixedBase(max, interval);
  } else {
    avgCount = parseInt(`${avgCount}`, 10);
    var avg = (max + min) / 2;
    var avgTick = AutoUtil.snapMultiple(avg, interval, 'ceil');
    var sideCount = Math.floor((avgCount - 2) / 2);
    var maxTick = avgTick + sideCount * interval;
    var minTick;
    if (avgCount % 2 === 0) {
      minTick = avgTick - sideCount * interval;
    } else {
      minTick = avgTick - (sideCount + 1) * interval;
    }
    if (maxTick < max) {
      maxTick = maxTick + interval;
    }
    if (minTick > min) {
      minTick = minTick - interval;
    }
    max = Util.fixedBase(maxTick, interval);
    min = Util.fixedBase(minTick, interval);
  }
  max = Math.min(max, maxLimit);
  min = Math.max(min, minLimit);
  ticks.push(min);
  for (var i = 1; i < count; i++) {
    var tickValue = Util.fixedBase(interval * i + min, interval);
    if (tickValue < max) {
      ticks.push(tickValue);
    }
  }
  if (ticks[ticks.length - 1] < max) {
    ticks.push(max);
  }
  return {
    min: min,
    max: max,
    interval: interval,
    count: count,
    ticks: ticks
  };
};
