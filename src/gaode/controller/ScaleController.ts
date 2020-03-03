import Util from "../utils/Util";

import Scale from './Base'
import Global from '../Global';


var TYPES = {
    LINEAR: 'linear',
    CAT: 'cat',
    TIME: 'time'
};

class ScaleController {

    defs;

    dateRegex = /^(?:(?!0000)[0-9]{4}([-/.]+)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))(\s+([01]|([01][0-9]|2[0-3])):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]))?$/;


    constructor(cfg) {
        this.defs = {};
        Util.assign(this, cfg);
    }

    _getDef(field) {
        var defs = this.defs;
        var def = null;
        if (Global.scales[field] || defs[field]) {
            def = Util.mix({}, Global.scales[field]);
            Util.each(defs[field], function (v, k) {
                if (Util.isNil(v)) {
                    delete def[k];
                } else {
                    def[k] = v;
                }
            });
        }
        return def;
    }

    _getDefaultType(field, data) {
        var type = TYPES.LINEAR;
        var value = Util['Array'].firstValue(data, field);
        if (Util.isArray(value)) {
            value = value[0];
        }
        if (this.dateRegex.test(value)) {
            type = TYPES.TIME;
        } else if (Util.isString(value)) {
            type = TYPES.CAT;
        }
        return type;
    }

    _getScaleCfg(type, field, data) {
        var cfg = { field: field };
        var values = Util['Array'].values(data, field);
        cfg['values'] = values;
        if (!Scale['isCategory'](type) && type !== 'time') {
            var range = Util['Array'].getRange(values);
            cfg['min'] = range.min;
            cfg['max'] = range.max;
            cfg['nice'] = true;
        }
        if (type === 'time') {
            cfg['nice'] = false;
        }
        return cfg;
    }

    createScale(field, data) {
        var self = this;
        var def = self._getDef(field);
        var scale;
        if (!data || !data.length) {
            if (def && def.type) {
                scale = Scale[def.type](def);
            } else {
                scale = Scale['identity']({
                    value: field,
                    field: field.toString(),
                    values: [field]
                });
            }
            return scale;
        }
        var firstValue = Util['Array'].firstValue(data, field);
        if (Util.isNumber(field) || Util.isNil(firstValue) && !def) {
            scale = Scale['identity']({
                value: field,
                field: field.toString(),
                values: [field]
            });
        } else {
            var type;
            if (def) {
                type = def.type;
            }
            type = type || self._getDefaultType(field, data);
            var cfg = self._getScaleCfg(type, field, data);
            if (def) {
                Util.mix(cfg, def);
            }
            scale = Scale[type](cfg);
        }
        return scale;
    }

}

export default ScaleController
