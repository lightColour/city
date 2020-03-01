import Util from "./Util";

const RGB_REG = /rgba?\([\s.,0-9]+)\)/;

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

const colorUtil = {
    toRGB: color => {
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
            const cArray: Array<any> = matchs[1].split(/\s*,\s*/);
            if (cArray.length === 4) {
                cArray[3] *= 255;
            }
        }
    }
}