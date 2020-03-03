import Material from "./Material";
import * as shader_polygon_vert_glsl from '../../glsl/shader/polygon.vert.glsl'
import * as shader_polygon_frag_glsl from '../../glsl/shader/polygon.frag.glsl'

function PolygonMaterial(options) {
  var material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity || 1 },
      u_texture: { value: options.u_texture },
      u_time: { value: options.u_time || 0 },
      u_zoom: { value: options.u_zoom || 0 },
      u_baseColor: {
        value: options.u_baseColor || [
          1,
          0,
          0,
          1
        ]
      },
      u_brightColor: {
        value: options.u_brightColor || [
          1,
          0,
          0,
          1
        ]
      },
      u_windowColor: {
        value: options.u_windowColor || [
          1,
          0,
          0,
          1
        ]
      },
      u_near: { value: options.u_near || 0 },
      u_far: { value: options.u_far || 1 }
    },
    vertexShader: shader_polygon_vert_glsl.default,
    fragmentShader: shader_polygon_frag_glsl.default,
    transparent: true,
    defines: { TEXCOORD_0: !!options.u_texture }
  });
  return material;
}
export default PolygonMaterial;
