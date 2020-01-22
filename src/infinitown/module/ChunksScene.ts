import * as THREE from "three";
import GlobalConfig from "./GlobalConfig";

export default class ChunksScene extends THREE.Scene {

    private pickables: Array<any> = [];
    private chunks: Array<any> = [];

    constructor() {
        super();
        this.pickables = [];
        this.chunks = [];
        this.initChunks();
    }

    initChunks() {
        for (let i = 0; i < GlobalConfig.CHUNK_COUNT; i++) {
            for (let j = 0; j < GlobalConfig.CHUNK_COUNT; j++) {
                if (!this.chunks[j]) {
                    this.chunks[j] = [];
                }
                const id = this.createChunkAt(j, i);
                this.chunks[j][i] = id;
                this.add(id);
            }
        }
    }

    createChunkAt(x, time) {
        const chunk = new THREE.Object3D();
        const geometry = new THREE.PlaneGeometry(GlobalConfig.CHUNK_SIZE, GlobalConfig.CHUNK_SIZE, 1, 1);
        const material = new THREE.MeshBasicMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        const left = -(GlobalConfig.CHUNK_COUNT - 1) / 2 * GlobalConfig.CHUNK_SIZE;
        // 设置旋转轴x
        mesh.rotation.x = -Math.PI / 2;
        // 设置中央点x
        mesh['centeredX'] = x - Math.floor(GlobalConfig.CHUNK_COUNT / 2);
        mesh['centeredY'] = time - Math.floor(GlobalConfig.CHUNK_COUNT / 2);
        mesh.material['visible'] = false;
        this.pickables.push(mesh);

        chunk.position.x = left + x * GlobalConfig.CHUNK_SIZE;
        chunk.position.z = left + time * GlobalConfig.CHUNK_SIZE;
        chunk['centeredX'] = mesh['centeredX'];
        chunk['centeredY'] = mesh['centeredY'];
        chunk['material'] = mesh.material;
        chunk.add(mesh);
        return chunk;
    }

    getPickables() {
        return this.pickables;
    }

    /**
     * 遍历大块
     * @param callback 
     */
    forEachChunk(callback) {
        for (let i = 0; i < GlobalConfig.CHUNK_COUNT; i++) {
            for (let j = 0; j < GlobalConfig.CHUNK_COUNT; j++) {
                const chunk = this.chunks[i][j];
                callback(chunk, chunk['centeredX'], chunk['centeredY']);
            }
        }
    }
}