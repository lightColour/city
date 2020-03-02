import * as Util from "@antv/util";
import AutoUtil from "./AutoUtil";

var MAX_COUNT = 6;
var SNAP_ARRAY = [
    1,
    2,
    4,
    6,
    8,
    12
];
var MINUTE_MS = 60 * 1000;
var HOUR_MS = 3600 * 1000;
var DAY_MS = 24 * 3600 * 1000;
function getYear(date) {
    return new Date(date).getFullYear();
}
function createYear(year) {
    return new Date(year, 0, 1).getTime();
}
function getMonth(date) {
    return new Date(date).getMonth();
}
function diffMonth(min, max) {
    var minYear = getYear(min);
    var maxYear = getYear(max);
    var minMonth = getMonth(min);
    var maxMonth = getMonth(max);
    return (maxYear - minYear) * 12 + (maxMonth - minMonth) % 12;
}
function creatMonth(year, month) {
    return new Date(year, month, 1).getTime();
}
function diffDay(min, max) {
    return Math.ceil((max - min) / DAY_MS);
}
function diffHour(min, max) {
    return Math.ceil((max - min) / HOUR_MS);
}
function diffMinus(min, max) {
    return Math.ceil((max - min) / (60 * 1000));
}
export default function (info) {
    var minInterval = info.minInterval;
    var ticks = [];
    var min = info.min;
    var max = info.max;
    var interval = info.interval;
    var count;
    if (max === min) {
        max = min + DAY_MS;
    }
    if (Util.isNil(interval)) {
        var innerTime = max - min;
        var dms = DAY_MS;
        var yms = 365 * dms;
        interval = parseInt(`${innerTime / (info.maxCount || MAX_COUNT)}`, 10);
        if (minInterval && minInterval > interval) {
            interval = minInterval;
        }
        var yfactor = interval / yms;
        var minYear = getYear(min);
        if (yfactor > 0.51) {
            var year = Math.ceil(yfactor);
            var maxYear = getYear(max);
            for (var i = minYear; i <= maxYear + year; i = i + year) {
                ticks.push(createYear(i));
            }
            interval = null;
        } else if (yfactor > 0.0834) {
            var month = Math.ceil(yfactor / 0.0834);
            var mmMoth = getMonth(min);
            var dMonths = diffMonth(min, max);
            for (var _i = 0; _i <= dMonths + month; _i = _i + month) {
                ticks.push(creatMonth(minYear, _i + mmMoth));
            }
            interval = null;
        } else if (interval > dms * 0.5) {
            var date = new Date(min);
            var _year = date.getFullYear();
            var _month = date.getMonth();
            var mday = date.getDate();
            var day = Math.ceil(interval / dms);
            var ddays = diffDay(min, max);
            interval = day * dms;
            for (var _i2 = 0; _i2 < ddays + day; _i2 = _i2 + day) {
                ticks.push(new Date(_year, _month, mday + _i2).getTime());
            }
        } else if (interval > HOUR_MS) {
            var _date = new Date(min);
            var _year2 = _date.getFullYear();
            var _month2 = _date.getMonth();
            var _day = _date.getDate();
            var hour = _date.getHours();
            var hours = AutoUtil.snapTo(SNAP_ARRAY, Math.ceil(interval / HOUR_MS));
            var dHours = diffHour(min, max);
            interval = hours * HOUR_MS;
            for (var _i3 = 0; _i3 <= dHours + hours; _i3 = _i3 + hours) {
                ticks.push(new Date(_year2, _month2, _day, hour + _i3).getTime());
            }
        } else if (interval > MINUTE_MS) {
            var dMinus = diffMinus(min, max);
            var minutes = Math.ceil(interval / MINUTE_MS);
            interval = minutes * MINUTE_MS;
            for (var _i4 = 0; _i4 <= dMinus + minutes; _i4 = _i4 + minutes) {
                ticks.push(min + _i4 * MINUTE_MS);
            }
        } else {
            if (interval < 1000) {
                interval = 1000;
            }
            min = Math.floor(min / 1000) * 1000;
            var dSeconds = Math.ceil((max - min) / 1000);
            var seconds = Math.ceil(interval / 1000);
            interval = seconds * 1000;
            for (var _i5 = 0; _i5 < dSeconds + seconds; _i5 = _i5 + seconds) {
                ticks.push(min + _i5 * 1000);
            }
        }
    }
    if (!ticks.length) {
        min = Math.floor(min / 1000) * 1000;
        max = Math.ceil(max / 1000) * 1000;
        count = (max - min) / interval;
        for (var _i6 = 0; _i6 <= count; _i6++) {
            ticks.push(Util.fixedBase(interval * _i6 + min, interval));
        }
    }
    return {
        max: max,
        min: min,
        interval: interval,
        ticks: ticks,
        count: ticks.length
    };
};
