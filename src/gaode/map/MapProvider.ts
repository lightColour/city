import Base from "../Base";
import Global from "../Global";
import Index from "./theme/Index";

const DEG2RAD = Math.PI / 180;

export default class MapProvider extends Base {

    container: string = null;
    map: null;
    renderDom: HTMLElement = null;

    constructor(container: string, cfg) {
        super(cfg);
        this.container = container;

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
        this.map = new window['AMap'].Map(this.container, this.attr);
    }

    asyncCamera() {

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