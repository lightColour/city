import BufferBase from "./BufferBase";
import ShapeIndex from "../shape";

class LineBuffer extends BufferBase{

    shapeType;
    attributes;

    geometryBuffer() {
        // 设置
        var _this = this;
        // 获取坐标
        var coordinates = this.get('coordinates');
        // 获取geo属性
        var properties = this.get('properties');
        // 获取图形类型
        var shapeType = this.shapeType = this.get('shapeType');
        // 创建顶点位置信息
        var positions = [];
        // 顶点位置索引
        var positionsIndex = [];
        // 实例
        var instances = [];
        // 线的类型，线
        if (shapeType === 'line') {
            this.attributes = this._getMeshLineAttributes();
            return;
            // 弧线
        } else if (shapeType === 'arc') {
            this.attributes = this._getArcLineAttributes();
            return;
        }
        // 遍历坐标点
        coordinates.forEach(function (geo, index) {
            var props = properties[index];
            // 获取坐标中的属性信息
            var attrData = _this._getShape(geo, props, index);
            //
            positions.push.apply(positions, attrData.positions);
            positionsIndex.push.apply(positionsIndex, attrData.indexes);
            if (attrData.hasOwnProperty('instances')) {
                instances.push.apply(instances, attrData.instances);
            }
        });
        // 属性样式结构
        this.bufferStruct.style = properties;
        // 顶点位置
        this.bufferStruct.verts = positions;
        // 位置索引
        this.bufferStruct.indexs = positionsIndex;
        if (instances.length > 0) {
            this.bufferStruct.instances = instances;
        }
        this.attributes = this._toAttributes(this.bufferStruct);
    }
    _getShape(geo, props, index) {
        // 获取形状
        if (!this.shapeType) {
            return ShapeIndex.line.defaultLine(geo, index);
        }
        var shape = this.shapeType;
        if (shape === 'meshLine') {
            return ShapeIndex[shape](geo, props, index);
        } else if (shape === 'tubeLine') {
            return ShapeIndex[shape](geo, props, index);
        } else if (shape === 'arc') {
            return ShapeIndex[shape](geo, props, index);
        }
        return ShapeIndex.Line(geo, props, index);
    }
    _getArcLineAttributes() {
        var _this2 = this;
        var coordinates = this.get('coordinates');
        var properties = this.get('properties');
        var positions = [];
        var colors = [];
        var indexArray = [];
        var sizes = [];
        var instances = [];
        coordinates.forEach(function (geo, index) {
            var props = properties[index];
            var positionCount = positions.length / 3;
            var attrData = _this2._getShape(geo, props, positionCount);
            positions.push.apply(positions,attrData.positions);
            colors.push.apply(colors, attrData.colors);
            indexArray.push.apply(indexArray, attrData.indexArray);
            instances.push.apply(instances, attrData.instances);
            sizes.push.apply(sizes, attrData.sizes);
        });
        return {
            positions: positions,
            colors: colors,
            indexArray: indexArray,
            sizes: sizes,
            instances: instances
        };
    }
    _getMeshLineAttributes() {
        var coordinates = this.get('coordinates');
        var properties = this.get('properties');
        var _this$get = this.get('style'), lineType = _this$get.lineType;
        var positions = [];
        var pickingIds = [];
        var normal = [];
        var miter = [];
        var colors = [];
        var indexArray = [];
        var sizes = [];
        var attrDistance = [];
        coordinates.forEach(function (geo, index) {
            var props = properties[index];
            var positionCount = positions.length / 3;
            var attr = ShapeIndex.Line(geo, props, positionCount, lineType !== 'soild');
            positions.push.apply(positions, attr.positions);
            normal.push.apply(normal, attr.normal);
            miter.push.apply(miter, attr.miter);
            colors.push.apply(colors, attr.colors);
            indexArray.push.apply(indexArray, attr.indexArray);
            sizes.push.apply(sizes, attr.sizes);
            attrDistance.push.apply(attrDistance, attr.attrDistance);
            pickingIds.push.apply(pickingIds, attr.pickingIds);
        });
        return {
            positions: positions,
            normal: normal,
            miter: miter,
            colors: colors,
            indexArray: indexArray,
            pickingIds: pickingIds,
            sizes: sizes,
            attrDistance: attrDistance
        };
    }
    _toAttributes(bufferStruct) {
        // 转换成符合three结构的数据
        var vertCount = bufferStruct.verts.length;
        // 顶点转换
        var vertices = new Float32Array(vertCount * 3);
        // 顶点
        var inposs = new Float32Array(vertCount * 4);
        // 颜色
        var colors = new Float32Array(vertCount * 4);
        // 设置值
        for (var i = 0; i < vertCount; i++) {

            var index = bufferStruct.indexs[i];
            var color = bufferStruct.style[index].color;
            // 设置结构点
            vertices[i * 3] = bufferStruct.verts[i][0];
            vertices[i * 3 + 1] = bufferStruct.verts[i][1];
            vertices[i * 3 + 2] = bufferStruct.verts[i][2];
            // 设置颜色点
            colors[i * 4] = color[0];
            colors[i * 4 + 1] = color[1];
            colors[i * 4 + 2] = color[2];
            colors[i * 4 + 3] = color[3];

            if (bufferStruct.instances) {
                inposs[i * 4] = bufferStruct.instances[i][0];
                inposs[i * 4 + 1] = bufferStruct.instances[i][1];
                inposs[i * 4 + 2] = bufferStruct.instances[i][2];
                inposs[i * 4 + 3] = bufferStruct.instances[i][3];
            }
        }
        return {
            vertices: vertices,
            colors: colors,
            inposs: inposs
        };
    }
}
export default LineBuffer
