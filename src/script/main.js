"use strict";
/**
 * @typedef {import('../../libarries/quickElement')}
 * @typedef {import('../../libarries/jszip_object')}
 * @typedef {import('../../libarries/multiFetch')}
 * @typedef {import('../../libarries/XML')}
 */

{
    PageDisplay.setTitle('3D Totem Generator').setIcon('./src/texture/icon.webp').setGraph({ facebook: { title: '3D Totem Generator', type: 'website', description: 'Creating your own totem resource pack with player skin or picture in Minecraft', image: 'https://i.imgur.com/oGv0nbN.jpeg', url: 'https://asakiyuki.github.io/3d-totem-generator/' }, twitter: { card: 'summary_large_image', title: '3D Totem Generator', description: 'Creating your own totem resource pack with player skin or picture in Minecraft', image: 'https://i.imgur.com/oGv0nbN.jpeg', url: 'https://asakiyuki.github.io/3d-totem-generator/' } }).importCSS('./src/style/main.css')
}

const skinOptions = {
    isJava: false,
    packname: 'Pack name...'
};
const skinData = {};

new CreateNode(GetElement.id('packName')).setEvent({
    input: (e) => skinOptions.packname = (e.target.value === '') ? 'Pack name...' : e.target.value
})

const skinEditor = Dialog.setup(GetElement.id('skinEditorDialog'),
0.5,
(node, data) => {
    data.onShowDialog = true;
    skinEditor.onCloseCallback = data;
    node.getChild('title', (c) => c.setText(`Light Totem Editor - ${data.name}`));
    node.setAnimate([
        {
            css: {
                opacity: 0,
                transition: '0.5s'
            }
        },
        {
            css: { 
                opacity: 1
            }
        }
    ])
    new CreateNode(GetElement.id('skinEditorDialog')).setAnimate([
        {
            css: {
                top: '60%',
                transition: '0.5s'
            }
        },
        {
            css: {
                top: '50%'
            }
        }
    ]);

    new CreateNode(GetElement.id('editorImage')).setAttribute({
        src: data.data
    })

    const renderer = new CreateNode(GetElement.id('rendererElement')).
        setCSS({
            height: '100%',
            transform: 'translateX(-50%)translateY(-50%)'
        })
    const pxSelect = GetElement.id('imagePixelSelected');
    const hoverPixel = new CreateNode(GetElement.id('pixelHover')).setCSS({
        display: 'none',
        width: `calc(${(1 / data.skinSize) * 100}% - 2px)`,
        height: `calc(${(1 / data.skinSize) * 100}% - 2px)`
    })
    
    let zoom = 100,
        isDragging = false,
        rendererWidth = 0,
        rendererHeight = 0,
        offsetCurrent = {
            x: 0,
            y: 0
        },
        isDraw = false;

    const drawLight = (x, y, width, height, index, requireDraw = false) => {
        if (!data.lightPixel[`${index}`] || requireDraw) {
            data.lightPixel[`${index}`] = 1;
            new CreateNode('div').setCSS({
                pointerEvents: 'none',
                backgroundColor: 'rgba(0, 255, 255, 0.5)',
                position: 'absolute',
                width: `${width}%`,
                height: `${height}%`,
                left: `${x}%`,
                top: `${y}%`
            }).addToNode(pxSelect).setAttribute({ index, name: 'lightPixel' });
        }
    }
    
    for (const index of Object.keys(data.lightPixel).map(v => Number(v))) {
        const [x, y] = [index % data.skinSize, Math.floor(index / data.skinSize)],
            percentSizeX = (x / data.skinSize) * 100,
            percentSizeY = (y / data.skinSize) * 100;
        drawLight(percentSizeX, percentSizeY, (1 / data.skinSize) * 100, (1 / data.skinSize) * 100, index, true);
    };

    new CreateNode(pxSelect).setEvent({
        mousemove: e => {
            if (!data.onShowDialog) return;
            const { width, height } = pxSelect.getBoundingClientRect(),
                [x, y] = [Math.floor((e.offsetX / width) * data.skinSize), Math.floor((e.offsetY / height) * data.skinSize)],
                percentSizeX = (x / data.skinSize) * 100,
                percentSizeY = (y / data.skinSize) * 100;

            hoverPixel.setCSS({
                display: '',
                left: `${percentSizeX}%`,
                top: `${percentSizeY}%`
            });

            if (isDraw) {
                drawLight(percentSizeX, percentSizeY, (1 / data.skinSize) * 100, (1 / data.skinSize) * 100, x + y * data.skinSize);
            }
        },
        mousedown: e => {
            if (!data.onShowDialog) return;
            if (e.button === 0) {
                const { width, height } = pxSelect.getBoundingClientRect(),
                    [x, y] = [Math.floor((e.offsetX / width) * data.skinSize), Math.floor((e.offsetY / height) * data.skinSize)],
                    percentSizeX = (x / data.skinSize) * 100,
                    percentSizeY = (y / data.skinSize) * 100;

                drawLight(percentSizeX, percentSizeY, (1 / data.skinSize) * 100, (1 / data.skinSize) * 100, x + y * data.skinSize);
                isDraw = true
            };
        },
        mouseup: e => {
            if (!data.onShowDialog) return;
            if (e.button === 0) isDraw = false;
        },
        mouseleave: e => {
            if (!data.onShowDialog) return;
            isDraw = false;
        }
    })
    
    let isFirstTick = false;
    const editor = new CreateNode(GetElement.id('editor')).setEvent({
        contextmenu: e => {
            e.preventDefault();
        },
        mousedown: e => {
            if (!data.onShowDialog) return;
            if (e.button === 2) {
                editor.setCSS({
                    cursor: 'grabbing'
                });
                renderer.setCSS({
                    pointerEvents: 'none'
                });
                isDragging = true;
            };
            isFirstTick = true;
        },
        mouseup: e => {
            if (!data.onShowDialog) return;
            if (e.button === 2) {
                editor.setCSS({
                    cursor: 'default'
                });
                renderer.setCSS({
                    pointerEvents: 'auto'
                });
                isDragging = false;
            }
        },
        mousemove: e => {
            if (!data.onShowDialog) return;
            const [deltaX, deltaY] = [ offsetCurrent.x - e.offsetX, offsetCurrent.y - e.offsetY ]
            offsetCurrent = { x: e.offsetX ?? offsetCurrent.x, y: e.offsetY ?? offsetCurrent.y };
            if (isDragging && !isFirstTick) {
                renderer.setCSS({
                    transform: `translateX(calc(-50% + ${rendererWidth -= deltaX}px))translateY(calc(-50% + ${rendererHeight -= deltaY}px))`
                })
            }
            isFirstTick = false;
        },
        mouseleave: () => {
            if (!data.onShowDialog) return;
            editor.setCSS({
                cursor: 'default'
            });
            renderer.setCSS({
                pointerEvents: 'auto'
            });
            isDragging = false;
        },
        wheel: e => {
            if (!data.onShowDialog) return;
            if (e.ctrlKey) {
                e.preventDefault();
                hoverPixel.setCSS({
                    display: 'none'
                });
                renderer.setCSS({
                    height: `${zoom -= (e.deltaY / 10) + ((e.deltaY / 100) * (zoom / 20))}%`
                });
            }
        }
    });

    node.setEvent({
        contextmenu: e => e.preventDefault()
    });
},
(node, data) => {
    node.setAnimate([
        {
            css: {
                opacity: 0
            }
        }
    ])
    new CreateNode(GetElement.id('skinEditorDialog')).setAnimate([
        {
            duration: 500,
            css: {
                top: '60%'
            }
        }
    ], () => {
        skinEditor.hideDialog();
        Array.from(GetElement.name('lightPixel')).forEach(v => v.remove());
    });
    data.onShowDialog = false;
});
skinEditor.autoHideDialogOnClose = false;

