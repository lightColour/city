'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports['circle'] = circle;
exports['triangle'] = triangle;
exports['diamond'] = diamond;
exports['square'] = square;
exports['hexagon'] = hexagon;
var __WEBPACK_IMPORTED_MODULE_0__polygon__ = require('./Polygon');
function circle(type) {
  var points = polygonPoint(30);
  return __WEBPACK_IMPORTED_MODULE_0__polygon__[type]([points]);
}
function triangle(type) {
  var points = polygonPoint(3);
  return __WEBPACK_IMPORTED_MODULE_0__polygon__[type]([points]);
}
function diamond(type) {
  var points = polygonPoint(4);
  return __WEBPACK_IMPORTED_MODULE_0__polygon__[type]([points]);
}
function square(type) {
  return diamond(type);
}
function hexagon(type) {
  var points = polygonPoint(6);
  return __WEBPACK_IMPORTED_MODULE_0__polygon__[type]([points]);
}
function polygonPoint(pointCount) {
  var step = Math.PI * 2 / pointCount;
  var line = [];
  for (var i = 0; i < pointCount; i++) {
    line.push(step * i);
  }
  var points = line.map(function (t) {
    var x = Math.sin(t + Math.PI / 4), y = Math.cos(t + Math.PI / 4);
    return [
      x,
      y,
      0
    ];
  });
  return points;
}
