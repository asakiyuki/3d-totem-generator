"use strict";const keybindList={ondown:{},onup:{},onpress:{}};class KeyBind{static createSetup(type,setup,callback){setup.key=setup?.key??'A';setup.shiftKey=setup?.shiftKey??!1;setup.altKey=setup?.altKey??!1;setup.ctrlKey=setup?.ctrlKey??!1;setup.metaKey=setup?.metaKey??!1;keybindList[`on${type}`][JSON.stringify(setup).toLowerCase()]=callback;return class{static editKey(editSetup){delete keybindList[`on${type}`][JSON.stringify(setup).toLowerCase()];setup.key=editSetup?.key??setup.key;setup.shiftKey=(editSetup?.shiftKey!==undefined)?editSetup.shiftKey:setup.shiftKey;setup.altKey=(editSetup?.altKey!==undefined)?editSetup.altKey:setup.altKey;setup.ctrlKey=(editSetup?.ctrlKey!==undefined)?editSetup.ctrlKey:setup.ctrlKey;setup.metaKey=(editSetup?.metaKey!==undefined)?editSetup.metaKey:setup.metaKey;keybindList[`on${type}`][JSON.stringify(setup).toLowerCase()]=callback;return this}
static editCallback(callback){keybindList[`on${type}`][JSON.stringify(setup).toLowerCase()]=callback;return this}
static getStrings(hideUndefined){const arr=[setup.key.toUpperCase(),undefined,undefined,undefined,undefined];if(setup.shiftKey)arr[1]='Shift'
if(setup.ctrlKey)arr[2]='Ctrl'
if(setup.meta)arr[3]='Window'
if(setup.altKey)arr[4]='Alt'
if(hideUndefined)return arr.filter(v=>v!==undefined)
return arr}}}}
document.addEventListener('keydown',e=>{(keybindList.ondown[JSON.stringify({key:e.key,shiftKey:e.shiftKey,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey}).toLowerCase()]??(()=>undefined))(e)});document.addEventListener('keyup',e=>{(keybindList.onup[JSON.stringify({key:e.key,shiftKey:e.shiftKey,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey}).toLowerCase()]??(()=>undefined))(e)});document.addEventListener('keypress',e=>{(keybindList.onpress[JSON.stringify({key:e.key,shiftKey:e.shiftKey,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey}).toLowerCase()]??(()=>undefined))(e)});class ElementEvent{static create(node,eventObject){Object.keys(eventObject).forEach(k=>node.addEventListener(k,eventObject[k]))}}
class GetElement{static id(id,node){if(node)return GetElement.selector(`[id="${id}"]`,node);return GetElement.selector(`[id="${id}"]`)}
static ids(ids,node){return Array.from(ids,v=>GetElement.id(v,node))}
static class(className,node){if(node)return node.getElementsByClassName(className);return document.getElementsByClassName(className)}
static tag(tagName,node){if(node)return node.getElementsByTagName(tagName);return document.getElementsByTagName(tagName)}
static name(name,node){if(node)return node.getElementsByName(name);return document.getElementsByName(name)}
static selector(selectorString,node){if(node)return node.querySelector(selectorString)
return document.querySelector(selectorString);}
static selectors(selectorString,node){if(node)return node.querySelectorAll(selectorString)
return document.querySelectorAll(selectorString);}
static body(){return this.selector('[class="body"]',document.body)}}
class ElementCSS{static set(node,styleObject){Object.keys(styleObject).forEach(k=>{node.style[k]=styleObject[k]})
return{get:(keys)=>ElementCSS.get(node,keys),set:(styleObject)=>ElementCSS.set(node,styleObject)}}
static get(node,keys){if(keys){const obj={};keys.forEach(k=>obj[k]=node.style[k]);return obj}else{return node.style}}}
class ElementAttribute{static set(node,attributeObject){Object.keys(attributeObject).forEach(k=>{node.setAttribute(k,attributeObject[k])})
return{set:(attributeObject)=>ElementAttribute.set(node,attributeObject),get:(keys)=>ElementAttribute.get(node,keys)}};static get(node,keys){let obj;if(keys.length===1)obj=node.getAttribute(keys[0]);else{obj={};keys.forEach(k=>obj[k]=node.getAttribute(k))}
return obj}}
class ElementClass{static add(node,className='classname'){node.classList.add(className);return{add:(className)=>ElementClass.add(node,className),remove:(className)=>ElementClass.remove(node,className),toggle:(className,replaceClassName)=>ElementClass.toggle(node,className,replaceClassName)}}
static remove(node,className='classname'){node.classList.remove(className);return{add:(className)=>ElementClass.add(node,className),remove:(className)=>ElementClass.remove(node,className),toggle:(className,replaceClassName)=>ElementClass.toggle(node,className,replaceClassName)}}
static get(node,classname){if(classname)return node.classList.includes(classname)
else return node.classList}
static toggle(node,className,replaceClassName){if(Array.from(node.classList).includes(className)){if(replaceClassName)ElementClass.add(node,replaceClassName)
ElementClass.remove(node,className);}else{if(replaceClassName)ElementClass.remove(node,replaceClassName)
ElementClass.add(node,className);}
return{add:(className)=>ElementClass.add(node,className),remove:(className)=>ElementClass.remove(node,className),toggle:(className,replaceClassName)=>ElementClass.toggle(node,className,replaceClassName)}}
static setNode(node){return{add:(className)=>ElementClass.add(node,className),remove:(className)=>ElementClass.remove(node,className),toggle:(className,replaceClassName)=>ElementClass.toggle(node,className,replaceClassName)}}}
class ElementToggle{static create(node,classEnabled,toggle,callback=()=>{},classDisabled='classname'){const att=ElementAttribute.set(node,{toggle:`${toggle}`});const cls=ElementClass.add(node,toggle?classEnabled:classDisabled);node.onclick=(event)=>{cls.toggle(classEnabled,classDisabled);callback(event,att.set({toggle:att.get(['toggle'])==='false'}).get(['toggle'])==='true')}
return class{static click(){node.click();return this}
static setValue(bool){if(att.get(['toggle'])!==`${bool}`)cls.toggle(classEnabled,classDisabled);att.set({toggle:`${bool}`});return this}}}
static createRatio(nodes,classEnabled,defaultToggleIndex=0,callback=(event=new Event(),index=0)=>{},classDisabled='classname'){nodes.forEach((node,index)=>{ElementClass.add(node,(defaultToggleIndex===index)?classEnabled:classDisabled);node.onclick=(event)=>{ElementClass.toggle(node,classEnabled,classDisabled);ElementClass.toggle(nodes[defaultToggleIndex],classEnabled,classDisabled);defaultToggleIndex=index;callback(event,index)}})
return class{static click(index){nodes[index]?.click();return this}
static setValue(index){ElementClass.toggle(nodes[index],classEnabled,classDisabled);ElementClass.toggle(nodes[defaultToggleIndex],classEnabled,classDisabled);defaultToggleIndex=index;return this}}}}
const dialogList=[]
KeyBind.createSetup('down',{key:'escape'},()=>{if(dialogList.length>0)dialogList[dialogList.length-1].hide();})
class Dialog{constructor(dialogNode,backgroundOpacity=1,onShow=()=>{},onClose=()=>{this.hideDialog()},closeNode){this.background=document.createElement('div');this.onCloseCallback=null;this.onShow=onShow;this.onClose=onClose;this.autoHideDialogOnClose=!0;if(dialogNode.constructor.name==='CreateNode')dialogNode=dialogNode.getNode()
if(dialogNode){this.background.appendChild(dialogNode);ElementCSS.set(dialogNode,{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%, -50%)'})};if(closeNode)closeNode.onclick=()=>this.hide();else GetElement.id('close',this.background).onclick=()=>this.hide();ElementCSS.set(this.background,{backgroundColor:`rgba(0, 0, 0, ${backgroundOpacity})`,position:'absolute',left:'0px',top:'0px',width:'100%',height:'100%',display:'none'})}
static setup(dialogNode,backgroundOpacity=1,onShow=()=>{},onClose=()=>{},closeNode){return new Dialog(dialogNode,backgroundOpacity,onShow,onClose,closeNode).create()}
create(){document.body.appendChild(this.background);return this}
show(data){this.onShow(new CreateNode(this.background),data);ElementCSS.set(this.background,{display:'',zIndex:10000+dialogList.length})
dialogList.push(this);return this}
hide(){this.onClose(new CreateNode(this.background),this.onCloseCallback);dialogList.pop(this);if(this.autoHideDialogOnClose)this.hideDialog();delete this.onCloseCallback;return this}
hideDialog(){ElementCSS.set(this.background,{display:'none'})}
editDialog(callback=()=>{}){callback(new CreateNode(this.background));return this}
release(){document.body.removeChild(this.background)}
setOnCloseData(data){this.onCloseCallback=data}}
class CreateNode{constructor(nodeOrTagName,appendNode){this.node=(typeof nodeOrTagName==='string')?document.createElement(nodeOrTagName):(nodeOrTagName.constructor.name==='CreateNode')?nodeOrTagName.getNode():nodeOrTagName;if(appendNode)this.addToNode(appendNode)}
setCSS(objectStyle){ElementCSS.set(this.node,objectStyle);return this}
setText(text){this.node.innerText=text;return this}
addText(text){this.node.innerText+=text;return this}
setHTML(htmlString){this.node.innerHTML=htmlString;return this}
addHTML(htmlString){this.node.innerHTML=htmlString;return this}
setAttribute(attributeObject){ElementAttribute.set(this.node,attributeObject);return this}
getAttribute(keys){return ElementAttribute.get(this.node,keys)}
setClass(classNameArray){const node=ElementClass.setNode(this.node);classNameArray.forEach(c=>node.add(c));return this}
getClass(classname){return ElementClass.get(this.node,classname)}
removeClass(classNameArray){const node=ElementClass.setNode(this.node);classNameArray.forEach(c=>node.remove(c));return this}
toggleClass(className,replaceClassName='classname'){const node=ElementClass.setNode(this.node);node.toggle(className,replaceClassName);return this}
setEvent(eventObject){ElementEvent.create(this.node,eventObject);return this}
setProperty(propertyObject=new HTMLElement()){Object.keys(propertyObject).forEach(k=>this.node[k]=propertyObject[k]);return this}
getNode(callback){if(!callback)return this.node;callback(this.node);return this}
addToNode(node){try{if(node.constructor.name==='CreateNode')node.getNode().appendChild(this.node);else node.appendChild(this.node)}catch(error){console.error(error)
console.log(node)}
return this}
appendNode(node){if(node.constructor.name==='Array')
node.forEach(n=>{if(n.constructor.name==='CreateNode')n.addToNode(this.node)
else this.node.appendChild(n);})
else if(node.constructor.name==='CreateNode')node.addToNode(this.node)
else this.node.appendChild(node);return this}
release(){this.node.remove()}
removeChild(node=undefined){let n;if(node)n=this.node.removeChild(node)
else n=Array.from({length:this.node.childNodes.length},v=>this.node.removeChild(this.node.childNodes[0]));return{parent:this,childNodes:n}}
clone(includeChildNodes=!0){const cloneNode=new CreateNode(this.node.cloneNode());if(includeChildNodes)this.node.childNodes.forEach(n=>cloneNode.appendNode(new CreateNode(n).clone()));return cloneNode}
visibleToggle(){this.node.style.display=(this.node.style.display==='none')?'':'none';return this}
getChild(id,callback=()=>{}){callback(new CreateNode(GetElement.id(id,this.node)));return this}
setAnimate(animateObject,callbackOnEnd=()=>{}){(async()=>{for(const v of animateObject){await new Promise(res=>{this.setCSS(v.css);setTimeout(res,v?.duration??0)})}
callbackOnEnd(this)})();return this}
insertNode(node,index){node=new CreateNode(node).getNode();const childNodes=Array.from(this.node.childNodes).filter(n=>n.nodeName[0]!=='#');this.node.insertBefore(node,childNodes[index]);return this}
insertToNode(node,index){new CreateNode(node).insertNode(this.node,index);return this}}
class PageDisplay{static setTitle(titleString='Page'){document.title=titleString;return this}
static importDialogFile(path=''){fetch(path).then(v=>v.text()).then(v=>{new CreateNode('div').setCSS({display:'none'}).addHTML(v).addToNode(document.body)});return this}
static importCSS(cssPath){if(cssPath){if(typeof cssPath==='string')new CreateNode('link').setProperty({rel:'stylesheet',href:cssPath}).addToNode(document.head)
else cssPath.forEach(v=>new CreateNode('link').setProperty({rel:'stylesheet',href:v}).addToNode(document.head))}
return this}
static setIcon(iconPath){if(GetElement.selector('[rel="icon"]'))GetElement.selector('[rel="icon"]').href=iconPath;else new CreateNode('link').setAttribute({rel:'icon',type:'image/x-icon',href:iconPath}).addToNode(document.head)
return this}
static setGraph(graphContent={facebook:{type:undefined,title:undefined,description:undefined,image:undefined,url:undefined},twitter:{card:undefined,title:undefined,description:undefined,image:undefined,url:undefined}}){const{facebook,twitter}=graphContent;if(facebook?.type)new CreateNode('meta').setAttribute({property:'og:type',content:facebook.type}).addToNode(document.head);if(facebook?.title)new CreateNode('meta').setAttribute({property:'og:title',content:facebook.title}).addToNode(document.head);if(facebook?.description)new CreateNode('meta').setAttribute({property:'og:description',content:facebook.description}).addToNode(document.head);if(facebook?.image)new CreateNode('meta').setAttribute({property:'og:image',content:facebook.image}).addToNode(document.head);if(facebook?.url)new CreateNode('meta').setAttribute({property:'og:url',content:facebook.url}).addToNode(document.head);if(twitter?.card)new CreateNode('meta').setAttribute({property:'twitter:card',content:facebook.card}).addToNode(document.head);if(twitter?.title)new CreateNode('meta').setAttribute({property:'twitter:title',content:facebook.title}).addToNode(document.head);if(twitter?.description)new CreateNode('meta').setAttribute({property:'twitter:description',content:facebook.description}).addToNode(document.head);if(twitter?.image)new CreateNode('meta').setAttribute({property:'twitter:image',content:facebook.image}).addToNode(document.head);if(twitter?.url)new CreateNode('meta').setAttribute({property:'twitter:url',content:facebook.url}).addToNode(document.head);return this}}
const DownloadFile=(fileURL,fileName='content.txt',isTextFile)=>{let url=fileURL;if(typeof fileURL==='object')url=URL.createObjectURL(fileURL);if(isTextFile)url=`data:text/plain;charset=utf-8,${encodeURIComponent(fileURL)}`
new CreateNode('a').setCSS({display:'none'}).setProperty({href:url,download:fileName}).getNode((node)=>{node.click();URL.revokeObjectURL(url)}).release()}
class ImportFile{static setup(node,callback=()=>{},allowTypes=undefined,notBase64URL=!1,resetInput=!0,delayPerFile=0,dragEnterCallback=()=>{},dragLeaveCallback=()=>{}){const importEvent=f=>{if(allowTypes===undefined||allowTypes.includes(f.type)||allowTypes===f.type){const r=new FileReader();r.onload=(e)=>callback((notBase64URL)?e.currentTarget.result.split(',')[1]:e.currentTarget.result,f.name,f.type);r.readAsDataURL(f)}}
node=new CreateNode(node);if(node.setAttribute({multiple:!0}).getAttribute(['type'])==='file')node.setEvent({change:(e)=>{(async()=>{for(const f of Array.from(e.currentTarget.files)){await new Promise(res=>{importEvent(f);setTimeout(res,delayPerFile)})}})();if(resetInput)e.currentTarget.value=''}})
else node.setEvent({dragover:(e)=>e.preventDefault(),drop:(e)=>{e.preventDefault();e.stopPropagation();(async()=>{for(const f of Array.from(e.dataTransfer.files)){await new Promise(res=>{importEvent(f);setTimeout(res,delayPerFile)})}})()}})
return new CreateNode(node).setEvent({dragover:()=>dragEnterCallback(new CreateNode(node)),drop:()=>dragLeaveCallback(new CreateNode(node)),dragleave:(e)=>{if(e.clientX===0&&e.clientY===0)dragLeaveCallback(new CreateNode(node))},});}}
class ImageHandle{static getImageData(urlSrc,callback,maxHeightSize){const img=new Image();img.src=urlSrc;img.onload=()=>{if(maxHeightSize===undefined||maxHeightSize<=img.height)maxHeightSize=img.height;new CreateNode('canvas').setProperty({width:img.width*(maxHeightSize/img.height),height:img.height*(maxHeightSize/img.height)}).getNode(c=>{const ctx=c.getContext('2d');ctx.drawImage(img,0,0,img.width,img.height,0,0,c.width,c.height);callback(ctx.getImageData(0,0,img.width*(maxHeightSize/img.height),img.height*(maxHeightSize/img.height)).data,{width:c.width,height:c.height});img.remove()}).release()}}
static dataToImage(imageData,size={width:64,height:64},callback=()=>{}){new CreateNode('canvas').setProperty(size).getNode(c=>{const data=new ImageData(size.width,size.height,{colorSpace:'srgb'});data.data.set(imageData);c.getContext('2d').putImageData(data,0,0);callback(c.toDataURL().split(',')[1])})}
static getPixel(arrayBuffer,index){arrayBuffer=new Uint8Array(arrayBuffer);index*=4;return[arrayBuffer[index],arrayBuffer[index+1],arrayBuffer[index+2],arrayBuffer[index+3]]}
static forEachFixel(array,callback){array=Array.from(array);for(let i=0;i<array.length/4;i++){const no=i*4;callback(array[no],array[no+1],array[no+2],array[no+3],i)}}}
class Handle{static arrayToString(array){return new TextDecoder().decode(new Uint8Array(array))}}
class HTML{static pageDisplay=PageDisplay;static keyBind=KeyBind;static event=ElementEvent;static get=GetElement;static CSS=ElementCSS;static attribute=ElementAttribute;static class=ElementClass;static toggle=ElementToggle;static dialog=Dialog;static create=CreateNode;static importFile=ImportFile;static imageHandle=ImageHandle;static handle=Handle;static downloadFile=DownloadFile}