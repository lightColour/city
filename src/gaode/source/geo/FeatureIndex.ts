import { bbox } from "@turf/turf";

import * as rbush from 'rbush';

export default class FeatureIndex {

    tree: any = null;
    rawData: any = null;

    constructor(data) {
        var _this = this;
        this.tree = rbush();
        this.rawData = data;
        data.features.forEach(function (feature) {
            _this.insert(feature);
        });
    }

    insert(feature) {
        var bbox = this.toBBox(feature);
        bbox['feature'] = feature;
        this.tree.insert(bbox);
    }

    search(feature) {
        return this.tree.search(this.toBBox(feature));
    }

    clear() {
        this.tree.clear();
    }

    all() {
        return this.tree.all();
    }

    toBBox(feature) {
        var bbox = feature.type === 'Point' ? this.pointBBox(feature) : bbox(feature);
        return {
            minX: bbox[0],
            minY: bbox[1],
            maxX: bbox[2],
            maxY: bbox[3]
        };
    }

    pointBBox(feature) {
        var size = 1 / 1000 / 1000;
        var _feature$geometry$coo = _slicedToArray(feature.geometry.coordinates, 2), x = _feature$geometry$coo[0], y = _feature$geometry$coo[1];
        return [
            x - size,
            y - size,
            x + size,
            y + size
        ];
    }
}

function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
    throw new TypeError('Invalid attempt to destructure non-iterable instance');
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i)
                break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally {
        try {
            if (!_n && _i['return'] != null)
                _i['return']();
        } finally {
            if (_d)
                throw _e;
        }
    }
    return _arr;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
        return arr;
}