Array.from(GetElement.class("dropdown-toggle")).forEach(node => {
    node.onclick = () => {
        ElementClass.toggle(node.parentNode, 'dropdown-active');
    }
})

const updateSkinCounter = () => {
    const skinAmount = Object.keys(skinData).length;
    GetElement.id('skinCounter').innerText = (skinAmount === 1) ? `1 skin imported!` : `${skinAmount} skins imported!`
}

const onFileImported = (data, name, imageData, isSize64) => {
    const skinID = Array.from({length: 15}, () => Math.floor(Math.random() * 15).toString(15)).join('');
    let isSmallHand = false;

    for (let i = 0; i < 48 * isSize64; i++) {
        const isSecond = Math.floor(i / (2 * isSize64)) > (12 * isSize64 - 1),
            [x, y] = [i % (2 * isSize64), Math.floor(i / (2 * isSize64)) - isSecond * (12 * isSize64)];
        if (isSmallHand = isSmallHand || (imageData[(((isSecond ? (20 * isSize64) : (52 * isSize64)) + y) * (64 * isSize64) + (isSecond ? (54 * isSize64) : (46 * isSize64)) + x) * 4 + 3] === 0)) break;
    }
    skinData[skinID] = {
        name: name.split('.')[0],
        data: data,
        smallHand: isSmallHand,
        skinSize: isSize64 * 64,
        onShowDialog: false,
        lightPixel: {}
    }
    updateSkinCounter();    

    const skinElement = new CreateNode('div')
    .insertToNode(GetElement.id('skin-items-container'), 0)
    .setAttribute({
        class: 'skin-items',
        skinID: skinID
    })
    .addHTML(/*html*/`
    <img id="skinPreview" draggable="false" src="${data}">
    <input id="skinName" value="${name.split('.')[0]}" type="text" class="skinName" placeholder="Your skin name">
    <button class="editTotemLightning squareButton" id="skinEditor" style="display: none;">
        <img src="./src/texture/pen.png">
    </button>
    <div class="skin-option-section">
        <button id="big_hand" class="skinTypeButton skinTypeButtonActive">BIG</button>
        <button id="small_hand" class="skinTypeButton">SMALL</button>
        <button id="remove" class="removeTotem squareButton">
            <img class="empty" src="./src/texture/is_empty.ico">
            <img class="bocchi" src="./src/texture/is_has_trash.ico">
        </button>
    </div>`).getChild('remove', (removeNode) => removeNode.setEvent({
        click: () => {
            delete skinData[skinID];
            updateSkinCounter();
            skinElement.setAnimate([
                {
                    duration: 150,
                    css: {
                        opacity: 0,
                        left: "-100%"
                    }
                },
                {
                    duration: 250,
                    css: {
                        height: '0px',
                        padding: '0px',
                        marginBottom: '0px'
                    }
                }
            ], (node) => node.release());
        }
    }))
    .setAnimate([
        {
            duration: 10,
            css: {
                overflow: 'hidden',
                padding: '0px',
                transition: '0.3s',
                height: '0px',
                opacity: 0
            }
        },
        {
            duration: 250,
            css: {
                height: '90px',
                padding: '',
                margin: ''
            }
        },
        {
            duration: 250,
            css: {
                opacity: 1
            }
        }
    ])

    ElementToggle.createRatio([
        GetElement.id('big_hand', skinElement.getNode()),
        GetElement.id('small_hand', skinElement.getNode())
    ], 'skinTypeButtonActive', 0, (e, i) => skinData[skinID].smallHand = (i === 1)).setValue(isSmallHand * 1);

    skinElement.getChild('skinEditor', (node) => {
        node.setEvent({
            click: () => skinEditor.show(skinData[skinID])
        })
    }).getChild('skinName', (node) => {
        node.setEvent({
            input: (e) => skinData[skinID].name = e.currentTarget.value
        })
    })
}

