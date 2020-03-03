import * as earcut from 'earcut'
function extrudePolygon(points, extrude) {
  var p1 = points[0][0];
  var p2 = points[0][points[0].length - 1];
  var faceUv = [];
  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    points[0] = points[0].slice(0, points[0].length - 1);
  }
  var n = points[0].length;
  var flattengeo = earcut.flatten(points);
  var positions = [];
  var cells = [];
  var triangles = earcut(flattengeo.vertices, flattengeo.holes, flattengeo.dimensions);
  cells = triangles;
  var pointCount = flattengeo.vertices.length / 3;
  var vertices = flattengeo.vertices;
  extrude ? full() : flat();
  function flat() {
    for (var i = 0; i < pointCount; i++) {
      positions.push([
        vertices[i * 3],
        vertices[i * 3 + 1],
        0
      ]);
    }
  }
  function full() {
    triangles.forEach(function () {
      faceUv.push(-1, -1);
    });
    for (var i = 0; i < pointCount; i++) {
      positions.push([
        vertices[i * 3],
        vertices[i * 3 + 1],
        1
      ]);
    }
    for (var _i = 0; _i < pointCount; _i++) {
      positions.push([
        vertices[_i * 3],
        vertices[_i * 3 + 1],
        0
      ]);
    }
    for (var _i2 = 0; _i2 < n; _i2++) {
      if (_i2 === n - 1) {
        cells.push(_i2, n, _i2 + n);
        faceUv.push(1, 0, 0, 1, 1, 1);
        cells.push(_i2, 0, n);
        faceUv.push(1, 0, 0, 0, 0, 1);
      } else {
        cells.push(_i2 + n, _i2, _i2 + n + 1);
        faceUv.push(1, 1, 1, 0, 0, 1);
        cells.push(_i2, _i2 + 1, _i2 + n + 1);
        faceUv.push(1, 0, 0, 0, 0, 1);
      }
    }
  }
  return {
    positions: positions,
    faceUv: faceUv,
    positionsIndex: cells
  };
}
function extrudePolygonLine(points, extrude) {
  var p1 = points[0][0];
  var p2 = points[0][points[0].length - 1];
  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    points[0] = points[0].slice(0, points[0].length - 1);
  }
  var n = points[0].length;
  var flattengeo = earcut.flatten(points);
  var positions = [];
  var cells = [];
  var triangles = earcut()(flattengeo.vertices, flattengeo.holes, flattengeo.dimensions);
  cells = triangles.map(function (e) {
    return e;
  });
  extrude === 0 ? flat() : full();
  function flat() {
    points[0].forEach(function (p) {
      positions.push([
        p[0],
        p[1],
        0
      ]);
    });
  }
  function full() {
    points[0].forEach(function (p) {
      positions.push([
        p[0],
        p[1],
        1
      ]);
    });
    points[0].forEach(function (p) {
      positions.push([
        p[0],
        p[1],
        0
      ]);
    });
    for (var i = 0; i < n; i++) {
      if (i === n - 1) {
        cells.push(i + n, n, i);
        cells.push(0, i, n);
      } else {
        cells.push(i + n, i + n + 1, i);
        cells.push(i + 1, i, i + n + 1);
      }
    }
  }
  return {
    positions: positions,
    positionsIndex: cells
  };
}
export default extrudePolygon
