import Base from "./Base";
import Global from "./Global";
import MapProvider from "./map/MapProvider";
import GaodeMap from "./map/GaodeMap";
import Engine from "./engine/Engine";
// import LayerIndex from './'


export class Scene extends Base {

    mapContainer: string = null;
    container: HTMLElement = null;

    map: null;
    engine: Engine = null;

    mapType: null;

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
        this.initLayer();
        this.emit('loaded');
    }

    initEngine(mapContainer: HTMLElement) {
        this.engine = new Engine(mapContainer, this);
        this.engine.run();
    }

    initLayer() {
        const loop = (methodName) => {
            this[methodName] = cfg => {
                cfg ? cfg.mapType = this.mapType : cfg = { mapType: this.mapType };
                const layer = new LayerIndex
            }
        }
    }
}