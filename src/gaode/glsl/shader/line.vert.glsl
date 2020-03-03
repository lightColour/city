precision highp float;
attribute vec4 a_color;
uniform float currentTime;
uniform float u_time;
varying float vTime;
varying vec4 v_color;
void main() {
    // mat模型视图投影
    // 投影矩阵
    // 模型查看矩阵
    mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
    // 设置颜色
    v_color = a_color;
    // 如果动画开启
    #ifdef ANIMATE
    // 当前时间
    vTime = 1.0- (mod(u_time*50.,3600.)- position.z) / 100.;
    #endif
    // gl位置
    gl_Position = matModelViewProjection * vec4(position.xy,0., 1.0);
}
