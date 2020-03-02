import Source from "./Source";

import {getCoords} from "@turf/invariant";
import {flattenEach} from "@turf/meta";
import {feature} from "@turf/helpers";
import {cleanCoords} from "@turf/turf";
import FeatureIndex from "./geo/FeatureIndex";

class GeojsonSource extends  Source{
    prepareData() {
        var _this = this;
        this.type = 'geojson';
        var data = this.get('data');
        this.propertiesData = [];
        this.geoData = [];
        flattenEach(data, function (currentFeature, featureIndex) {
            var coord = getCoords(cleanCoords(currentFeature));
            _this.geoData.push(_this._coordProject(coord));
            currentFeature.properties._id = featureIndex + 1;
            _this.propertiesData.push(currentFeature.properties);
        });
    }
    featureIndex() {
        var data = this.get('data');
        this.featureIndex = new FeatureIndex(data);
    }
    getSelectFeatureId(featureId) {
        var data = this.get('data');
        var selectFeatureIds = [];
        var featureStyleId = 0;
        flattenEach(data, function (currentFeature, featureIndex) {
            if (featureIndex === featureId) {
                selectFeatureIds.push(featureStyleId);
            }
            featureStyleId++;
            if (featureIndex > featureId) {
                return;
            }
        });
        return selectFeatureIds;
    }
}
export default GeojsonSource
