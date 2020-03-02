import Util from "../utils/Util";
import Base from "./Scale";
import Category from "./Category";
import Linear from "./Linear";
import Identity from "./Identity";
import Time from "./Time";
import TimeCategory from "./TimeCategory";
import Log from "./Log";
import Pow from "./Pow";


Base.Linear = Linear;
Base.Identity = Identity;
Base.Cat = Category;
Base.Time = Time;
Base.TimeCat = TimeCategory;
Base.Log = Log;
Base.Pow = Pow;
var _loop = function _loop(k) {
    if (Base.hasOwnProperty(k)) {
        var methodName = Util.lowerFirst(k);
        Base[methodName] = function (cfg) {
            return new Base[k](cfg);
        };
    }
};
for (var k in Base) {
    _loop(k);
}
var CAT_ARR = [
    'cat',
    'timeCat'
];
Base.isCategory = function (type) {
    return CAT_ARR.indexOf(type) >= 0;
};

export default Base
