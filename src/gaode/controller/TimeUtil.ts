import * as Util from "@antv/util";

export default {
    toTimeStamp: function toTimeStamp(value) {
        if (Util.isString(value)) {
            if (value.indexOf('T') > 0) {
                value = new Date(value).getTime();
            } else {
                value = new Date(value.replace(/-/ig, '/')).getTime();
            }
        }
        if (Util.isDate(value)) {
            value = value.getTime();
        }
        return value;
    }
};
