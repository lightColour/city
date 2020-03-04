import * as THREE from 'three';
import Base from "../Base";
import Global from '../Global';
import Util from '../utils/Util';
import colorUtil from '../utils/ColorUtil';
import SourceIndex from '../source/Index';
import { _toConsumableArray } from '../geom/shape/Line';
import PickingMaterial from '../geom/material/PickingMaterial';

let id = 1;

function parseFields(field) {
    if (Util.isArray(field)) {
        return field;
    }
    if (Util.isString(field)) {
        return field.split('*');
    }
    return [field];
}

export default class Layer extends Base {

    scene;
    map: any = null;
    object3D: THREE.Object3D = null;
    pickObject3D: THREE.Object3D = null;
    layerId: number = null;
    activeIds;
    layerMesh;

    needUpdateColor: boolean = false;
    needUpdateFilter: boolean = false;
    zoomScale: boolean = false;
    shapeType: string = null;
    StyleData;

    layerSource;
    zoomSizeCache;
    pickingMesh;
    type;
    pickingId;

    constructor(scene, cfg) {
        super(cfg);
        this.scene = scene;
        this.map = scene.map;
        this.object3D = new THREE.Object3D();
        this.pickObject3D = new THREE.Object3D();
        this.object3D.visible = this.get('visible');
        this.object3D.renderOrder = this.get('zIndex') || 0;
        const layerId = this.getUniqueId();
        this.layerId = layerId;
        this.activeIds = null;
        scene.engine.scene.add(this.object3D);
        this.layerMesh = null;
        return this;
    }

    getDefaultCfg() {
        return {
            visible: true,
            zIndex: 0,
            type: '',
            minZoom: 0,
            maxZoom: 22,
            rotation: 0,
            attrOptions: {},
            scales: {},
            attrs: {},
            styleOptions: {
                stroke: [1, 1, 1, 1],
                strokeWidth: 1,
                opacity: 1,
                texture: false
            },
            selectedOpetions: null,
            activedOptions: null,
            animateOptions: {
                enable: false
            }
        }
    }

    add(object) {
        this.layerMesh = object;
        this.visibleWithZoom();
        this.scene.on('zoomchange', () => {
            this.visibleWithZoom();
        });
        this.layerMesh.onBeforeRender = () => {
            var zoom = this.scene.getZoom();
            this.layerMesh.material.setUniformsValue('u_time', this.scene.engine.clock.getElapsedTime());
            this.layerMesh.material.setUniformsValue('u_zoom', zoom);
        };
        if (this.needUpdateFilter) {
            this.updateFilter();
        }
        this.object3D.add(object);
        this.addPickMesh(object);
    }

    remove(object) {
        this.object3D.remove(object);
    }

    getUniqueId(): number {
        return id++;
    }

    visible(visible) {
        this.set('visible', visible);
        this.object3D.visible = this.get('visible');
    }

    source(data) {
        const cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        const dataType = this.getDataType(data);
        const cfgType = cfg.type;
        // geojson
        const type = cfgType === void 0 ? dataType : cfgType;
        cfg.data = data;
        cfg.mapType = this.get('mapType');
        this.layerSource = new SourceIndex[type](cfg);
        console.log(this.layerSource)
        return this;
    }

    color(field, values) {
        // 设置颜色
        this.needUpdateColor = true;
        // 创建颜色可选项属性
        this.createAttrOption('color', field, values, Global.colors);
        return this;
    }

    size(field, values) {
        const fields = parseFields(field);
        if (fields.indexOf('zoom') !== -1) {
            this.zoomScale = true;
        }
        if (Util.isArray(fields) && !values) {
            values = fields;
        }
        this.createAttrOption('size', field, values, Global.size);
        return this;
    }

    shape(field, values) {
        if (field.split(':').length === 2) {
            this.shapeType = field.split(':')[0];
            field = field.split(':')[1];
        }
        if (values === 'text') this.shapeType = values;
        this.createAttrOption('shape', field, values, Global.size);
        return this;
    }

    active(enable, cfg) {
        if (enable === false) {
            this.set('allowActive', false);
        } else if (Util.isObject(enable)) {
            this.set('allowActive', true);
            this.set('activedOptions', enable);
        } else {
            this.set('allowActive', true);
            this.set('activedOptions', cfg || { fill: Global.activeColor });
        }
        return this;
    }

