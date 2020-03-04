import PolylineNormals from "../normal/PolylineNormals";
import { Vector3 } from "three";

export default {
    'meshLine': meshLine,
    'arc': arc,
    'defaultLine': defaultLine,
    'Line': Line
}
function isNativeReflectConstruct() {
    if (typeof Reflect === 'undefined' || !Reflect.construct)
        return false;
    if (Reflect.construct['sham'])
        return false;
    if (typeof Proxy === 'function')
        return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function () {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
// function _construct(Parent, args, Class) {
//     if (isNativeReflectConstruct()) {
//         _construct = Reflect.construct;
//     } else {
//         _construct = function _construct(Parent, args, Class) {
//             var a = [null];
//             a.push.apply(a, args);
//             var Constructor = Function.bind.apply(Parent, a);
//             var instance = new Constructor();
//             if (Class)
//                 _setPrototypeOf(instance, Class.prototype);
//             return instance;
//         };
//     }
//     return _construct.apply(null, arguments);
// }
// function _setPrototypeOf(o, p) {
//     _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
//         o.__proto__ = p;
//         return o;
//     };
//     return _setPrototypeOf(o, p);
// }
export const _toConsumableArray = (arr): Array<any> => {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr);
}
function _nonIterableSpread() {
    throw new TypeError('Invalid attempt to spread non-iterable instance');
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === '[object Arguments]')
        return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function meshLine(geo, props, index) {
    var dataLength = geo.length;
    var width = props.size[0] * 50 || 100;
    var dem = props.size[1] || 0;
    var posArray = [];
    var indexArray = [];
    var points = [];
    for (var i = 0; i < dataLength; i++) {
        var previous = i === 0 ? geo[0] : geo[i - 1];
        var next = i === dataLength - 1 ? geo[dataLength - 1] : geo[i + 1];
        var current = geo[i];
        previous = [
            previous[0],
            previous[1],
            0
        ];
        next = [
            next[0],
            next[1],
            0
        ];
        current = [
            current[0],
            current[1],
            0
        ];
        var dir = null;
        if (i === 0 || i === dataLength - 1) {
            dir = new Vector3(1, 1, 1);
        } else {
            var dir1 = new Vector3();
            var dir2 = new Vector3();
            dir = new Vector3();
            dir1.subVectors(new Vector3(current), new Vector3(previous)).normalize();
            dir2.subVectors(new Vector3(next), new Vector3(current)).normalize();
            dir.addVectors(dir1, dir2).normalize();
        }
        var normal = [
            -dir.y,
            dir.x,
            0
        ];
        normal = [
            normal[0] * width,
            normal[1] * width,
            0
        ];
        var n1 = [
            normal[0],
            normal[1],
            0
        ];
        var n2 = [
            -normal[0],
            -normal[1],
            0
        ];
        var p1 = new Vector3();
        var p2 = new Vector3();
        p1.addVectors(new Vector3(current), new Vector3(...n1));
        p2.addVectors(new Vector3(current), new Vector3(...n2));
        points.push([
            p1.x,
            p1.y,
            dem
        ], [
                p2.x,
                p2.y,
                dem
            ]);
    }
    for (var _i = 0; _i < points.length - 2; _i += 2) {
        var ct = _i;
        var cb = _i + 1;
        var nt = _i + 2;
        var nb = _i + 3;
        posArray.push(points[ct], points[cb], points[nt]);
        posArray.push(points[nt], points[cb], points[nb]);
        indexArray.push(index, index, index);
        indexArray.push(index, index, index);
    }
    return {
        positions: posArray,
        indexes: indexArray
    };
}
function arc(geo, props, positionsIndex) {
    var segNum = 50;
    var posArray = [];
    var instanceArray = [];
    var sizes = [];
    var colors = [];
    var size = props.size, color = props.color;
    var defaultInstance = [
        geo[0][0],
        geo[0][1],
        geo[1][0],
        geo[1][1]
    ];
    var indexArray = [];
    var c = 0;
    var index = positionsIndex;
    for (var i = 0; i < segNum; i++) {
        posArray.push(i, 1, i);
        posArray.push(i, -1, i);
        instanceArray.push.apply(instanceArray, defaultInstance);
        instanceArray.push.apply(instanceArray, defaultInstance);
        sizes.push(size, size);
        colors.push.apply(colors, _toConsumableArray(color));
        colors.push.apply(colors, _toConsumableArray(color));
        if (i !== segNum - 1) {
            indexArray[c++] = index + 0;
            indexArray[c++] = index + 1;
            indexArray[c++] = index + 2;
            indexArray[c++] = index + 1;
            indexArray[c++] = index + 3;
            indexArray[c++] = index + 2;
        }
        index += 2;
    }
    return {
        positions: posArray,
        indexArray: indexArray,
        instances: instanceArray,
        colors: colors,
        sizes: sizes
    };
}
function defaultLine(geo, index) {
    // 默认的线
    //下标索引
    var indexArray = [];
    // 位置
    var positions = [];
    //
    geo.slice(0, geo.length - 1).forEach(function (coor, i) {
        positions.push(coor, geo[i + 1]);
        indexArray.push(index, index);
    });
    return {
        positions: positions,
        indexes: indexArray
    };
}
function Line(path, props, positionsIndex) {
    var dash = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (path.length === 1)
        path = path[0];
    var positions = [];
    var pickingIds = [];
    var normal = [];
    var miter = [];
    var colors = [];
    var indexArray = [];
    var normals = PolylineNormals(path);
    var attrDistance = [];
    var sizes = [];
    var c = 0;
    var index = positionsIndex;
    var size = props.size, color = props.color, id = props.id;
    path.forEach(function (point, pointIndex, list) {
        var i = index;
        colors.push.apply(colors, _toConsumableArray(color));
        colors.push.apply(colors, _toConsumableArray(color));
        pickingIds.push(id);
        pickingIds.push(id);
        sizes.push(size[0]);
        sizes.push(size[0]);
        if (pointIndex !== list.length - 1) {
            indexArray[c++] = i + 0;
            indexArray[c++] = i + 3;
            indexArray[c++] = i + 1;
            indexArray[c++] = i + 0;
            indexArray[c++] = i + 2;
            indexArray[c++] = i + 3;
        }
        point[2] = size[1];
        positions.push.apply(positions, _toConsumableArray(point));
        positions.push.apply(positions, _toConsumableArray(point));
        if (dash) {
            var d = pointIndex / (list.length - 1);
            attrDistance.push(d, d);
        }
        index += 2;
    });
    normals.forEach(function (n) {
        var norm = n[0];
        var m = n[1];
        normal.push(norm[0], norm[1], 0);
        normal.push(norm[0], norm[1], 0);
        miter.push(-m);
        miter.push(m);
    });
    return {
        positions: positions,
        normal: normal,
        indexArray: indexArray,
        miter: miter,
        colors: colors,
        sizes: sizes,
        pickingIds: pickingIds,
        attrDistance: attrDistance
    };
}
