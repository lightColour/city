import Dot from "./Dot";
import Subtract from "./Subtract";
import Normalize from "./Normalize";
import Add from "./Add";
import set from "./Set";

var add = Add;
var normalize = Normalize;
var subtract = Subtract;
var dot = Dot;
var tmp = [
  0,
  0
];
function computeMiter(tangent, miter, lineA, lineB, halfThick) {
  add(tangent, lineA, lineB);
  normalize(tangent, tangent);
  set(miter, -tangent[1], tangent[0]);
  set(tmp, -lineA[1], lineA[0]);
  return halfThick / dot(miter, tmp);
};
function normal(out, dir) {
  set(out, -dir[1], dir[0]);
  return out;
};
function direction(out, a, b) {
  subtract(out, a, b);
  normalize(out, out);
  return out;
};

export default {
  computeMiter:computeMiter,
  direction:direction,
  normal:normal
}
