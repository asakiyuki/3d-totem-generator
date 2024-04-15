class XML{static parseString(xml){return new CreateNode('div',GetElement.body()).addHTML(xml).removeChild().childNodes}
static toObject(xml){const obj={},nodes=Array.from((typeof xml==='string')?XML.parseString(xml):xml).filter(n=>n.nodeName[0]!=='#');for(const n of nodes)
if(n.childNodes.length===1)obj[n.nodeName.toLowerCase()]=n.innerText;else obj[n.nodeName.toLowerCase()]=XML.toObject(n.childNodes);return obj}
static toArray(xml){const obj=[[],[]],nodes=Array.from((typeof xml==='string')?XML.parseString(xml):xml).filter(n=>n.nodeName[0]!=='#');for(const n of nodes){obj[0].push(n.nodeName.toLowerCase());if(n.childNodes.length===1)obj[1].push(n.innerText);else obj[1].push(XML.toArray(n.childNodes))}
return obj}
static plistParse(plist,isStart=!0,plistKey=null){const obj={},arr=(isStart)?XML.toArray(plist)[1][0][1][0][1]:plist[1];for(let i=0;i<arr.length;i++){const ind=arr[++i];if(typeof ind==='object')obj[arr[i-1]]=XML.plistParse(ind,!1,ind[0]);else{obj[arr[i-1]]=(arr[i-1]==='textureRotated')?plistKey[i]:ind}}
return obj}}