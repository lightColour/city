function normalize(out, a) {
    var x = a[0], y = a[1];
    var len = x * x + y * y;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out[0] = a[0] * len;
      out[1] = a[1] * len;
    }
    return out;
  }
  export default normalize;
  