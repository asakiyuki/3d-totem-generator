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

"use strict";
const zipConvert = (data, zip) => {
    for (const key of Object.keys(data)) {
        const dataObject = data[key];
        if (typeof dataObject === "object")
            if (dataObject.length || dataObject.constructor.name === 'Blob') zip.file(key, dataObject[0], { base64: true })
            else zip.folder(key, zipConvert(dataObject, zip.folder(key)));
        else if (typeof dataObject === "string")
            zip.file(key, dataObject);
    }
    return zip;
}
class ObjectToZip {
    constructor(zipObjectConstructor) {
        this.zip = zipConvert(zipObjectConstructor, new JSZip());
    }
    async generateAsync() {
        return this.zip.generateAsync({ type: 'blob' });
    }
    download(fileName = 'content.zip') {
        this.generateAsync().then(content => HTML.downloadFile(content, fileName));
    }
}