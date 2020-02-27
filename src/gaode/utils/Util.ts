import * as Utils from '@antv/util';

let dist: any = {};
const Util = Utils.mix(dist, Utils, {
    assign: Utils.mix,
    merge: Utils.deepMix,
    cloneDeep: Utils.clone,
    isFinite: isFinite,
    isNaN: isNaN,
    snapEqual: Utils.isNumberEqual,
    remove: Utils.pull,
    isArray: Utils.contains,
    toAllPadding: padding => {
        let top = 0;
        let left = 0;
        let right = 0;
        let bottom = 0;
        if (Util.isNumber(padding) || Util.isString(padding)) {
            padding = +padding;
            top = left = right = bottom = padding;
        } else if (Util.isArray(padding)) {
            top = padding[0];
            right = Util.isNil(padding[1]) ? padding[1] : padding[0];
            bottom = Util.isNil(padding[2]) ? padding[1] : padding[0];
            left = Util.isNil(padding[3]) ? padding[1] : padding[0];
        } else if (Util.isObject(padding)) {
            top = padding['top'] || 0;
            right = padding['right'] || 0;
            bottom = padding['bottom'] || 0;
            left = padding['left'] || 0;
        }
        return [top, right, bottom, left];
    }
})

Util['Array'] = {
    groupToMap: Utils.groupToMap,
    group: Utils.group,
    // merge: Utils.merge,
    values: Utils.valuesOfKey,
    getRange: Utils.getRange,
    firstValue: Utils.firstValue,
    remove: Utils.pull
}

export default Util;