const onSkinImported = (data, name) => {
    ImageHandle.getImageData(data, (imageData, size) => {
        if ([64, 128].includes(size.width) && [64, 128].includes(size.height)) onFileImported(data, name, imageData, size.width / 64);
    })
}

ImportFile.setup(document.body,
onSkinImported,
'image/png', false, false, 80,
() => {
    new CreateNode(GetElement.id('drop-file-here')).setCSS({display: ''});
},
() => {
    new CreateNode(GetElement.id('drop-file-here')).setCSS({display: 'none'});
})
ImportFile.setup(GetElement.id('importImage'), onSkinImported, 'image/png', false, true, 80);

// new CreateNode(GetElement.id('platform')).setEvent({
//     click: e => GetElement.id('flatformText').innerText = (skinOptions.isJava = !skinOptions.isJava) ? 'Java' : 'Bedrock'
// })

new CreateNode(GetElement.id('download')).setEvent({
    click: () => {
        if (Object.keys(skinData).length === 0) alert('Please import at least 1 skin to download');
        else {
            const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            console.log(uuid);
            multiFetch({
                bedrockSrc: {
                    packs: {
                        'manifest.json': async (v) => {
                            const data = await v.json();
                            for (const dataKey of Object.keys(skinData)) {
                                data.subpacks.push(
                                    {
                                        folder_name: dataKey,
                                        name: skinData[dataKey].name,
                                        memory_tier: 1
                                    }
                                )
                            }
                            data.header.name = skinOptions.packname;
                            data.header.uuid = "$$$$$$$$-$$$$-$$$$-$$$$-$$$$$$$$$$$$".replaceAll(/\$/g, () => Math.floor(Math.random() * 16).toString(16));
                            return JSON.stringify(data);
                        },
                        animations: {
                            'totem_firstperson.json': async (v) => {
                                return JSON.stringify((await v.json()))
                            },
                            'totem.json': async (v) => {
                                return JSON.stringify((await v.json()))
                            }
                        },
                        attachables: {
                            'totem.json': async (v) => {
                                return JSON.stringify((await v.json()))
                            }
                        },
                        render_controllers: {
                            'totem.render_controllers.json': async (v) => {
                                return JSON.stringify((await v.json()))
                            }
                        }
                    },
                    model: {
                        'totem_left_slim.geo.json': async (v) => {
                            return JSON.stringify((await v.json()))
                        },
                        'totem_left_small.geo.json': async (v) => {
                            return JSON.stringify((await v.json()))
                        },
                        'totem_right_slim.geo.json': async (v) => {
                            return JSON.stringify((await v.json()))
                        },
                        'totem_right_small.geo.json': async (v) => {
                            return JSON.stringify((await v.json()))
                        }
                    }
                }
            }).then(v => {
                const subpacks = {};
                Object.keys(skinData).forEach(e => {
                    const data = skinData[e];
                    subpacks[e] = {
                        'totem.png': [ data.data.split(',')[1] ],
                        'texts': {
                            'en_US.lang': `item.totem.name=${data.name}`
                        }
                    };
                    if (data.smallHand) {
                        const totem = JSON.parse(v.bedrockSrc.packs.attachables['totem.json']);
                        totem['minecraft:attachable'].description.geometry = {
                            totem_left: 'geometry.asa_small_totem_left',
                            totem_right: 'geometry.asa_small_totem_right'
                        }
                        subpacks[e]['attachables'] = {
                            'totem.json': JSON.stringify(totem)
                        }
                    }
                });
                new ObjectToZip({
                    ...v.bedrockSrc.packs,
                    models: {
                        entity: {
                            ...v.bedrockSrc.model
                        }
                    },
                    subpacks
                }).download(`${skinOptions.packname}.mcpack`);
            })
        }
    }
})