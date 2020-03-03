// 'use strict';
// var __WEBPACK_IMPORTED_MODULE_0__point__ = require('./point');
// var __WEBPACK_IMPORTED_MODULE_1__polygon__ = require('./polygon');
// var __WEBPACK_IMPORTED_MODULE_2__line__ = require('./line');
// require.d(exports, 'c', function () {
//     return __WEBPACK_IMPORTED_MODULE_0__point__;
// });
// require.d(exports, 'b', function () {
//     return __WEBPACK_IMPORTED_MODULE_1__polygon__;
// });
// require.d(exports, 'a', function () {
//     return __WEBPACK_IMPORTED_MODULE_2__line__;
// });

import Line from "./Line";
import Polygon from "./Polygon";

export default {
    'line':Line,
    'point':null,
    'polygon':Polygon
}
