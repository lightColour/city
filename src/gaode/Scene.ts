import Base from "./Base";
import Global from "./Global";
import MapProvider from "./map/MapProvider";
import GaodeMap from "./map/GaodeMap";
import Engine from "./engine/Engine";
import LayerIndex from './layer/Index';


export default class Scene extends Base {

    mapContainer: string = null;
    container: HTMLElement = null;

    map: null;
    engine: Engine = null;

    mapType: null;
    layers: Array<any> = [];

    PolygonLayer;

    constructor(cfg) {
        super(cfg);
        this.initMap();
        this.layers = [];
    }

    getDefaultCfg() {
        return Global.scene;
    }

    initMap() {
        this.mapContainer = this.get('id');
        console.log('id: ' + this.mapContainer)
        this.container = document.getElementById(this.mapContainer);
        const Map = new MapProvider(this.mapContainer, this.attrs);
        Map.on('mapLoad', () => {
            this.initEngine(Map.renderDom);
            const sceneMap = new GaodeMap(Map.map);

            this.map = Map.map;
            Map.asyncCamera(this.engine);
            this.initLayer();
            this.emit('loaded');
        })
        
    }

    initEngine(mapContainer: HTMLElement) {
        this.engine = new Engine(mapContainer, this);
        this.engine.run();
    }

    initLayer() {
        const loop = (methodName) => {
            this[methodName] = cfg => {
                cfg ? cfg.mapType = this.mapType : cfg = { mapType: this.mapType };
                const layer = new LayerIndex[methodName](this, cfg);
                this.layers.push(layer);
                return layer;
            }
        }
        for (let methodName in LayerIndex) {
            loop(methodName);
        }
    }
}