var DECIMAL_LENGTH = 12;
function getFactor(v) {
    var factor = 1;
    if (v === Infinity || v === -Infinity) {
        throw new Error('Not support Infinity!');
    }
    if (v < 1) {
        var count = 0;
        while (v < 1) {
            factor = factor / 10;
            v = v * 10;
            count++;
        }
        if (factor.toString().length > DECIMAL_LENGTH) {
            factor = parseFloat(factor.toFixed(count));
        }
    } else {
        while (v > 10) {
            factor = factor * 10;
            v = v / 10;
        }
    }
    return factor;
}
function arrayFloor(values, value) {
    var length = values.length;
    if (length === 0) {
        return NaN;
    }
    var pre = values[0];
    if (value < values[0]) {
        return NaN;
    }
    if (value >= values[length - 1]) {
        return values[length - 1];
    }
    for (var i = 1; i < values.length; i++) {
        if (value < values[i]) {
            break;
        }
        pre = values[i];
    }
    return pre;
}
function arrayCeiling(values, value) {
    var length = values.length;
    if (length === 0) {
        return NaN;
    }
    var rst;
    if (value > values[length - 1]) {
        return NaN;
    }
    if (value < values[0]) {
        return values[0];
    }
    for (var i = 1; i < values.length; i++) {
        if (value <= values[i]) {
            rst = values[i];
            break;
        }
    }
    return rst;
}
var Util = {
    snapFactorTo: function snapFactorTo(v, arr, snapType) {
        if (isNaN(v)) {
            return NaN;
        }
        var factor = 1;
        if (v !== 0) {
            if (v < 0) {
                factor = -1;
            }
            v = v * factor;
            var tmpFactor = getFactor(v);
            factor = factor * tmpFactor;
            v = v / tmpFactor;
        }
        if (snapType === 'floor') {
            v = Util.snapFloor(arr, v);
        } else if (snapType === 'ceil') {
            v = Util.snapCeiling(arr, v);
        } else {
            v = Util.snapTo(arr, v);
        }
        var rst = v * factor;
        if (Math.abs(factor) < 1 && rst.toString().length > DECIMAL_LENGTH) {
            var decimalVal = parseInt(`${1 / factor}`);
            var symbol = factor > 0 ? 1 : -1;
            rst = v / decimalVal * symbol;
        }
        return rst;
    },
    snapMultiple: function snapMultiple(v, base, snapType) {
        var div;
        if (snapType === 'ceil') {
            div = Math.ceil(v / base);
        } else if (snapType === 'floor') {
            div = Math.floor(v / base);
        } else {
            div = Math.round(v / base);
        }
        return div * base;
    },
    snapTo: function snapTo(values, value) {
        var floorVal = arrayFloor(values, value);
        var ceilingVal = arrayCeiling(values, value);
        if (isNaN(floorVal) || isNaN(ceilingVal)) {
            if (values[0] >= value) {
                return values[0];
            }
            var last = values[values.length - 1];
            if (last <= value) {
                return last;
            }
        }
        if (Math.abs(value - floorVal) < Math.abs(ceilingVal - value)) {
            return floorVal;
        }
        return ceilingVal;
    },
    snapFloor: function snapFloor(values, value) {
        return arrayFloor(values, value);
    },
    snapCeiling: function snapCeiling(values, value) {
        return arrayCeiling(values, value);
    }
};

export default Util
