precision highp float;
uniform float u_opacity;
varying vec4 v_color;
varying float vTime;
void main() {
    vec4 color = v_color;
    // 设置动画
    #ifdef ANIMATE
    // 如果时间大于1.0 或小于0则结束
    if (vTime > 1.0 || vTime < 0.0) {
        discard;
    }
    // 设置颜色的透明度
    color.a= color.a * vTime * 1.5;
    #endif
    // gl Frag Color
    gl_FragColor = color;
    // 设置颜色的透明度
    gl_FragColor.a =color.a*u_opacity;
}
