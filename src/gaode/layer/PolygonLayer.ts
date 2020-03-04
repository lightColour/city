import Layer from "./Layer";
import PolygonBuffer from "../geom/buffer/PolygonBuffer";
import PolygonMaterial from "../geom/material/PolygonMaterial";
import {BufferGeometry, Float32BufferAttribute, LineSegments, Mesh} from "three";
import LineMaterial from "../geom/material/LineMaterial";

class PolygonLayer extends Layer{
    _buffer;
    geometry;
    _hasRender;
    _needUpdateFilter;
    _needUpdateColor;
    layerMesh;
    type;
    layerSource;
    StyleData;

    shape(type) {
        // 指定形状
        this.shape = type;
        return this;
    }
    render() {
        if (!this._hasRender) {
            this._hasRender = true;
            this._prepareRender();
        } else {
            this.initAttrs();
            if (this._needUpdateFilter || this._needUpdateColor) this.updateFilter();
            var _this$get = this.get('styleOptions'), opacity = _this$get.opacity, baseColor = _this$get.baseColor, brightColor = _this$get.brightColor, windowColor = _this$get.windowColor;
            this.layerMesh.material.upDateUninform({
                u_opacity: opacity,
                u_baseColor: baseColor,
                u_brightColor: brightColor,
                u_windowColor: windowColor
            });
        }
        return this;
    }
    _prepareRender() {
        this.init();
        this.type = 'polygon';
        var source = this.layerSource;
        this._buffer = new PolygonBuffer({
            shape: this.shape,
            coordinates: source.geoData,
            properties: this.StyleData
        });
        var attributes = this._buffer.attributes;
        this.geometry = new BufferGeometry();
        this.geometry.addAttribute('position', new Float32BufferAttribute(attributes.vertices, 3));
        this.geometry.addAttribute('a_color', new Float32BufferAttribute(attributes.colors, 4));
        this.geometry.addAttribute('pickingId', new Float32BufferAttribute(attributes.pickingIds, 1));
        // this.shape === 'line'
        if (this.shape) {
            this._renderLine();
        } else {
            this._renderPolygon();
        }
    }

    _renderLine() {
        var _this$get2 = this.get('styleOptions'), opacity = _this$get2.opacity;
        var lineMaterial = LineMaterial.lineMaterial({ u_opacity: opacity });
        var polygonLine = new LineSegments(this.geometry, lineMaterial);
        this.add(polygonLine);
    }

    _renderPolygon() {
        var animateOptions = this.get('animateOptions');
        var _this$get3 = this.get('styleOptions'), opacity = _this$get3.opacity, baseColor = _this$get3.baseColor, brightColor = _this$get3.brightColor, windowColor = _this$get3.windowColor;
        var camera = this.map.getCameraState();
        var material = PolygonMaterial({
            u_opacity: opacity,
            u_baseColor: baseColor,
            u_brightColor: brightColor,
            u_windowColor: windowColor,
            u_near: camera.near,
            u_far: camera.far
        });
        var attributes = this._buffer.attributes;
        this.geometry.addAttribute('normal', new Float32BufferAttribute(attributes.normals, 3));
        if (animateOptions.enable) {
            material.setDefinesvalue('ANIMATE', true);
            this.geometry.addAttribute('faceUv', new Float32BufferAttribute(attributes.faceUv, 2));
            this.geometry.addAttribute('a_size', new Float32BufferAttribute(attributes.sizes, 1));
        }
        var polygonMesh = new Mesh(this.geometry, material);
        this.add(polygonMesh);
    }

    update() {
        this.updateFilter();
    }
}

export default PolygonLayer
