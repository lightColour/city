import Base from "../Base";
import Global from "../Global";
import Index from "./theme/Index";
import Engine from "../engine/Engine";

const DEG2RAD = Math.PI / 180;

export default class MapProvider extends Base {

    container: string = null;
    map: any = null;
    renderDom: HTMLElement = null;
    engine: Engine = null;

    constructor(container: string, cfg) {
        super(cfg);
        this.container = container;
        this.initMap();
        this.addOverLayer();

        setTimeout(() => {
            this.emit('mapLoad');
        }, 3000);

    }

    getDefaultCfg() {
        return Object.assign(Global.scene, {
            resizeEnable: true,
            viewMode: '3D'
        })
    }

    initMap() {
        const mapStyle = this.get('mapStyle');
        switch(mapStyle) {
            case 'dark':
                this.set('mapStyle', Index.darkTheme.mapStyle);
                break;
            case 'light':
                this.set('mapStyle', Index.lightTheme.mapStyle);
                break;
            default:
                this.set('mapStyle', Index.lightTheme.mapStyle);
        }
        this.set('zoom', [
            this.get('minZoom'),
            this.get('maxZoom')
        ])
        
        setTimeout(() => {
            this.map = new window['AMap'].Map(this.container, this.attrs);
        }, 1000)
        // this.map = new window['AMap'].Map(this.container, this.attrs);
    }

    asyncCamera(engine: Engine) {
        this.engine = engine;
        const camera = engine.camera;
        const scene = engine.scene;
        // const pickScene = engine.picking.pickingScene;
        this.map.on('camerachange', e => {
            const mapCamera = e.camera;
            const fov = mapCamera.fov;
            const near = mapCamera.near;
            const far = mapCamera.far;
            const height = mapCamera.height;
            const pitch = mapCamera.pitch * DEG2RAD;
            const rotation = mapCamera.rotation * DEG2RAD;
            const aspect = mapCamera.aspect;
            
            camera.fov = 180 * fov / Math.PI;
            camera.aspect = aspect;
            camera.near = near;
            camera.far = far;
            camera.updateProjectionMatrix();
            camera.position.z = height * Math.cos(pitch);
            camera.position.x = height * Math.sin(pitch) * Math.sin(rotation);
            camera.position.y = -height * Math.sin(pitch) * Math.cos(rotation);
            camera.up.x = -Math.cos(pitch) * Math.sin(rotation);
            camera.up.y = Math.cos(pitch) * Math.cos(rotation);
            camera.up.z = Math.sin(pitch);
            camera.lookAt(0, 0, 0);
            scene.position.x = -e.camera.position.x;
            scene.position.y = e.camera.position.y;
        })
    }

    projectFlat() {

    }

    getCenter() {

    }

    getCenterFlat() {

    }

    addOverLayer() {
        const canvasContainer = document.getElementById(this.container);
        this.renderDom = document.createElement('div');
        this.renderDom.style.cssText += 'position: absolute;top: 0; z-index:1;height: 100%;width: 100%;pointer-events: none;';
        this.renderDom.id = 'l7_canvaslayer';
        canvasContainer.appendChild(this.renderDom);
    }
}