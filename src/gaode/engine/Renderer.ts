import { WebGLRenderer } from "three";

export default class Renderer {

    container: HTMLElement = null;
    renderer: THREE.WebGLRenderer = null;

    constructor(container) {
        this.container = container;

    }

    initRender() {
        this.renderer = new WebGLRenderer({
            antialias: true,
            alpha: true
        })
        this.renderer.setClearColor(16711680, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // this.renderer.gammaInput = true;
        // this.renderer.gammaOutput = true;
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
    }

    updateSize() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}