    style(field, cfg) {
        const colorItem = ['fill', 'stroke', 'color', 'baseColor', 'brightColor', 'windowColor'];
        let styleOptions = this.get('styleOptions');
        if (!styleOptions) {
            styleOptions = {};
            this.set('styleOptions', styleOptions);
        }
        if (Util.isObject(field)) {
            cfg = field;
            field = null;
        }
        let fields = null;
        if (field) {
            fields = parseFields(field);
        }
        styleOptions.fields = fields;
        Util.assign(styleOptions, cfg);
        console.log(styleOptions)
        for (let item in cfg) {
            if (colorItem.indexOf(item) !== -1) {
                console.log(item)
                console.log(styleOptions[item])
                styleOptions[item] = colorUtil.color2RGBA(styleOptions[item]);
            }
            styleOptions[item] = styleOptions[item];
        }
        this.set('styleOptions', styleOptions);
        return this;
    }

    filter(field, values) {
        this.needUpdateFilter = true;
        this.createAttrOption('filter', field, values, true);
        return this;
    }

    animate(field, cfg) {
        let animateOptions = this.get('animateOptions');
        if (!animateOptions) {
            animateOptions = {};
            this.set('animateOptions', animateOptions);
        }
        if (Util.isObject(field)) {
            cfg = field;
            field = null;
        }
        let fields = null;
        if (field) {
            fields = parseFields(field);
        }
        animateOptions.fields = fields;
        Util.assign(animateOptions, cfg);
        this.set('animateOptions', animateOptions);
        return this;
    }
    
    hide() {
        this.visible(false);
        return this;
    }

    show() {
        this.visible(true);
        return this;
    }

    createScale(field) {
        const scales = this.get('scales');
        const scale = scales[field];
    }

    createAttrOption(attrName, field, cfg, defaultValues) {
        // 创建可选项属性
        const attrCfg: any = {};
        attrCfg.field = field;
        if (cfg) {
            if (Util.isFunction(cfg)) {
                attrCfg.callback = cfg;
            } else {
                attrCfg.values = cfg;
            }
        } else if (attrName !== 'color') {
            attrCfg.values = defaultValues;
        }
        this.setAttrOptions(attrName, attrCfg);
    }

    setAttrOptions(attrName, attrCfg) {
        // 获取属性
        const options = this.get('attrOptions');
        if (attrName === 'size' && this.zoomScale) {
            attrCfg.zoom = this.map.getZoom();
        }
        // 给属性赋值，例如颜色，等等
        options[attrName] = attrCfg;
    }

    init() {
        // 初始化属性
        this.initAttrs();
        // scale 缩放
        this.scaleByZoom();
        this.mapping();
        const activeHander = this.addActiveFeature(this);
        if (this.get('allowActive')) {
            this.scene.on('pick', activeHander);
        } else {
            this.scene.off('pick', activeHander);
        }
    }

    addActiveFeature(e) {
        const featureId = e.featureId;
        const activeStyle = this.get('activedOptions');
        const selectFeatureIds = this.layerSource;
        if (this.StyleData[selectFeatureIds[0]].hasOwnProperty('filter') && this.StyleData[selectFeatureIds[0]].filter === false) {
            return;
        }
        const style = Util.assign({}, this.StyleData[featureId]);
        style.color = colorUtil.toRGB(activeStyle.fill).map(e => e / 255);
        this.updateStyle([featureId], style);
    }

    initAttrs() {
        // 获取属性选项
        const attrOptions = this.get('attrOptions');
        // 遍历属性选项
        for (let type in attrOptions) {
            // 如果属性选项有该属性，则更新属性
            if (attrOptions.hasOwnProperty(type)) {
                this.updateAttr(type);
            }
        }
    }

