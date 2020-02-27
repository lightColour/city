import Base from "./Base";
import Global from "./Global";
import MapProvider from "./map/MapProvider";


export class Scene extends Base {

    mapContainer: string = null;
    container: HTMLElement = null;

    constructor(cfg) {
        super(cfg);

    }

    getDefaultCfg() {
        return Global.scene;
    }

    initMap() {
        this.mapContainer = this.get('id');
        this.container = document.getElementById(this.mapContainer);
        const Map = new MapProvider(this.mapContainer, this.attr);
        Map.on('mapLoad', () => {
            this.initEngine(Map.renderDom);
            // const sceneMap = new GaodeMap();
        })
    }

    initEngine(mapContainer: HTMLElement) {
        // this.engine = new Engine()
    }
}