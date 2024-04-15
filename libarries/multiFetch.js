"use strict";const multiFetch=async(pathObject,path='.')=>{const fetchObject={};for(const key of Object.keys(pathObject)){const dataObject=pathObject[key];if(typeof dataObject==='object')
if(dataObject.length)fetchObject[key]=await fetch(dataObject[0],dataObject[2]).then(dataObject[1])
else fetchObject[key]=await multiFetch(dataObject,`${path}/${key}`);else if(typeof dataObject==="function"){fetchObject[key]=await fetch(`${path}/${key}`).then(dataObject)}}
return fetchObject}