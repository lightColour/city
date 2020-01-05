import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import axios from 'axios';
import GeojsonConfig from '../constant/geojsonConfig';
import * as d3 from 'd3-geo';

export default class GeoMap {

    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private light: THREE.PointLight;
    private controls: any;

    private innerWidth: number;
    private innerHeight: number;

    private projection: any = null;
    private mapGroup: THREE.Group;
    private meshList: Array<THREE.Mesh> = [];
    private cameraPath;

    constructor() {
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;

        this.draw();
    }

    private draw() {
        this.initScene();
        this.initRender();
        this.initCamera();
        this.initLight();
        this.initControls();
        this.initModel();

        // this.setCameraHelper();
        // this.setAxes();
        // this.initStats();
        // this.initGui();

        this.animate();

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    // 场景
    private initScene() {
        this.scene = new THREE.Scene();
    }

    // 渲染器
    private initRender() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        })
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.sortObjects = false;
        this.renderer.setClearColor('#212121');
        this.renderer.setSize(this.innerWidth, this.innerHeight);

        // 添加到dom
        document.getElementsByClassName('map')[0].appendChild(this.renderer.domElement);
    }

    // 相机
    private initCamera() {
        this.camera = new THREE.PerspectiveCamera(10, this.innerWidth / this.innerHeight, 1, 2000);
        this.camera.up = new THREE.Vector3(0, 0, 1);
        this.camera.position.set(100, 0, 100);
        this.camera.lookAt(0, 0, 0);
    }

    // 添加基础灯光
    private initLight() {
        // 添加环境光
        // this.scene.add(new THREE.AmbientLight(0x444444));

        // 添加点光源
        this.light = new THREE.PointLight(0xffffff, 1, 0);
        this.light.position.set(0, 0, 5);

        // const sphereSize = 1;
        // const pointLightHelper = new THREE.PointLightHelper(this.light, sphereSize);
        // this.scene.add(pointLightHelper);
    }

    // 控制器
    private initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // // 使动画循环使用时阻尼或自转 意思是否有惯性
        // this.controls.enableDamping = true;
        // //是否可以缩放
        // this.controls.enableZoom = true;
        // //是否自动旋转
        // this.controls.autoRotate = false;
        // //设置相机距离原点的最近距离
        // this.controls.minDistance  = 10;
        // //设置相机距离原点的最远距离
        // this.controls.maxDistance  = 200;
        // //是否开启右键拖拽
        // this.controls.enablePan = true;
    }

    // 模型
    private initModel() {
        this.loadData();
    }

    // 加载数据
    private loadData() {
        axios.get(GeojsonConfig.sichuan).then(res => {
            // console.log(res);
            if (res.status === 200) {
                const data = res.data;
                console.log(data)
                this.setMapData(data, 'sichuan')
            }
        })
    }

    // 绘制地图
    private setMapData(data, type) {
        let vector3json = [];
        data.features.forEach((features, featuresIndex) => {
            const areaItems = features.geometry.coordinates;
            features.properties.cp = this.lnglatToVector3(features.properties.cp);
            vector3json[featuresIndex] = {
                data: features.properties,
                mercator: []
            };
            areaItems.forEach((item, areaIndex) => {
                vector3json[featuresIndex].mercator[areaIndex] = [];
                item.forEach(cp => {
                    const lnglat = this.lnglatToVector3(cp);
                    const vector3 = new THREE.Vector3(lnglat[0], lnglat[1], lnglat[2]).multiplyScalar(1.2);
                    vector3json[featuresIndex].mercator[areaIndex].push(vector3)
                })
            })
        });

        if (type === 'sichuan') {
            this.drawMap(vector3json);
        }
    }

    // 绘制图形
    private drawMap(data) {
        this.mapGroup = new THREE.Group();
        this.mapGroup.position.y = 0;
        this.scene.add(this.mapGroup);
        const extrudeSettings = {
            depth: 0.8,
            steps: 1,
            bevelSegments: 0,
            curveSegments: 1,
            bevelEnabled: false,
        };
        const blockMaterial = new THREE.MeshBasicMaterial({
            color: '#3700b1',
            opacity: 0.7,
            transparent: true,
            wireframe: false
        });
        const blockSideMaterial = new THREE.MeshBasicMaterial({
            color: '#5923bc',
            opacity: 0.7,
            transparent: true,
            wireframe: false
        });
        const lineMaterial = new THREE.LineBasicMaterial({
            color: '#9800ff'
        });
        data.forEach((areaData) => {
            let areaGroup = new THREE.Group();
            areaGroup.name = 'area';
            areaGroup['_groupType'] = 'areaBlock';
            areaData.mercator.forEach((areaItem) => {
                // Draw area block
                let shape = new THREE.Shape(areaItem);
                let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
                let mesh = new THREE.Mesh(geometry, [blockMaterial, blockSideMaterial]);
                areaGroup.add(mesh);
                // Draw Line
                let lineGeometry = new THREE.Geometry();
                lineGeometry.vertices = areaItem;
                let lineMesh = new THREE.Line(lineGeometry, lineMaterial);
                let lineMeshCp = lineMesh.clone();
                lineMeshCp.position.z = 0.8;
                areaGroup.add(lineMesh);
                areaGroup.add(lineMeshCp);
                // add mesh to meshList for mouseEvent
                this.meshList.push(mesh);
            });
            // areaGroup.add(this.lightGroup(areaData));
            // areaGroup.add(this.tipsSprite(areaData));
            this.mapGroup.add(areaGroup);
        });
        this.scene.add(this.mapGroup);
    }

    // 坐标转换
    private lnglatToVector3(lnglat) {
        if (!this.projection) {
            this.projection = d3.geoMercator().center([104.072259, 30.663403]).scale(100).translate([0, 0]);
        }
        const [x, y] = this.projection([lnglat[0], lnglat[1]])
        const z = 0;
        return [y, x, z]
    }

    // 创建相机辅助线
    private setCameraHelper() {
        const helper = new THREE.CameraHelper(this.camera);
        this.scene.add(helper);
    }

    // 创建一个xyz坐标轴
    private setAxes() {
        const axes = new THREE.AxesHelper(100);
        this.scene.add(axes);
    }

    private onWindowResize() {
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;

        this.camera.aspect = this.innerWidth / this.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.innerWidth, this.innerHeight);
        this.render();
    }
    
    private render() {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    }

    private animate() {

        this.render();

        // 更新性能插件
        // this.stats.update();

        
        this.controls.update();

        requestAnimationFrame(() => this.animate());
    }

}