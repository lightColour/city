import Source from "./Source";

import {getCoords} from "@turf/invariant";
import {flattenEach} from "@turf/meta";
import {feature} from "@turf/helpers";
import {cleanCoords} from "@turf/turf";
import FeatureIndex from "./geo/FeatureIndex";

class GeojsonSource extends  Source{

    type;
    propertiesData;
    geoData;
    featureIndex;

    constructor(cfg) {
        super(cfg);
        this.prepareData();
    }

    prepareData() {
        this.type = 'geojson';
        var data = this.get('data');
        this.propertiesData = [];
        this.geoData = [];
        flattenEach(data, (currentFeature, featureIndex) => {
            var coord = getCoords(cleanCoords(currentFeature));
            this.geoData.push(this._coordProject(coord));
            currentFeature.properties._id = featureIndex + 1;
            this.propertiesData.push(currentFeature.properties);
        });
    }
    
    getFeatureIndex() {
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
