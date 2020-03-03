import Material from "./Material";

import * as picking_vert_glsl from '../../glsl/shader/picking.vert.glsl'
import * as picking_frag_glsl from '../../glsl/shader/picking.frag.glsl'

export default function PickingMaterial(options) {
  var material = new Material({
    uniforms: { u_zoom: { value: options.u_zoom || 1 } },
    vertexShader: picking_vert_glsl.default,
    fragmentShader: picking_frag_glsl.default,
    transparent: false
  });
  return material;
}
