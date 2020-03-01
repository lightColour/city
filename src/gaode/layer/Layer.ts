import * as THREE from 'three';
import Base from "../Base";
import Global from '../Global';
import Util from '../utils/Util';

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
    zoomScale: boolean = false;
    shapeType: string = null;

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
                styleOptions[item] = 
            }
        }
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

}