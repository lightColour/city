import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import axios from 'axios';
import GeojsonConfig from '../constant/geojsonConfig';
import { generateMapGeometry } from './convert';
import { rotation, up } from "./geojson";
import { setMapData } from './convert2';

export default class BuildingView extends React.Component {
    
    private canvas: React.RefObject<HTMLCanvasElement>;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private light: THREE.PointLight;
    private controls: any;

    private innerWidth: number;
    private innerHeight: number;

    private buildings: THREE.Group;

    constructor(props: any) {
        super(props);

        this.canvas = React.createRef();
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;

        // this.draw();
    }

    private draw() {
        this.initScene();
        this.initRender();
        this.initCamera();
        this.initLight();
        this.initControls();
        this.initModel();
        // this.initStats();
        // this.initGui();

        this.animate();

        window.addEventListener('resize', () => this.onWindowResize(), false);


        this.scene.add(new THREE.ArrowHelper(up, new THREE.Vector3(), 10));
    this.scene.add(new THREE.AxesHelper(5));
    this.scene.add(new THREE.ArrowHelper(up.clone().applyMatrix3(rotation), new THREE.Vector3(), 10));

    }

    // 场景
    private initScene() {
        this.scene = new THREE.Scene();
    }

    // 渲染器
    private initRender() {
        if (!this.canvas.current) {
            return;
        }
        const canvasEl = this.canvas.current;

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvasEl,
            antialias: true
        })
        // 设置canvas尺寸
        this.renderer.setSize(this.innerWidth, this.innerHeight);
        this.renderer.sortObjects = false;
        // 添加到dom
        // document.body.appendChild(this.renderer.domElement);
    }

    // 相机
    private initCamera() {
        this.camera = new THREE.PerspectiveCamera(75, this.innerWidth / this.innerHeight, 1, 30e6);
        this.camera.position.set(0, 100, 0);
    }

    // 光源
    private initLight() {
        // 添加环境光
        this.scene.add(new THREE.AmbientLight(0x444444));

        // 添加点光源
        this.light = new THREE.PointLight(0xffffff);
        this.light.position.set(0, 50, 0);
    }

    // 控制器
    private initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // 使动画循环使用时阻尼或自转 意思是否有惯性
        this.controls.enableDamping = true;
        //是否可以缩放
        this.controls.enableZoom = true;
        //是否自动旋转
        this.controls.autoRotate = false;
        //设置相机距离原点的最近距离
        this.controls.minDistance  = 10;
        //设置相机距离原点的最远距离
        // this.controls.maxDistance  = 200;
        //是否开启右键拖拽
        this.controls.enablePan = true;
    }

    // 模型
    private initModel() {
        this.loadData();
    }

    // 加载模型数据
    private loadData() {
        // boston building
        // axios.get(GeojsonConfig.building).then(res => {
        //     // console.log(res);
        //     if (res.status === 200) {
        //         const data: GeoJSON.FeatureCollection = res.data;
        //         console.log(data)
        //         this.buildings = generateMapGeometry(data);
        //         this.scene.add(this.buildings);
        //         // console.log(this.scene)
        //     }
        // })

        axios.get(GeojsonConfig.building).then(res => {
            // console.log(res);
            if (res.status === 200) {
                const data = res.data;
                console.log(data)
                setMapData(data, '51', this.scene)
            }
        })

        this.test();
    }

    private onWindowResize() {
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;

        this.camera.aspect = this.innerWidth / this.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.innerWidth, this.innerHeight);
        this.renderScene();
    }
    
    private renderScene() {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    }

    private animate() {

        this.renderScene();

        // 更新性能插件
        // this.stats.update();

        
        this.controls.update();

        requestAnimationFrame(() => this.animate());
    }

    public componentDidMount() {
        this.draw();
    }

    public render() {
        return (
            <canvas ref={this.canvas} />
        );
    }

    test() {
        var length = 12 / 1000, width = 8 / 1000;

        var shape = new THREE.Shape();
        shape.moveTo( 0,0 );
        shape.lineTo( 0, width );
        shape.lineTo( length, width );
        shape.lineTo( length, 0 );
        shape.lineTo( 0, 0 );

        var extrudeSettings = {
            steps: 2,
            depth: 16,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        };

        var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var mesh = new THREE.Mesh( geometry, material ) ;
        this.scene.add( mesh );
        console.log(shape)
    }

}