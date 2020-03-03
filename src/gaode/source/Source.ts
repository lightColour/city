import Base from "../Base";
import GeoProject from "./geo/GeoProject";
import Controller from "../controller/Controller";

class Source extends Base{

    propertiesData;
    geoData;

    constructor(cfg) {
        super(cfg)
        this._initControllers();
        this.prepareData();
    }

    getDefaultCfg() {
        return {
            data: null,
            defs: {},
            scales: {},
            options: {}
        };
    }

    prepareData() {
        var _this2 = this;
        var data = this.get('data');
        this.propertiesData = [];
        this.geoData = [];
        data.coordinates.forEach(function (geo) {
            var coord = _this2._coordProject(geo);
            _this2.geoData.push(coord);
            _this2.propertiesData.push([]);
        });
    }

    createScale(field) {
        var data = this.propertiesData;
        var scales = this.get('scales');
        var scale = scales[field];
        var scaleController = this.get('scaleController');
        if (!scale) {
            scale = scaleController.createScale(field, data);
            scales[field] = scale;
        }
        return scale;
    }
    _initControllers() {
        var defs = this.get('defs');
        var scaleController = new Controller.Scale({ defs: defs });
        this.set('scaleController', scaleController);
    }
    _getCoord(geo) {
        if (geo.geometry) {
            geo = geo.geometry.coordinates;
        } else if (geo.coordinates) {
            geo = geo.coordinates;
        }
        return geo;
    }
    _coordProject(geo) {
        var _this3 = this;
        if (Array.isArray(geo[0][0])) {
            return geo.map(function (coor) {
                return _this3._coordProject(coor);
            });
        }
        if (!Array.isArray(geo[0])) {
            return this._coorConvert(geo);
        }
        return geo.map(function (coor) {
            return _this3._coorConvert(coor);
        });
    }
    _coorConvert(geo) {
        var ll = GeoProject(geo);
        return [
            ll.x,
            -ll.y,
            geo[2] || 0
        ];
    }
}

export default Source