    updateAttr(type) {
        const attrs = this.get('attrs');
        const attrOptions = this.get('attrOptions');
        // 获取更新的选项值
        const option = attrOptions[type];
        // 设置该选项可更新
        option.needUpdate = true;

        const className = Util.upperFirst(type);
        const fields = parseFields(option.field);
        // 设置缩放比
        const scales = [];
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const scale = this.createScale(field);
            if (type === 'color' && Util.isNil(option.values)) {
                option.values = Global.colors;
            }
            scales.push(scale);
        }
        option.scale = scales;
        // const attr = new AttrIndex()

    }

    updateSize(zoom) {
        var _this3 = this;
        var sizeOption = this.get('attrOptions').size;
        var fields = parseFields(sizeOption.field);
        var data = this.layerSource.propertiesData;
        if (!this.zoomSizeCache)
            this.zoomSizeCache = {};
        if (!this.zoomSizeCache[zoom]) {
            this.zoomSizeCache[zoom] = [];
            var _loop = function _loop(i) {
                var params = fields.map(function (field) {
                    return data[i][field];
                });
                var indexZoom = fields.indexOf('zoom');
                if (indexZoom !== -1) params[indexZoom] = zoom;
                _this3.zoomSizeCache[zoom].push(sizeOption.callback.apply(sizeOption, _toConsumableArray(params)));
            };
            for (var i = 0; i < data.length; i++) {
                _loop(i);
            }
        }
        this.emit('sizeUpdated', this.zoomSizeCache[zoom]);
    }

    mapping() {
        var self = this;
        // 获取属性
        var attrs = self.get('attrs');
        // 地图数据
        var mappedData = [];
        // 属性数据
        var data = this.layerSource.propertiesData;
        for (var i = 0; i < data.length; i++) {
            var record = data[i];
            var newRecord = {};
            newRecord['id'] = data[i]._id;
            for (var k in attrs) {
                if (attrs.hasOwnProperty(k)) {
                    var attr = attrs[k];
                    attr.needUpdate = false;
                    var names = attr.names;
                    var values = self.getAttrValues(attr, record);
                    if (names.length > 1) {
                        for (var j = 0; j < values.length; j++) {
                            var val = values[j];
                            var name = names[j];
                            newRecord[name] = Util.isArray(val) && val.length === 1 ? val[0] : val;
                        }
                    } else {
                        newRecord[names[0]] = values.length === 1 ? values[0] : values;
                    }
                }
            }
            mappedData.push(newRecord);
        }
        this.StyleData = mappedData;
        console.log(mappedData)
        return mappedData;
    }

    updateMaping() {
        var self = this;
        var attrs = self.get('attrs');
        var data = this.layerSource.propertiesData;
        for (var i = 0; i < data.length; i++) {
            var record = data[i];
            for (var attrName in attrs) {
                if (attrs.hasOwnProperty(attrName) && attrs[attrName].neadUpdate) {
                    var attr = attrs[attrName];
                    var names = attr.names;
                    var values = self.getAttrValues(attr, record);
                    if (names.length > 1) {
                        for (var j = 0; j < values.length; j++) {
                            var val = values[j];
                            var name = names[j];
                            this.StyleData[i][name] = Util.isArray(val) && val.length === 1 ? val[0] : val;
                        }
                    } else {
                        this.StyleData[i][names[0]] = values.length === 1 ? values[0] : values;
                    }
                    attr.neadUpdate = true;
                }
            }
        }
    }

    getAttrValues(attr, record) {
        var scales = attr.scales;
        var params = [];
        for (var i = 0; i < scales.length; i++) {
            var scale = scales[i];
            var field = scale.field;
            if (scale.type === 'identity') {
                params.push(scale.value);
            } else {
                params.push(record[field]);
            }
        }
        var indexZoom = params.indexOf('zoom');
        if (indexZoom !== -1) params[indexZoom] = attr.zoom;
        var values = attr.mapping.apply(attr, params);
        return values;
    }

    getDataType(data) {
        if (data.hasOwnProperty('type')) {
            var type = data.type;
            if (type === 'FeatureCollection') {
                return 'geojson';
            }
        }
        return 'basic';
    }

    scaleByZoom() {
        var _this4 = this;
        if (this.zoomScale) {
            this.map.on('zoomend', function () {
                var zoom = _this4.map.getZoom();
                _this4.updateSize(Math.floor(zoom));
            });
        }
    }

    on(type, callback): any {
        this.addPickingEvents();
        super.on(type, callback);
    }

    getPickingId() {
        return this.scene.engine.picking.getNextId();
    }

    addToPicking(object) {
        this.scene.engine.picking.add(object);
    }

    removeFromPicking(object) {
        this.scene.engine.picking.remove(object);
    }

    addPickMesh(mesh) {
        var _this5 = this;
        this.pickingMesh = new THREE.Object3D();
        this.visibleWithZoom();
        this.scene.on('zoomchange', function () {
            _this5.visibleWithZoom();
        });
        this.addToPicking(this.pickingMesh);
        var pickmaterial = PickingMaterial({ u_zoom: this.scene.getZoom() });
        var pickingMesh = new THREE[mesh.type](mesh.geometry, pickmaterial);
        pickmaterial.setDefinesvalue(this.type, true);
        pickingMesh.onBeforeRender = function () {
            var zoom = _this5.scene.getZoom();
            pickingMesh.material.setUniformsValue('u_zoom', zoom);
        };
        this.pickingMesh.add(pickingMesh);
    }

    setPickingId() {
        this.pickingId = this.getPickingId();
    }

    addPickingEvents() {
        var _this6 = this;
        this.scene.on('pick', function (e) {
            var featureId = e.featureId, point2d = e.point2d, intersects = e.intersects;
            if (intersects.length === 0) {
                return;
            }
            var source = _this6.layerSource.get('data');
            var feature = source.features[featureId];
            var lnglat = _this6.scene.containerToLngLat(point2d);
            var target = {
                feature: feature,
                pixel: point2d,
                lnglat: {
                    lng: lnglat.lng,
                    lat: lnglat.lat
                }
            };
            _this6.emit('click', target);
        });
    }

    updateStyle(featureStyleId, style) {
        if (this.activeIds) {
            this.resetStyle();
        }
        this.activeIds = featureStyleId;
        var pickingId = this.layerMesh.geometry.attributes.pickingId.array;
        var color = style.color;
        var colorAttr = this.layerMesh.geometry.attributes.a_color;
        var firstId = pickingId.indexOf(featureStyleId[0] + 1);
        for (var i = firstId; i < pickingId.length; i++) {
            if (pickingId[i] === featureStyleId[0] + 1) {
                colorAttr.array[i * 4 + 0] = color[0];
                colorAttr.array[i * 4 + 1] = color[1];
                colorAttr.array[i * 4 + 2] = color[2];
                colorAttr.array[i * 4 + 3] = color[3];
            } else {
                break;
            }
        }
        colorAttr.needsUpdate = true;
        return;
    }

    updateColor() {
        this.updateMaping();
    }

    updateFilter() {
        var _this7 = this;
        this.updateMaping();
        var filterData = this.StyleData;
        this.activeIds = null;
        var colorAttr = this.layerMesh.geometry.attributes.a_color;
        var pickAttr = this.layerMesh.geometry.attributes.pickingId;
        pickAttr.array.forEach(function (id, index) {
            id = Math.abs(id);
            var color = _toConsumableArray(_this7.StyleData[id - 1].color);
            id = Math.abs(id);
            var item = filterData[id - 1];
            if (item.hasOwnProperty('filter') && item.filter === false) {
                colorAttr.array[index * 4 + 0] = 0;
                colorAttr.array[index * 4 + 1] = 0;
                colorAttr.array[index * 4 + 2] = 0;
                colorAttr.array[index * 4 + 3] = 0;
                pickAttr.array[index] = -id;
            } else {
                colorAttr.array[index * 4 + 0] = color[0];
                colorAttr.array[index * 4 + 1] = color[1];
                colorAttr.array[index * 4 + 2] = color[2];
                colorAttr.array[index * 4 + 3] = color[3];
                pickAttr.array[index] = id;
            }
        });
        colorAttr.needsUpdate = true;
        pickAttr.needsUpdate = true;
        this.needUpdateFilter = false;
        this.needUpdateColor = false;
    }

    visibleWithZoom() {
        var zoom = this.scene.getZoom();
        var minZoom = this.get('minZoom');
        var maxZoom = this.get('maxZoom');
        var offset = 0;
        if (this.type === 'point') {
            offset = 5;
        } else if (this.type === 'polyline') {
            offset = 2;
        }
        this.object3D.position.z = offset * Math.pow(2, 20 - zoom);
        if (zoom < minZoom || zoom > maxZoom) {
            this.object3D.visible = false;
        } else if (this.get('visible')) {
            this.object3D.visible = true;
        }
    }

    resetStyle() {
        var _this8 = this;
        var pickingId = this.layerMesh.geometry.attributes.pickingId.array;
        var colorAttr = this.layerMesh.geometry.attributes.a_color;
        this.activeIds.forEach(function (index) {
            var color = _this8.StyleData[index].color;
            var firstId = pickingId.indexOf(index + 1);
            for (var i = firstId; i < pickingId.length; i++) {
                if (pickingId[i] === index + 1) {
                    colorAttr.array[i * 4 + 0] = color[0];
                    colorAttr.array[i * 4 + 1] = color[1];
                    colorAttr.array[i * 4 + 2] = color[2];
                    colorAttr.array[i * 4 + 3] = color[3];
                }
            }
        });
        colorAttr.needsUpdate = true;
    }

    despose() {
        this.destroy();
        if (this.object3D && this.object3D.children) {
            var child;
            for (var i = 0; i < this.object3D.children.length; i++) {
                child = this.object3D.children[i];
                if (!child) {
                    continue;
                }
                this.remove(child);
                if (child.geometry) {
                    child.geometry.dispose();
                    child.geometry = null;
                }
                if (child.material) {
                    if (child.material.map) {
                        child.material.map.dispose();
                        child.material.map = null;
                    }
                    child.material.dispose();
                    child.material = null;
                }
            }
        }
        this.object3D = null;
        this.scene = null;
    }
}