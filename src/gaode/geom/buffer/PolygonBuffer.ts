import BufferBase from "./BufferBase";
import ShapeIndex from "../shape/Index";

class PolygonBuffer extends BufferBase {

    attributes;
    faceTexture;

    geometryBuffer() {
        var coordinates = this.get('coordinates');
        var properties = this.get('properties');
        console.log('properties: ')
        console.log(properties)
        var shape = this.get('shape');
        var positions = [];
        var faceUv = [];
        var sizes = [];
        var positionsIndex = [];
        var indexCount = 0;
        this.bufferStruct.style = properties;
        var isExtrude = properties[0].hasOwnProperty('size');
        coordinates.forEach(function (geo, index) {
            var heightValue = properties[index].size;
            var extrudeData = ShapeIndex.polygon[shape](geo);
            if (isExtrude && shape === 'extrude') {
                extrudeData = ShapeIndex.polygon.extrude(geo);
                extrudeData.positions = extrudeData.positions.map(function (pos) {
                    pos[2] *= heightValue;
                    return pos;
                });
            }
            positions.push(extrudeData.positions);
            if (shape !== 'line') {
                var count = extrudeData.faceUv.length / 2;
                for (var i = 0; i < count; i++) {
                    var x = extrudeData.faceUv[i * 2];
                    var y = extrudeData.faceUv[i * 2 + 1];
                    if (x !== -1) {
                        x = x * 0.1;
                        y = y * heightValue / 2000;
                    }
                    faceUv.push(x, y);
                    sizes.push((1 - extrudeData.faceUv[i * 2 + 1]) * heightValue);
                }
            }
            indexCount += extrudeData.positionsIndex.length;
            positionsIndex.push(extrudeData.positionsIndex);
        });
        this.bufferStruct.indices = positionsIndex;
        this.bufferStruct.position = positions;
        this.bufferStruct.indexCount = indexCount;
        this.bufferStruct.style = properties;
        this.bufferStruct.faceUv = faceUv;
        this.bufferStruct.sizes = sizes;
        console.log('bufferStruct: ')
        console.log(this.bufferStruct)
        if (shape !== 'line') {
            this.attributes = this._toPolygonAttributes(this.bufferStruct);
            this.faceTexture = this._generateTexture();
        } else {
            this.attributes = this._toPolygonLineAttributes(this.bufferStruct);
        }
    }
}

export default PolygonBuffer
