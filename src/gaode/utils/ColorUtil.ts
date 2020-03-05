import Util from "./Util";

const RGB_REG = /[\s.,0-9]+/;

const createTmp = () => {
    const i = document.createElement('i');
    i.title = 'Web Color Picker';
    i.style.display = 'none';
    document.body.appendChild(i);
    return i;
}

const getValue = (start, end, percent, index) => {
    const value = start[index] + (end[index] - start[index]) * percent;
    return value;
}

const calColor= (colors, percent) => {
    if (Util.isNaN(percent) || !Util.isNumber(percent)) {
        percent = 0;
    }
    const steps = colors.length - 1;
    const step = Math.floor(steps * percent);
    const left = steps * percent - step;
    const start = colors[step];
    const end = step === steps ? start : colors[step + 1];
    return [
        getValue(start, end, left, 0),
        getValue(start, end, left, 1),
        getValue(start, end, left, 2),
        getValue(start, end, left, 3)
    ]
}

const rgb2arr = (str): Array<number> => {
    const arr = [];
    arr.push(parseInt(str.substr(1, 2), 16));
    arr.push(parseInt(str.substr(3, 2), 16));
    arr.push(parseInt(str.substr(5, 2), 16));
    return arr;
}

let iEl = null;
const colorCache = {}

class ColorUtil {

    toRGB(color) {
        if (color[0] === '#' && color.length === 7) {
            const colorArray = rgb2arr(color);
            colorArray.push(255);
            return colorArray;
        }
        if (!iEl) {
            iEl = createTmp();
        }
        let rst = null;
        if (colorCache[color]) {
            rst = colorCache[color];
        } else {
            iEl.style.color = color;
            rst = document.defaultView.getComputedStyle(iEl, '').getPropertyValue('color');
            const matchs = RGB_REG.exec(rst);
            console.log('matchs: ' + matchs)
            const cArray: Array<any> = matchs[0].split(/\s*,\s*/);
            console.log('cArray: ' + cArray)
            if (cArray.length === 4) {
                cArray[3] *= 255;
            }
            if (cArray.length === 3) {
                cArray.push(255);
            }
            colorCache[color] = cArray;
            rst = cArray;
        }
        console.log('rst: ');
        console.log(rst)
        return rst;
    }

    color2Arr(str) {
        const rgba = this.toRGB(str);
        return rgba.map(v => {
            return v / 255;
        })
    }

    color2RGBA(str) {
        return this.color2Arr(str);
    }

    rgb2arr: Function = rgb2arr;

    gradient(colors) {
        const points = [];
        if (Util.isString(colors)) {
            colors = colors.split('-');
        }
        Util.each(colors, color => {
            const colorArray = this.toRGB(color).map(e => e / 255);
            points.push(colorArray);
        })
        return percent => {
            return calColor(points, percent);
        }
    }
}

const colorUtil = new ColorUtil();

export default colorUtil;