import * as THREE from "three";
import * as d3 from "d3";

let projection = null;
let counter = 0;

const lnglatToVector3 = (lnglat) => {
    if (!projection) {
        projection = d3.geoMercator().center([113.946152, 22.497559]).scale(100000).translate([0, 0]);
    }
    const [x, y] = projection([lnglat[0], lnglat[1]])
    const z = 0;
    return [y, x, z]
}

export const setMapData = (data, type, scene) => {
    let vector3json = [];
    data.features.forEach(function (features, featuresIndex) {
        const areaItems = features.geometry.coordinates;
        // features.properties.cp = lnglatToVector3(features.properties.cp);
        vector3json[featuresIndex] = {
            data: features.properties,
            mercator: []
        };
        // console.log(areaItems)
        areaItems.forEach(function (item, areaIndex) {
            vector3json[featuresIndex].mercator[areaIndex] = [];
            item[0].forEach(function (cp) {
                if (counter < 12) {
                    console.log(cp)
                }
                const lnglat = lnglatToVector3(cp);
                if (counter < 12) {
                    console.log(lnglat)
                }
                counter++;
                const vector3 = new THREE.Vector3(lnglat[0], lnglat[1], lnglat[2]).multiplyScalar(1.2);
                vector3json[featuresIndex].mercator[areaIndex].push(vector3)
            })
        })
    });

    drawChinaMap(vector3json, scene)
}

const drawChinaMap = (data, scene) => {
    console.log(data)
    let mapGroup = new THREE.Group();
    mapGroup.position.y = 0;
    const lineMaterial = new THREE.LineDashedMaterial({
        color: '#656565',
        dashSize: 0.1,
        gapSize: 0.2
    });
    let fakeLightMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        flatShading: true,
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
        depthTest: false,
        wireframe: false,
    });
    data.forEach(function (areaData) {
        areaData.mercator.forEach(function (areaItem) {
            let geometry = new THREE.BufferGeometry();
            let verticesArr = [];
            for (let i = 0; i < areaItem.length - 1; i++) {
                verticesArr.push(areaItem[i].x, areaItem[i].y, areaItem[i].z);
                verticesArr.push(areaItem[i + 1].x, areaItem[i + 1].y, areaItem[i + 1].z + 5);
                verticesArr.push(areaItem[i].x, areaItem[i].y, areaItem[i].z + 5);

                verticesArr.push(areaItem[i].x, areaItem[i].y, areaItem[i].z);
                verticesArr.push(areaItem[i + 1].x, areaItem[i + 1].y, areaItem[i + 1].z);
                verticesArr.push(areaItem[i + 1].x, areaItem[i + 1].y, areaItem[i + 1].z + 5);
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verticesArr), 3));
            let count = geometry.attributes.position.count;
            geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
            let color = new THREE.Color();
            let positions = geometry.attributes.position;
            let colors = geometry.attributes.color;
            for (let i = 0; i < count; i++) {
                let a = positions.getZ(i) ? 0 : 1;
                color.setHSL((268 * a) / 360, 1.0 * a, a ? 0.5 : 0.13);
                colors.setXYZ(i, color.r, color.g, color.b);
            }
            let mesh = new THREE.Mesh(geometry, fakeLightMaterial);
            mapGroup.add(mesh);
        });
    });
    scene.add(mapGroup);
}