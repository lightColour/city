import Base from "./Base";
import Global from "./Global";
import MapProvider from "./map/MapProvider";
import GaodeMap from "./map/GaodeMap";
import Engine from "./engine/Engine";


export class Scene extends Base {

    mapContainer: string = null;
    container: HTMLElement = null;

    map: null;
    engine: Engine = null;

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
            const sceneMap = new GaodeMap(Map.map);
        })
        this.map = Map.map;
        Map.asyncCamera(this.engine);
    }

    initEngine(mapContainer: HTMLElement) {
        this.engine = new Engine(mapContainer, this);
    }
}