import * as d3 from "d3";
import * as THREE from "three";

export const EARTH_RADIUS = 6.371e6;

let projection = null;
let counter = 0;

export type PolygonCoordinates = number[][][];

export const latLongToGlobal = (long: number, lat: number, altitude: number) => {
    const lambda = long * Math.PI / 180;
    const phi = lat * Math.PI / 180;
    const cosPhi = Math.cos(phi);

    const radius = EARTH_RADIUS + altitude;

    return new THREE.Vector3(
        radius * cosPhi * Math.cos(lambda),
        radius * cosPhi * Math.sin(lambda),
        radius * Math.sin(phi)
    );
}

const longLatOrigin: any = [113.946152, 22.497559];

const lnglatToVector3 = (lnglat) => {
    if (!projection) {
        projection = d3.geoMercator().center(longLatOrigin).scale(100000).translate([0, 0]);
    }
    const [x, y] = projection([lnglat[0], lnglat[1]])
    const z = 0;
    return [y, x, z]
}


// const longLatOrigin = [42.360888, -71.059705];
const origin = latLongToGlobal(longLatOrigin[1], longLatOrigin[0], 0);
const aboveOrigin = latLongToGlobal(longLatOrigin[1], longLatOrigin[0], 2);
export const up = aboveOrigin.clone().sub(origin).normalize();

const matrixToRotateOntoVector = (a: THREE.Vector3, b: THREE.Vector3) => {
    const v = a.clone().cross(b);
    const c = a.dot(b);

    const vX = new THREE.Matrix3().fromArray([
        0, -v.z, v.y, //
        v.z, 0, -v.x, //
        -v.y, v.x, 0 //
    ]);

    const vX2 = vX.clone().multiply(vX).multiplyScalar(1 / (1 + c));

    const I = new THREE.Matrix3().identity();
    const newValues = I.toArray();
    const vXa = vX.toArray();
    const vX2a = vX2.toArray();
    for (let i = 0; i < newValues.length; i++) {
        newValues[i] += vXa[i] + vX2a[i];
    }
    return new THREE.Matrix3().fromArray(newValues);
}

export const rotation = matrixToRotateOntoVector(new THREE.Vector3(0, 1, 0), up);

export const latLongToNav = (long: number, lat: number, altitude: number) => {
    const unrotated = latLongToGlobal(long, lat, altitude).sub(origin);
    return unrotated.applyMatrix3(rotation);
}

export const generateMapGeometry = (geoJson: GeoJSON.FeatureCollection): THREE.Group => {
    const buildings = new THREE.Group();
    const naturalGroup = new THREE.Group();
    const waterways = new THREE.Group();
    const lineGroup = new THREE.Group();
    const group = new THREE.Group();
    for (const feature of geoJson.features) {
        if (feature.type !== "Feature") {
            continue;
        }
        const geometry = feature.geometry as GeoJSON.Geometry;
        // TODO: invert, check properties and then delegate?
        if (geometry.type === "Polygon") {
            // remove?
            if (feature.properties === undefined) {
                console.log("feature has no properties!");
                lineGroup.add(polygon(
                    geometry,
                    new THREE.LineBasicMaterial({ color: 0x000f40 })
                ));
            }

            const properties: any = feature.properties;
            if (properties.building) {
                buildings.add(building(
                    geometry.coordinates, properties
                ));
            }
            buildings.add(building(
                geometry.coordinates, properties
            ));

            if (properties.waterway) {
                waterways.add(waterway(geometry, properties));
            }

            if (properties.natural) {
                naturalGroup.add(natural(geometry, properties));
            }
        } else if (geometry.type === "LineString") {
            lineGroup.add(lineString(
                geometry,
                new THREE.LineBasicMaterial({ color: 0x300f40 })
            ));
        } else if (geometry.type === "MultiPolygon") {
            // console.log(feature);
            if (!feature.properties) {
                continue;
            }
            const properties: any = feature.properties;
            if (properties.natural) {
                naturalGroup.add(natural(geometry, properties));
            }

            if (properties.building) {
                buildings.add(multiBuilding(geometry.coordinates, properties));
            }
            buildings.add(multiBuilding(geometry.coordinates, properties));
        } else {
            console.debug(`Unsupported type: ${feature.geometry.type}`);
        }
    }
    console.log(buildings)
    group.add(lineGroup);
    group.add(buildings);
    group.add(naturalGroup);
    group.add(waterways);

    return group;
}

export const waterway = (poly: GeoJSON.Polygon | GeoJSON.MultiPolygon, properties: any) => {
    const bufGeom = poly.type === "MultiPolygon" ?
        multiFlatPolygon(poly.coordinates) :
        flatPolygon(poly.coordinates);
    const mesh = new THREE.Mesh(bufGeom, new THREE.MeshPhysicalMaterial({
        color: 0xe2c3c,
        roughness: 0.15,
        metalness: 0.00,
        reflectivity: 0.77,
        // clearCoat: 0.61,
        // clearCoatRoughness: 0.28
    }));
    return mesh;
}

