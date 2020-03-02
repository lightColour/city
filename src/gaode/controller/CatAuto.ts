import * as Util from "lodash";

var MAX_COUNT = 8;
var SUB_COUNT = 4;
function getSimpleArray(data) {
    var arr = [];
    Util.each(data, function (sub) {
        if (Util.isArray(sub)) {
            arr = arr.concat(sub);
        } else {
            arr.push(sub);
        }
    });
    return arr;
}
function getGreatestFactor(count, number) {
    var i;
    for (i = number; i > 0; i--) {
        if (count % i === 0) {
            break;
        }
    }
    if (i === 1) {
        for (i = number; i > 0; i--) {
            if ((count - 1) % i === 0) {
                break;
            }
        }
    }
    return i;
}
export default function (info) {
    var rst = {};
    var ticks = [];
    var maxCount = info.maxCount || MAX_COUNT;
    var categories = getSimpleArray(info.data);
    var length = categories.length;
    var tickCount = getGreatestFactor(length - 1, maxCount - 1) + 1;
    if (tickCount === 2) {
        tickCount = maxCount;
    } else if (tickCount < maxCount - SUB_COUNT) {
        tickCount = maxCount - SUB_COUNT;
    }
    var step = parseInt(`${length / (tickCount - 1)}`, 10);
    var groups = categories.map(function (e, i) {
        return i % step === 0 ? categories.slice(i, i + step) : null;
    }).filter(function (e) {
        return e;
    });
    if (categories.length) {
        ticks.push(categories[0]);
    }
    for (var i = 1; i < groups.length && i * step < length - step; i++) {
        ticks.push(groups[i][0]);
    }
    if (categories.length) {
        var last = categories[length - 1];
        if (ticks.indexOf(last) === -1) {
            ticks.push(last);
        }
    }
    rst['categories'] = categories;
    rst['ticks'] = ticks;
    return rst;
};
