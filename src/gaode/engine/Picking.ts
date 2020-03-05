import * as THREE from 'three';

export default class Picking {

    scene: THREE.Scene = null;
    pickingScene: THREE.Scene = null;
    renderer: THREE.WebGLRenderer = null;
    camera: THREE.PerspectiveCamera = null;
    raycaster: THREE.Raycaster = null;
    pickingTexture: THREE.WebGLRenderTarget = null;

    world: any = null;
    events: Array<any> = [];

    nextId: number = 1;
    width: number = null;
    height: number = null;

    pixelBuffer: Uint8Array = null;
    needUpdate: boolean = false;

    resizeHandler;
    

    constructor(world: any, renderer, camera, scene) {
        this.world = world;
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.raycaster = new THREE.Raycaster();
        this.raycaster.linePrecision = 3;
        this.pickingScene = new THREE.Scene();
        
        const size = this.renderer.getSize(new THREE.Vector2());
        this.width = size.width;
        this.height = size.height;
        const parameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false,
            depthBuffer: false
        }
        this.pickingTexture = new THREE.WebGLRenderTarget(this.width, this.height, parameters);
        this.resizeTexture();
        this.initEvents();
    }

    resizeTexture() {
        const size = this.renderer.getSize(new THREE.Vector2());
        this.width = size.width;
        this.height = size.height;
        this.pickingTexture.setSize(this.width, this.height);
        this.pixelBuffer = new Uint8Array(4 * this.width * this.height);
        this.needUpdate = true;
    }

    initEvents() {
        window.addEventListener('resize', this.resizeTexture, false);
        this.world.container.addEventListener('mouse', this.onMouseUp, false);
    }

    onMouseUp(event) {
        const point = {
            x: event.clientX,
            y: event.clientY
        }
        const normalisedPoint = {
            x: point.x / this.width * 2 - 1,
            y: -(point.y / this.height) * 2 + 1
        }
        this.pick(point, normalisedPoint);
    }

    onWorldMove() {
        this.needUpdate = true;
    }

    pick(point, normalisedPoint) {
        this.update(point);
        const id = this.pixelBuffer[2] * 255 * 255 + this.pixelBuffer[1] * 255 + this.pixelBuffer[0];
        if (id === 16646655 || this.pixelBuffer[3] === 0) {
            return;
        }
        this.raycaster.setFromCamera(normalisedPoint, this.camera);
        const intersects = this.raycaster.intersectObjects(this.pickingScene.children, true);
        const point2d = {
            x: point.x,
            y: point.y
        }
        let point3d;
        if (intersects.length > 0) {
            point3d = intersects[0].point;
        }
        const item = {
            featureId: id - 1,
            point2d: point2d,
            point3d: point3d,
            intersects: intersects
        }
        this.world.emit('pick', item);
    }

    update(point) {

    }
}