function aProjectFlat(lnglat) {
    var maxs = 85.0511287798;
    var lat = Math.max(Math.min(maxs, lnglat[1]), -maxs);
    var scale = 256 << 20;
    var d = Math.PI / 180;
    var x = lnglat[0] * d;
    var y = lat * d;
    y = Math.log(Math.tan(Math.PI / 4 + y / 2));
    var a = 0.5 / Math.PI, b = 0.5, c = -0.5 / Math.PI;
    d = 0.5;
    x = scale * (a * x + b) - 215440491;
    y = scale * (c * y + d) - 106744817;
    return {
        x: x,
        y: y
    };
}
export default aProjectFlat
