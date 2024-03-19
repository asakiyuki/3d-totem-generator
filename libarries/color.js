// MIT License

// Copyright (c) 2023 Asaki Zuki

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * @typedef {Object} ColorObject
 * @property {Number} R
 * @property {Number} G
 * @property {Number} B
 */

/**
 * A color handle
 * @class {Color}
 */
class Color {
    /**
     * Get distance of rgb1 and rgb2
     * @static
     * @param {ColorObject} rgb1
     * @param {ColorObject} rgb2
     * @return {Number} 
     * @memberof Color
     */
    static distance(rgb1, rgb2) {
        if (typeof rgb1 === 'string') rgb1 = this.hexToRGB(rgb1);
        if (typeof rgb2 === 'string') rgb2 = this.hexToRGB(rgb2);
        return (rgb1.R - rgb2.R) ** 2 + (rgb1.G - rgb2.G) ** 2 + (rgb1.B - rgb2.B) ** 2;
    }
    /**
     * Return closest color
     * @static
     * @param {ColorObject|string} target 
     * @param {ColorObject[]|string[]} colors
     * @returns {ColorObject} 
     * @memberof Color
     */
    static closest(target, colors) {
        return colors[this.closestIndex(target, colors)];
    }

    /**
     * Return the index of closest color in colors
     * @static
     * @param {ColorObject|string} target 
     * @param {ColorObject[]|string[]} colors
     * @returns {ColorObject} 
     * @memberof Color
     */
    static closestIndex(target, colors) {
        const colorDistance = [];
        const rgbColorList = Array.from(colors,)
        for (const c of colors) colorDistance.push(this.distance(target, c));
        return colorDistance.indexOf(Math.min(...colorDistance));
    }

    /**
     * Return greenest color
     * @static
     * @param {ColorObject|string} target 
     * @param {ColorObject[]|string[]} colors
     * @returns {ColorObject} 
     * @memberof Color
     */
    static greenest(target, colors) {
        return colors[this.closestIndex(target, colors)];
    }

    /**
     * Return the index of greenest color in colors
     * @static
     * @param {ColorObject|string} target 
     * @param {ColorObject[]|string[]} colors
     * @returns {ColorObject} 
     * @memberof Color
     */
    static greenestIndex(target, colors) {
        const colorDistance = [];
        for (const c of colors) colorDistance.push(this.distance(target, c));
        return colorDistance.indexOf(Math.max(...colorDistance));
    }

    /**
     * Convert HEX to RGB color
     * @static
     * @param {string} hex
     * @returns {ColorObject} 
     * @memberof Color
     */
    static hexToRGB(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            const bigInt = parseInt(hex, 16);
            return {
                R: Math.floor((bigInt >> 8 & 15) / 15 * 255),
                G: Math.floor((bigInt >> 4 & 15) / 15 * 255),
                B: Math.floor((bigInt & 15) / 15 * 255)
            }
        }
        else if (hex.length === 6) {
            const bigInt = parseInt(hex, 16)
            return {
                R: bigInt >> 16 & 255,
                G: bigInt >> 8 & 255,
                B: bigInt & 255
            };
        }
    }

    /**
     * Convert RGB to HEX color
     * @static
     * @param {ColorObject} rgb
     * @returns {String}
     * @memberof Color
     */
    static rgbToHex(rgb) {
        return `#${rgb.R.toString(16).padStart(2, '0')}${rgb.G.toString(16).padStart(2, '0')}${rgb.B.toString(16).padStart(2, '0')}`.toUpperCase();
    }
}
