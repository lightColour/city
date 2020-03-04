import Layer from "./Layer";

import {BufferGeometry, Float32BufferAttribute, LineSegments, Mesh} from "three";
import LineMaterial from "../geom/material/LineMaterial";
import Index from "../geom/buffer/Index";

class LineLayer extends Layer{

    type;
    StyleData;
    _buffer;
    layerSource;
    scene;

    shape(type) {
        this.shapeType = type;
        return this;
    }
    render() {
        // 折线
        this.type = 'polyline';
        // 初始化
        this.init();
        // 数据源
        var source = this.layerSource;
        // 获取样式数据
        var StyleData = this.StyleData;
        // 获取样式选项
        var style = this.get('styleOptions');
        // 创建buffer
        console.log(Index.line)
        var buffer = this._buffer = new Index.line({
            coordinates: source.geoData,
            properties: StyleData,
            shapeType: this.shapeType,
            style: style
        });
        var _this$get = this.get('styleOptions'), opacity = _this$get.opacity;
        // 获取动画选项
        var animateOptions = this.get('animateOptions');
        // 准备生成几何体
        var geometry = new BufferGeometry();
        // 设置几何体属性
        var attributes = buffer.attributes;
        // 弧线
        if (this.shapeType === 'arc') {
            geometry.setIndex(attributes.indexArray);
            geometry.addAttribute('position', new Float32BufferAttribute(attributes.positions, 3));
            geometry.addAttribute('a_color', new Float32BufferAttribute(attributes.colors, 4));
            geometry.addAttribute('a_instance', new Float32BufferAttribute(attributes.instances, 4));
            geometry.addAttribute('a_size', new Float32BufferAttribute(attributes.sizes, 1));
            var material = LineMaterial.lineMaterial({
                u_opacity: opacity,
                u_zoom: this.scene.getZoom()
            });
            var mesh = new Mesh(geometry, material);
            this.add(mesh);
            // 线
        } else if (this.shapeType === 'line') {
            geometry.setIndex(attributes.indexArray);
            geometry.addAttribute('pickingId', new Float32BufferAttribute(attributes.pickingIds, 1));
            // 添加顶点位置
            geometry.addAttribute('position', new Float32BufferAttribute(attributes.positions, 3));
            // 添加带透明颜色
            geometry.addAttribute('a_color', new Float32BufferAttribute(attributes.colors, 4));
            // 添加大小
            geometry.addAttribute('a_size', new Float32BufferAttribute(attributes.sizes, 1));
            geometry.addAttribute('normal', new Float32BufferAttribute(attributes.normal, 3));
            geometry.addAttribute('a_miter', new Float32BufferAttribute(attributes.miter, 1));
            var lineType = style.lineType;
            var _material;
            // 不是虚线
            if (lineType !== 'dash') {
                //网格线材料
                _material = LineMaterial.lineMaterial({
                    u_opacity: opacity,
                    u_zoom: this.scene.getZoom()
                });
            } else {
                geometry.addAttribute('a_distance', new Float32BufferAttribute(attributes.attrDistance, 1));
                // 虚线材料
                _material = LineMaterial.lineMaterial({
                    u_opacity: opacity,
                    u_zoom: this.scene.getZoom()
                });
            }
            var _mesh = new Mesh(geometry, _material);
            this.add(_mesh);
        } else {
            // 如果都不是，那就用默认的
            geometry.addAttribute('position', new Float32BufferAttribute(attributes.vertices, 3));
            // 设置线的颜色
            geometry.addAttribute('a_color', new Float32BufferAttribute(attributes.colors, 4));
            // 线材料
            var _material2 = LineMaterial.lineMaterial({
                u_opacity: opacity,
                u_time: 0
            });
            // 判断动画是否启动
            if (animateOptions.enable) {
                // 设置动画启动，通过glsl 高级用法来渲染动画
                _material2.setDefinesvalue('ANIMATE', true);
            }
            // 通过线段来创建线
            var _mesh2 = new LineSegments(geometry, _material2);
            this.add(_mesh2);
        }
        return this;
    }
}
export default LineLayer
