import EventEmitter from "wolfy87-eventemitter";
import * as THREE from 'three';
import Camera from "./Camera";
import Renderer from "./Renderer";
import { Clock } from "three";
import Picking from "./Picking";

export default class Engine extends EventEmitter {

    scene: THREE.Scene = null;
    camera: THREE.PerspectiveCamera = null;
    renderer: THREE.WebGLRenderer = null;
    clock: THREE.Clock = null;
    picking: Picking = null;

    engineID: number = null;

    constructor(container: HTMLElement, world) {
        super();
        this.scene = new THREE.Scene();
        this.camera = new Camera(container).camera;
        this.renderer = new Renderer(container).renderer;
        // this.picking = new Picking(world, this.renderer, this.camera, this.scene);
        this.clock = new Clock();
    }

    run() {
        this.update();
        this.engineID = requestAnimationFrame(() => this.run())
    }

    stop() {
        cancelAnimationFrame(this.engineID);
    }

    update() {

    }

    destroy() {

    }
}