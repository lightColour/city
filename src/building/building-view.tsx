import React from 'react';
import THREE from 'three';

export default class BuildingView extends React.Component {

    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;

    constructor(props: any) {
        super(props);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 20, 30e6);
    }

    init() {
    }
}