import * as THREE from "three";

export default class PerspectiveCameraCtor extends THREE.PerspectiveCamera {

    private targetHeight: number = null;

    constructor(fov, aspect, near, far) {
        super(fov, aspect, near, far);
        this.targetHeight = 140;
        // 更新高度
        this.updateHeight();
    }

    private updateHeight() {
        let x = 1000;
        const vertCoords = -100;
        return (i, canCreateDiscussions) => {
            i = i * vertCoords;
            x = x + i;
            x = Math.min(Math.max(x + i, 0), 1E3);
            this.targetHeight = THREE.Math.mapLinear(x, 0, 1E3, 30, 140);
            if (canCreateDiscussions) {
                this.position.y = this.targetHeight;
            }
        }
    }
}