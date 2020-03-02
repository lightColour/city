import * as THREE from 'three';
import Base from "../Base";
import Global from '../Global';
import Util from '../utils/Util';
import colorUtil from '../utils/ColorUtil';
import SourceIndex from '../source/Index';

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

    scene: null;
    map: any = null;
    object3D: THREE.Object3D = null;
    pickObject3D: THREE.Object3D = null;
    layerId: number = null;
    activeIds: null;
    layerMesh: null;

    needUpdateColor: boolean = false;
    needUpdateFilter: boolean = false;
    zoomScale: boolean = false;
    shapeType: string = null;

    layerSource: null;

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
    }

    remove(object) {

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
        const type = cfgType === void 0 ? dataType : cfgType;
        cfg.data = data;
        cfg.mapType = this.get('mapType');
        this.layerSource = new SourceIndex[type](cfg);
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
        values === 'text' ? this.shapeType = values : null;
        this.createAttrOption('shape', field, values, Global.size);
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
        const styleOptions = this.get('styleOptions');
        if (!styleOptions) {
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
        for (let item in cfg) {
            if (colorItem.indexOf(item) !== -1) {
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
        const activeHander = this.addActiveFeature();
    }

    addActiveFeature(e) {
        const featureId = e.featureId;
        const activeStyle = this.get('activedOptions');
        const selectFeatureids = this.layerSource;
        if (this.StyleData[selectFeatureids[0]].hasOwnProperty('filter') && this.StyleData[selectFeatureIds[0]].filter === false) {
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

}