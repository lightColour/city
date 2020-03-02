import AttributeBase from "./AttributeBase";
import Color from "./Color";
import Size from "./Size";
import Opacity from "./Opacity";
import Shape from "./Shape";
import Position from "./Position";
import _Symbol from "./_Symbol";
import Filter from "./Filter";

var Base = AttributeBase;
Base['Color'] = Color;
Base['Size'] = Size;
Base['Opacity'] = Opacity;
Base['Shape'] = Shape;
Base['Position'] = Position;
Base['Symbol'] = _Symbol;
Base['Filter'] = Filter;

export default Base
