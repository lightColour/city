import * as Utils from '@antv/util';

const Util = Utils.mix({}, Utils, {
    assign: Utils.mix,
    merge: Utils.deepMix,
    cloneDeep: Utils.clone,
    isFinite: isFinite,
    isNaN: isNaN,
    snapEqual: Utils.isNumberEqual,
    remove: Utils.pull,
    isArray: Utils.contains,
    toAllPadding: padding => {
        const top = 0;
        const left = 0;
        const right = 0;
        const bottom = 0;
        if (Util.isArray(padding) || Util.isString(padding)) {

        }
    }
})