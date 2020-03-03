import Base from "../../Base";
import Extrude from "./Extrude";
import { Texture, Vector3 } from "three";
import Normals from "../normal/Normals";

class BufferBase extends Base {

    bufferStruct;

    constructor(cfg) {
        super(cfg)
        this.bufferStruct = {};
        this.geometryBuffer();
        return this;
    }
    geometryBuffer() {
    }
    _normals() {
        var _this$bufferStruct = this.bufferStruct, position = _this$bufferStruct.position, indices = _this$bufferStruct.indices, _this$bufferStruct$no = _this$bufferStruct.normals, normals = _this$bufferStruct$no === void 0 ? [] : _this$bufferStruct$no;
        indices.forEach(function (index, i) {
            normals.push(Normals(index, position[i]));
        });
        this.bufferStruct.normals = normals;
    }
    _extrude(coordinate, heightValue) {
        var extrudeData = Extrude(coordinate, heightValue);
        return extrudeData;
    }
    _mergeAttributes(attributes) {
        var lengths = {};
        attributes.forEach(function (_attributes) {
            for (var k in _attributes) {
                if (!lengths[k]) {
                    lengths[k] = 0;
                }
                lengths[k] += _attributes[k].length;
            }
        });
        var mergedAttributes = {};
        for (var k in lengths) {
            mergedAttributes[k] = new Float32Array(lengths[k]);
        }
        var lastLengths = {};
        attributes.forEach(function (_attributes) {
            for (var _k in _attributes) {
                if (!lastLengths[_k]) {
                    lastLengths[_k] = 0;
                }
                mergedAttributes[_k].set(_attributes[_k], lastLengths[_k]);
                lastLengths[_k] += _attributes[_k].length;
            }
        });
        return mergedAttributes;
    }
    _toPolygonAttributes(polygon) {
        var style = polygon.style, indices = polygon.indices, position = polygon.position, indexCount = polygon.indexCount;
        var vertices = new Float32Array(indexCount * 3);
        var normals = new Float32Array(indexCount * 3);
        var colors = new Float32Array(indexCount * 4);
        var pickingIds = new Float32Array(indexCount);
        var pA = new Vector3();
        var pB = new Vector3();
        var pC = new Vector3();
        var cb = new Vector3();
        var ab = new Vector3();
        var lastIndex = 0;
        indices.forEach(function (indice, pIndex) {
            for (var i = 0; i < indice.length / 3; i++) {
                var index = indice[i * 3];
                var color = style[pIndex].color;
                var _pickingId = style[pIndex].id;
                var ax = position[pIndex][index][0];
                var ay = position[pIndex][index][1];
                var az = position[pIndex][index][2];
                index = indice[i * 3 + 1];
                var bx = position[pIndex][index][0];
                var by = position[pIndex][index][1];
                var bz = position[pIndex][index][2];
                index = indice[i * 3 + 2];
                var cx = position[pIndex][index][0];
                var cy = position[pIndex][index][1];
                var cz = position[pIndex][index][2];
                pA.set(ax, ay, az);
                pB.set(bx, by, bz);
                pC.set(cx, cy, cz);
                cb.subVectors(pC, pB);
                ab.subVectors(pA, pB);
                cb.cross(ab);
                cb.normalize();
                var nx = cb.x;
                var ny = cb.y;
                var nz = cb.z;
                vertices[lastIndex * 9 + 0] = ax;
                vertices[lastIndex * 9 + 1] = ay;
                vertices[lastIndex * 9 + 2] = az;
                normals[lastIndex * 9 + 0] = nx;
                normals[lastIndex * 9 + 1] = ny;
                normals[lastIndex * 9 + 2] = nz;
                colors[lastIndex * 12 + 0] = color[0];
                colors[lastIndex * 12 + 1] = color[1];
                colors[lastIndex * 12 + 2] = color[2];
                colors[lastIndex * 12 + 3] = color[3];
                vertices[lastIndex * 9 + 3] = bx;
                vertices[lastIndex * 9 + 4] = by;
                vertices[lastIndex * 9 + 5] = bz;
                normals[lastIndex * 9 + 3] = nx;
                normals[lastIndex * 9 + 4] = ny;
                normals[lastIndex * 9 + 5] = nz;
                colors[lastIndex * 12 + 4] = color[0];
                colors[lastIndex * 12 + 5] = color[1];
                colors[lastIndex * 12 + 6] = color[2];
                colors[lastIndex * 12 + 7] = color[3];
                vertices[lastIndex * 9 + 6] = cx;
                vertices[lastIndex * 9 + 7] = cy;
                vertices[lastIndex * 9 + 8] = cz;
                normals[lastIndex * 9 + 6] = nx;
                normals[lastIndex * 9 + 7] = ny;
                normals[lastIndex * 9 + 8] = nz;
                colors[lastIndex * 12 + 8] = color[0];
                colors[lastIndex * 12 + 9] = color[1];
                colors[lastIndex * 12 + 10] = color[2];
                colors[lastIndex * 12 + 11] = color[3];
                pickingIds[lastIndex * 3 + 0] = _pickingId;
                pickingIds[lastIndex * 3 + 1] = _pickingId;
                pickingIds[lastIndex * 3 + 2] = _pickingId;
                lastIndex++;
            }
        });
        var attributes = {
            vertices: vertices,
            normals: normals,
            colors: colors,
            pickingIds: pickingIds,
            faceUv: new Float32Array(polygon.faceUv),
            sizes: new Float32Array(polygon.sizes)
        };
        return attributes;
    }
    _toPointShapeAttributes(polygon) {
        var style = polygon.style, indices = polygon.indices, position = polygon.position, indexCount = polygon.indexCount, shapes = polygon.shapes, sizes = polygon.sizes;
        var vertices = new Float32Array(indexCount * 3);
        var shapePositions = new Float32Array(indexCount * 3);
        var a_size = new Float32Array(indexCount * 3);
        var normals = new Float32Array(indexCount * 3);
        var colors = new Float32Array(indexCount * 4);
        var pickingIds = new Float32Array(indexCount);
        var pA = new Vector3();
        var pB = new Vector3();
        var pC = new Vector3();
        var cb = new Vector3();
        var ab = new Vector3();
        var lastIndex = 0;
        indices.forEach(function (indice, pIndex) {
            for (var i = 0; i < indice.length / 3; i++) {
                var index = indice[i * 3];
                var color = style[pIndex].color;
                var coor1 = position[pIndex];
                var size = sizes[pIndex];
                var _pickingId = style[pIndex].id;
                var ax = shapes[pIndex][index][0];
                var ay = shapes[pIndex][index][1];
                var az = shapes[pIndex][index][2];
                index = indice[i * 3 + 1];
                var bx = shapes[pIndex][index][0];
                var by = shapes[pIndex][index][1];
                var bz = shapes[pIndex][index][2];
                index = indice[i * 3 + 2];
                var cx = shapes[pIndex][index][0];
                var cy = shapes[pIndex][index][1];
                var cz = shapes[pIndex][index][2];
                pA.set(ax, ay, az);
                pB.set(bx, by, bz);
                pC.set(cx, cy, cz);
                cb.subVectors(pC, pB);
                ab.subVectors(pA, pB);
                cb.cross(ab);
                cb.normalize();
                var nx = cb.x;
                var ny = cb.y;
                var nz = cb.z;
                vertices[lastIndex * 9 + 0] = coor1[0];
                vertices[lastIndex * 9 + 1] = coor1[1];
                vertices[lastIndex * 9 + 2] = coor1[2];
                shapePositions[lastIndex * 9 + 0] = ax;
                shapePositions[lastIndex * 9 + 1] = ay;
                shapePositions[lastIndex * 9 + 2] = az;
                a_size[lastIndex * 9 + 0] = size[0];
                a_size[lastIndex * 9 + 1] = size[1];
                a_size[lastIndex * 9 + 2] = size[2];
                normals[lastIndex * 9 + 0] = nx;
                normals[lastIndex * 9 + 1] = ny;
                normals[lastIndex * 9 + 2] = nz;
                colors[lastIndex * 12 + 0] = color[0];
                colors[lastIndex * 12 + 1] = color[1];
                colors[lastIndex * 12 + 2] = color[2];
                colors[lastIndex * 12 + 3] = color[3];
                vertices[lastIndex * 9 + 3] = coor1[0];
                vertices[lastIndex * 9 + 4] = coor1[1];
                vertices[lastIndex * 9 + 5] = coor1[2];
                shapePositions[lastIndex * 9 + 3] = bx;
                shapePositions[lastIndex * 9 + 4] = by;
                shapePositions[lastIndex * 9 + 5] = bz;
                a_size[lastIndex * 9 + 3] = size[0];
                a_size[lastIndex * 9 + 4] = size[1];
                a_size[lastIndex * 9 + 5] = size[2];
                normals[lastIndex * 9 + 3] = nx;
                normals[lastIndex * 9 + 4] = ny;
                normals[lastIndex * 9 + 5] = nz;
                colors[lastIndex * 12 + 4] = color[0];
                colors[lastIndex * 12 + 5] = color[1];
                colors[lastIndex * 12 + 6] = color[2];
                colors[lastIndex * 12 + 7] = color[3];
                vertices[lastIndex * 9 + 6] = coor1[0];
                vertices[lastIndex * 9 + 7] = coor1[1];
                vertices[lastIndex * 9 + 8] = coor1[2];
                a_size[lastIndex * 9 + 6] = size[0];
                a_size[lastIndex * 9 + 7] = size[1];
                a_size[lastIndex * 9 + 8] = size[2];
                shapePositions[lastIndex * 9 + 6] = cx;
                shapePositions[lastIndex * 9 + 7] = cy;
                shapePositions[lastIndex * 9 + 8] = cz;
                normals[lastIndex * 9 + 6] = nx;
                normals[lastIndex * 9 + 7] = ny;
                normals[lastIndex * 9 + 8] = nz;
                colors[lastIndex * 12 + 8] = color[0];
                colors[lastIndex * 12 + 9] = color[1];
                colors[lastIndex * 12 + 10] = color[2];
                colors[lastIndex * 12 + 11] = color[3];
                pickingIds[lastIndex * 3 + 0] = _pickingId;
                pickingIds[lastIndex * 3 + 1] = _pickingId;
                pickingIds[lastIndex * 3 + 2] = _pickingId;
                lastIndex++;
            }
        });
        var attributes = {
            vertices: vertices,
            normals: normals,
            colors: colors,
            pickingIds: pickingIds,
            shapePositions: shapePositions,
            a_size: a_size,
            faceUv: new Float32Array(polygon.faceUv)
        };
        return attributes;
    }

