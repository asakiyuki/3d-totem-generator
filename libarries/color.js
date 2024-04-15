class Color{static distance(rgb1,rgb2){if(typeof rgb1==='string')rgb1=this.hexToRGB(rgb1);if(typeof rgb2==='string')rgb2=this.hexToRGB(rgb2);return(rgb1.R-rgb2.R)**2+(rgb1.G-rgb2.G)**2+(rgb1.B-rgb2.B)**2}
static closest(target,colors){return colors[this.closestIndex(target,colors)]}
static closestIndex(target,colors){const colorDistance=[];const rgbColorList=Array.from(colors,)
for(const c of colors)colorDistance.push(this.distance(target,c));return colorDistance.indexOf(Math.min(...colorDistance))}
static greenest(target,colors){return colors[this.closestIndex(target,colors)]}
static greenestIndex(target,colors){const colorDistance=[];for(const c of colors)colorDistance.push(this.distance(target,c));return colorDistance.indexOf(Math.max(...colorDistance))}
static hexToRGB(hex){hex=hex.replace('#','');if(hex.length===3){const bigInt=parseInt(hex,16);return{R:Math.floor((bigInt>>8&15)/15*255),G:Math.floor((bigInt>>4&15)/15*255),B:Math.floor((bigInt&15)/15*255)}}else if(hex.length===6){const bigInt=parseInt(hex,16)
return{R:bigInt>>16&255,G:bigInt>>8&255,B:bigInt&255}}}
static rgbToHex(rgb){return `#${rgb.R.toString(16).padStart(2, '0')}${rgb.G.toString(16).padStart(2, '0')}${rgb.B.toString(16).padStart(2, '0')}`.toUpperCase()}}