import { PerspectiveCamera } from "three";

export default class Camera {

    container: HTMLElement = null;
    camera: THREE.PerspectiveCamera = null;

    constructor(container) {
        this.camera = new PerspectiveCamera(45, 1, 1, 2000000);
        this.updateSize();
        window.addEventListener('resize', this.updateSize)
    }

    updateSize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
    }
}