    _toPolygonLineAttributes(polygonline) {
        var style = polygonline.style, indices = polygonline.indices, position = polygonline.position, indexCount = polygonline.indexCount;
        var vertices = new Float32Array(indexCount * 3);
        var colors = new Float32Array(indexCount * 4);
        var pickingIds = new Float32Array(indexCount);
        var lastIndex = 0;
        indices.forEach(function (indice, pIndex) {
            for (var i = 0; i < indice.length; i++) {
                var index = indice[i];
                var color = style[pIndex].color;
                var _pickingId = style[pIndex].id;
                vertices[lastIndex * 3] = position[pIndex][index][0];
                vertices[lastIndex * 3 + 1] = position[pIndex][index][1];
                vertices[lastIndex * 3 + 2] = position[pIndex][index][2];
                colors[lastIndex * 4] = color[0];
                colors[lastIndex * 4 + 1] = color[1];
                colors[lastIndex * 4 + 2] = color[2];
                colors[lastIndex * 4 + 3] = color[3];
                pickingIds[lastIndex] = _pickingId;
                lastIndex++;
            }
        });
        var attributes = {
            vertices: vertices,
            colors: colors,
            pickingIds: pickingIds
        };
        return attributes;
    }

    _toPointsAttributes(point) {
        var style = point.style, position = point.position;
        var count = position.length;
        var vertices = new Float32Array(count * 3);
        var colors = new Float32Array(count * 4);
        var sizes = new Float32Array(count);
        var shapes = new Float32Array(count);
        var pickingIds = new Float32Array(count);
        position.forEach(function (pos, index) {
            vertices[index * 3] = pos[0];
            vertices[index * 3 + 1] = pos[1];
            vertices[index * 3 + 2] = pos[2];
            colors[index * 4] = style[index].color[0];
            colors[index * 4 + 1] = style[index].color[1];
            colors[index * 4 + 2] = style[index].color[2];
            colors[index * 4 + 3] = style[index].color[3];
            pickingIds[index] = style[index].id;
            sizes[index] = style[index].size * window.devicePixelRatio;
            if (style[index].shape) {
                shapes[index] = style[index].shape;
            }
        });
        var attributes = {
            vertices: vertices,
            colors: colors,
            sizes: sizes,
            shapes: shapes,
            pickingIds: pickingIds
        };
        return attributes;
    }

    _generateTexture() {
        var canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 64;
        var context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, 32, 64);
        for (var y = 8; y < 64; y += 8) {
            for (var x = 0; x < 32; x += 2) {
                var value = Math.floor(Math.random() * 64);
                context.fillStyle = 'rgb(' + [
                    value,
                    value,
                    value
                ].join(',') + ')';
                context.fillRect(x, y, 2, 4);
            }
        }
        context.fillStyle = '#105CB3';
        context.fillRect(0, 60, 32, 64);
        var canvas2 = document.createElement('canvas');
        canvas2.width = 512;
        canvas2.height = 1024;
        var context2 = canvas2.getContext('2d');
        context2.imageSmoothingEnabled = false;
        context2.webkitImageSmoothingEnabled = false;
        context2.mozImageSmoothingEnabled = false;
        context2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
        var texture = new Texture(canvas2);
        texture.needsUpdate = true;
        return texture;
    }

}

export default BufferBase
