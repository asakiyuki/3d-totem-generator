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
 * A XML handle
 */
class XML {
    /**
     * Convert XML to DOM object
     * @param {String} xml 
     * @returns {NodeList}
     */
    static parseString(xml) {
        return new CreateNode('div', GetElement.body()).addHTML(xml).removeChild().childNodes;
    }

    /**
     * Parse XML to Object
     * @param {String} xml
     * @returns {Object}
     */
    static toObject(xml) {
        const obj = {},
            nodes = Array.from((typeof xml === 'string') ? XML.parseString(xml) : xml).filter(n => n.nodeName[0] !== '#');
        for (const n of nodes)
            if (n.childNodes.length === 1) obj[n.nodeName.toLowerCase()] = n.innerText;
            else obj[n.nodeName.toLowerCase()] = XML.toObject(n.childNodes);
        return obj;
    }

    /**
     * Parse XML to ArrayObject
     * @param {String} xml
     * @returns {[...String[], ...Array[]]}
     */
    static toArray(xml) {
        const obj = [[], []],
            nodes = Array.from((typeof xml === 'string') ? XML.parseString(xml) : xml).filter(n => n.nodeName[0] !== '#');
        for (const n of nodes) {
            obj[0].push(n.nodeName.toLowerCase());
            if (n.childNodes.length === 1) obj[1].push(n.innerText);
            else obj[1].push(XML.toArray(n.childNodes));
        }
        return obj;
    }

    /**
     * Plist parse
     * @param {String} plist
     * @param {Boolean} isStart
     * @param {Object} extra
     * @returns {Object}
    */
    static plistParse(plist, isStart = true, plistKey = null) {
        const obj = {},
            arr = (isStart) ? XML.toArray(plist)[1][0][1][0][1] : plist[1];
        for (let i = 0; i < arr.length; i++) {
            const ind = arr[++i];
            if (typeof ind === 'object') obj[arr[i - 1]] = XML.plistParse(ind, false, ind[0]);
            else { 
                obj[arr[i - 1]] = (arr[i - 1] === 'textureRotated') ? plistKey[i] : ind;
            };
        }
        return obj;
    }
}