export const natural = (poly: GeoJSON.Polygon | GeoJSON.MultiPolygon, properties: any) => {
    const bufGeom = poly.type === "MultiPolygon" ?
        multiFlatPolygon(poly.coordinates) :
        flatPolygon(poly.coordinates);
    const mesh = new THREE.Mesh(bufGeom, naturalMaterial(properties));
    return mesh;
}

export const naturalMaterial = (properties: any) => {
    const naturalString: string = properties.natural;
    if (naturalString) {
        switch (naturalString) {
            case "bare_rock":
                return new THREE.MeshPhysicalMaterial({
                    color: 0x595959,
                    roughness: 0.83,
                    metalness: 0.12,
                    reflectivity: 0.07,
                });
            case "water":
                return new THREE.MeshPhysicalMaterial({
                    color: 0xe2c3c,
                    roughness: 0.15,
                    metalness: 0.00,
                    reflectivity: 0.77,
                    // clearCoat: 0.61,
                    // clearCoatRoughness: 0.28
                });
            default:
                console.log(naturalString);
        }
    }

    return new THREE.MeshStandardMaterial({
        color: 0x00dd44
    });
}

export const multiBuilding = (multiPoly: PolygonCoordinates[], properties: any): THREE.Group => {
    const group = new THREE.Group();
    for (const poly of multiPoly) {
        // if (counter < 10) {
        //     counter++;
        //     console.log(poly[0])
        // }
        
        group.add(building(poly, properties));
    }

    return group;
}

export const building = (poly: PolygonCoordinates | any, properties: any) => {
    const mesh = new THREE.Mesh(
        buildingGeometry(poly, properties),
        [roofMaterial(properties), buildingMaterial(properties)]
    );

    // NOTE: kinda bs
    (mesh as any).meta = properties;

    return mesh;
}

export const buildingGeometry = (poly: PolygonCoordinates, properties: any) => {
    const height = properties.height;
    const minHeight = properties.min_height;
    if (height !== undefined) { // TODO: parse height if not number
        const low = minHeight !== undefined ? minHeight : 0;
        return extrudePolygon(
            poly,
            height,
            low
        );
    }

    const levels = properties['building:levels'];
    if (levels !== undefined) {
        const low = minHeight !== undefined ? minHeight : 0;
        return extrudePolygon(
            poly,
            levels * 3,
            low // is this ever a thing?
        );
    }

    return extrudePolygon(
        poly,
        3
    );
}

export const roofMaterial = (properties: any) => {
    const materialString: string = properties["roof:material"];
    if (materialString) {
        switch (materialString) {
            case "concrete":
                return new THREE.MeshPhysicalMaterial({
                    color: 0x595959,
                    roughness: 0.83,
                    metalness: 0.12,
                    reflectivity: 0.07,
                });
            case "glass":
                return new THREE.MeshPhysicalMaterial({
                    color: 0xe2c3c,
                    roughness: 0.15,
                    metalness: 0.00,
                    reflectivity: 0.77,
                    // clearCoat: 0.61,
                    // clearCoatRoughness: 0.28 // especially for roof glass
                });
            default:
                console.log(materialString);
        }
    }

    const colorString: string = properties["roof:colour"];
    if (colorString) {
        return new THREE.MeshStandardMaterial({ color: colorString });
    }

    return new THREE.MeshStandardMaterial();
}

export const buildingMaterial = (properties: any) => {
    const colorString = properties["building:colour"];
    if (colorString) {
        return new THREE.MeshStandardMaterial({ color: colorString });
    }

    return new THREE.MeshStandardMaterial();
}

export const shapeFromPolygon = (poly: PolygonCoordinates): THREE.Shape => {
    const outerRing: THREE.Vector2[] = [];

    let shape: THREE.Shape | null = null;

    let outerRingDone = true;
    for (const line of poly) {
        if (outerRingDone) {
            for (const coord of line) {
                // if (counter < 10) {
                //     counter++;
                //     console.log(coord)
                // }
                outerRing.push(new THREE.Vector2(coord[0], coord[1]));
            }
            shape = new THREE.Shape(outerRing);
        } else {
            const innerRing: THREE.Vector2[] = [];
            for (const coord of line) {
                innerRing.push(new THREE.Vector2(coord[0], coord[1]));
            }
            if (shape === null) { // will always be defined but ok
                throw new Error("no no no");
            }
            shape.holes.push(new THREE.Path(innerRing));
        }
        outerRingDone = false;
    }

    // hopefully there are coordinates, I'd like to know if there aren't sometimes
    if (shape === null) {
        throw new Error("no shape defined!");
    }

    return shape;
}

