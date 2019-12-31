import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import axios from 'axios';
import GeojsonConfig from '../constant/geojsonConfig';
// import { generateMapGeometry } from './geojson';
import { generateMapGeometry, rotation, up } from "./geojson";

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


        this.scene.add(new THREE.ArrowHelper(up, new THREE.Vector3(), 10, 0xff0000));
    this.scene.add(new THREE.AxesHelper(5));
    this.scene.add(new THREE.ArrowHelper(up.clone().applyMatrix3(rotation), new THREE.Vector3(), 10, 0xff0000));

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
        this.camera = new THREE.PerspectiveCamera(75, this.innerWidth / this.innerHeight, 20, 30e6);
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
        this.controls.minDistance  = 100;
        //设置相机距离原点的最远距离
        this.controls.maxDistance  = 200;
        //是否开启右键拖拽
        this.controls.enablePan = true;
    }

    // 模型
    private initModel() {
        this.loadData();
    }

    // 加载模型数据
    private loadData() {
        axios.get(GeojsonConfig.boston).then(res => {
            // console.log(res);
            if (res.status === 200) {
                const data: GeoJSON.FeatureCollection = res.data;
                console.log(data)
                this.buildings = generateMapGeometry(data);
                this.scene.add(this.buildings);
                // console.log(this.scene)
            }
        })
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

}