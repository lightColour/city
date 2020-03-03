import {AdditiveBlending} from "three";

import * as shader_line_vert_glsl from '../../glsl/shader/line.vert.glsl'
import * as shader_line_farg_glsl from '../../glsl/shader/line.frag.glsl'
import Material from "./Material";

function LineMaterial(options) {
    // 线材料
    var material = new Material({
        uniforms: {
            u_opacity: { value: options.u_opacity || 1 },
            u_time: { value: options.u_time || 0 },
            u_zoom: { value: options.u_zoom || 10 }
        },
        vertexShader: shader_line_vert_glsl.default,
        fragmentShader: shader_line_farg_glsl.default,
        transparent: true,
        blending: AdditiveBlending
    });
    return material;
}

export default {
    'lineMaterial':LineMaterial
}