export const flatPolygon = (poly: PolygonCoordinates): THREE.BufferGeometry => {
    const shape = shapeFromPolygon(poly);
    const geometry = new THREE.ShapeBufferGeometry(shape);
    const positions = geometry.getAttribute("position");
    for (let i = 0; i < positions.count; i++) {
        // if (counter < 10) {
        //     console.log(positions)
        // }
        // const v = latLongToNav(
            // positions.getX(i), positions.getY(i), positions.getZ(i)
        // );
        // if (counter < 10) {
        //     console.log(v)
        // }
        // counter++;
        // positions.setXYZ(i, v.x, v.y, v.z); // z necessary?

        const v = lnglatToVector3([positions.getX(i), positions.getY(i), positions.getZ(i)])
        const roPos = new THREE.Vector3(v[0], v[1], v[2]).applyMatrix3(rotation)
        positions.setXYZ(i, roPos.x, roPos.y, roPos.z);
    }

    return geometry;
}

export const extrudeMaybeMultiPolygon = (poly: GeoJSON.Polygon | GeoJSON.MultiPolygon, height: number, minHeight?: number) => {
    if (poly.type === "MultiPolygon") {
        return extrudeMultiPolygon(poly.coordinates, height, minHeight);
    } else {
        return extrudePolygon(poly.coordinates, height, minHeight);
    }
}

export const multiFlatPolygon = (multiPoly: PolygonCoordinates[]): THREE.BufferGeometry => {
    const geom = new THREE.BufferGeometry();
    for (const polyCoords of multiPoly) {
        geom.merge(flatPolygon(polyCoords), 0);
    }

    console.log(geom);
    return geom;
}

export const extrudePolygon = (poly: PolygonCoordinates, height: number, minHeight?: number): THREE.ExtrudeBufferGeometry => {
    const min = minHeight ? minHeight : 0;

    const shape = shapeFromPolygon(poly);
    // console.log(shape)

    const geometry = new THREE.ExtrudeBufferGeometry([shape], {
        depth: height,
        bevelEnabled: false,
    });

    const positions = geometry.getAttribute("position");
    // console.log(positions)
    // for (let i = 0; i < positions.count; i++) {
    //     if (counter < 10) {
    //         console.log(positions)
    //     }
    //     const v = latLongToNav(
    //         positions.getX(i), positions.getY(i), positions.getZ(i) + min
    //     );
    //     if (counter < 10) {
    //         console.log(v)
    //     }
    //     counter++;
    //     positions.setXYZ(i, v.x, v.y, v.z); // z necessary?
    // }

    for (let i = 0; i < positions.count; i++) {
        if (counter < 10) {
            console.log(positions)
            console.log(height)
        }
        // const v = latLongToNav(
        //     positions.getX(i), positions.getY(i), positions.getZ(i) + min
        // );
        const v = lnglatToVector3([positions.getX(i), positions.getY(i), positions.getZ(i)])
        if (counter < 10) {
            console.log(v)
        }
        counter++;
        const roPos = new THREE.Vector3(v[0], v[1], v[2]).applyMatrix3(rotation)
        positions.setXYZ(i, roPos.x, roPos.y, roPos.z);
        // positions.setXYZ(i, v.x, v.y, v.z); // z necessary?
    }

    return geometry;
}

// who knows if this works right
export const extrudeMultiPolygon = (multiPoly: PolygonCoordinates[], height: number, minHeight?: number): THREE.BufferGeometry => {
    const geom = new THREE.BufferGeometry();
    for (const poly of multiPoly) {
        geom.merge(extrudePolygon(poly, height, minHeight), 0);
    }

    return geom;
}

export const polygon = (poly: GeoJSON.Polygon, material: any, extraHeight?: number) => {
    const height = extraHeight ? extraHeight : 0.0;
    const geometry = new THREE.Geometry();
    for (const line of poly.coordinates) {
        const vectors = [];
        for (const coord of line) {
            vectors.push(latLongToNav(coord[0], coord[1], height));
        }
        d3.pairs(vectors, (a, b) => {
            geometry.vertices.push(a, b);
        });
    }
    return new THREE.LineSegments(geometry, material);
}

export const lineString = (ls: GeoJSON.LineString, material: any) => {
    const geometry = new THREE.Geometry();
    const vectors = [];
    for (const coord of ls.coordinates) {
        vectors.push(latLongToNav(coord[0], coord[1], 0.0));
    }
    d3.pairs(vectors, (a, b) => {
        geometry.vertices.push(a, b);
    });

    return new THREE.LineSegments(geometry, material);
}

export const multiLineString = (mls: GeoJSON.MultiLineString, material: any) => {
    const geometry = new THREE.Geometry();
    for (const line of mls.coordinates) {
        const vectors = [];
        for (const coord of line) {
            vectors.push(latLongToNav(coord[0], coord[1], 0.0));
        }
        d3.pairs(vectors, (a, b) => {
            geometry.vertices.push(a, b);
        });
    }
    return new THREE.LineSegments(geometry, material);
}
