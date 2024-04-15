"use strict";const zipConvert=(data,zip)=>{for(const key of Object.keys(data)){const dataObject=data[key];if(typeof dataObject==="object")
if(dataObject.length||dataObject.constructor.name==='Blob')zip.file(key,dataObject[0],{base64:!0})
else zip.folder(key,zipConvert(dataObject,zip.folder(key)));else if(typeof dataObject==="string")
zip.file(key,dataObject);}
return zip}
class ObjectToZip{constructor(zipObjectConstructor){this.zip=zipConvert(zipObjectConstructor,new JSZip())}
async generateAsync(){return this.zip.generateAsync({type:'blob'})}
download(fileName='content.zip'){this.generateAsync().then(content=>HTML.downloadFile(content,fileName))}}