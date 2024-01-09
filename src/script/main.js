"use strict";

{
    const totemData = {
        totem2D: false,
        lightTotem: false,
        skinTexture: undefined,
        textureType: 0,
        totemTexture: undefined,
        isSmallHand: false,
        isJava: false,
        packName: "Custom Totem Skin"
    };

    const _ = document;
    // Make all button has sound on click
    [..._.getElementsByClassName('toggle_element'), ..._.querySelectorAll('input[type="file"]')].forEach(e => e.addEventListener('click', () => clickSound('release.ogg')))
    const generateUUID = () => "$$$$$$$$-$$$$-$$$$-$$$$-$$$$$$$$$$$$".replaceAll(/\$/g, () => Math.floor(Math.random() * 16).toString(16));

    // Update all element 
    const visible = (elementID, isVisible) => {
        _.getElementById(elementID).style.display = isVisible ? '' : 'none';
    };

    const updateAllOnClick = () => {
        visible('light_totem_toggle', !(totemData.isJava || totemData.totem2D));
        visible('setTotemTexture', !totemData.isJava || totemData.totem2D);
        visible('totemTextureMode', !(totemData.isJava || totemData.totem2D));
        visible('skinTypeSelected', !(totemData.isJava || totemData.totem2D));
        visible('ipSkinE', !totemData.totem2D);
        _.getElementById('setTotemTexture').className = !(totemData.isJava || totemData.totem2D) ? 'selectedButton withImportTexture' : 'selectedButton withImportTexture hideImportButton';
        _.getElementById('importTexturePanel').className = (totemData.textureType === 2 || totemData.isJava || totemData.totem2D) ? 'btn' : 'btn inputDisable';
    }

    //Assets
    const clickSound = (soundFile) => {
        try {
            if (!soundFile) throw `soundFile is underfined!`; new Audio(`./src/sound/${soundFile}`).play();
        } catch (e) { console.error(e); }
    }

    const onChange = (elementID, callback) => _.getElementById(elementID).onchange = callback;

    const onClick = (elementID, callback, clicksound = 'release.ogg') => _.getElementById(elementID).onclick = (event) => {
        callback(event);
        if (typeof clicksound === 'boolean') {
            if (clicksound) clickSound('release.ogg')
        }
        else clickSound(clicksound)
    };

    const onImportFile = (elementID, callback, callbackWithURL = () => { }) => {
        onChange(elementID, ({ target: { files } }) => {
            const r = new FileReader();
            r.readAsDataURL(files[0]);
            r.addEventListener('load', async (g) => {
                const f = await fetch(g.target.result).then(v => v.blob());
                callbackWithURL(g.target.result);
                callback(f, files[0].type.match(/[a-z]+/g)[1]);
            });
        })
    }

    const importImage = (elementID, renderImageID, allowType, callback, onError = () => { }) => {
        onImportFile(elementID, (bFile, tFile) => {
            try {
                if (allowType.includes(tFile)) callback(bFile);
                else throw "err"
            } catch (e) {
                onError(e);
            }
        }, (u) => _.getElementById(renderImageID).src = u);
    }

    const radioToggle = (elementArrayID, callback) => {
        elementArrayID.forEach(oE => {
            onClick(oE, (e) => {
                if (e.target.className !== 'active') {
                    clickSound('release.ogg');
                    elementArrayID.forEach(iE => _.getElementById(iE).className = (e.target.id === iE) ? 'active' : '');
                    callback(elementArrayID.indexOf(e.target.id));
                    updateAllOnClick();
                }
            }, false);
        })
    };

    const toggleAction = (elementID, callback) => {
        onClick(elementID, (e) => {
            callback(e.target.checked);
            updateAllOnClick();
        }, false);
    };

    const downloadItem = (url, filename) => {
        const a = _.createElement('a');
        a.href = url;
        a.download = filename;
        _.body.appendChild(a);
        a.click();
        _.body.removeChild(a);
    }

    //File change action
    importImage('selectedSkinImage', 'skinRenderer', ['png'], (blob) => totemData.skinTexture = blob);
    importImage('selectedTextureImage', 'totemTextureRenderer', ['png', 'jpg', 'jpeg'], (blob) => totemData.totemTexture = blob);

    // Toggle
    toggleAction('notfor3dtotem', (e) => totemData.totem2D = e);
    toggleAction('glowTotemToggle', (e) => totemData.lightTotem = e);

    // Radio Toggle Action
    radioToggle(['automatic', 'vanilla_texture', 'custom_texture'], (i) => totemData.textureType = i);
    radioToggle(['setToBigHand', 'setToSmallHand'], (i) => totemData.isSmallHand = i === 1);
    radioToggle(['bedrockVersion', 'javaVersion'], (i) => totemData.isJava = i === 1);

    // Download Totem
    const drawPackIcon = (img, ctx, canvas, x) => {
        const d = 8 * x;
        canvas.setAttribute('height', d); canvas.setAttribute('width', d);
        ctx.clearRect(0, 0, d, d);
        ctx.drawImage(img, d, d, d, d, 0, 0, d, d);
        ctx.drawImage(img, 40 * x, d, d, d, 0, 0, d, d);
    }

    onClick('download', async () => {
        if ((totemData.skinTexture && !totemData.totem2D) || (totemData.totemTexture && totemData.totem2D)) {
            const canvas = _.getElementById('imagePreview'),
                canvasTexture = _.getElementById('reworkTexture'),
                ctx = canvas.getContext('2d'),
                ctxTexture = canvasTexture.getContext('2d'),
                img = _.getElementById('skinRenderer'),
                { naturalHeight: height, naturalWidth: width } = img;

            if ([64, 128].includes((height / width) * height) || totemData.totem2D) {
                canvasTexture.setAttribute('width', `${width}`);
                canvasTexture.setAttribute('height', `${height}`);
                ctxTexture.clearRect(0, 0, width, height);
                ctxTexture.globalAlpha = (totemData.lightTotem) ? 0.2 : 1;
                ctxTexture.drawImage(img, 0, 0, width, height, 0, 0, width, height);
                drawPackIcon(img, ctx, canvas, (width === 64 && height === 64) ? 1 : 2);

                canvas.toBlob(async (d) => {
                    const mczip = new JSZip();
                    if (totemData.isJava) {
                        const manifest = JSON.stringify(await fetch('./javaSrc/packs/pack.mcmeta').then(v => v.json()).then(v => {
                            v.pack.description = `Use your ${(totemData.totem2D) ? 'image' : 'skin'} to custom totem. Create by Asaki Zuki. Thanks for using ;-;`;
                            return v;
                        }));

                        mczip.file('pack.mcmeta', manifest);
                        const mc = mczip.folder('asses').folder('minecraft');
                        mc.folder('textures').folder('item').file('totem_of_undying.png', (totemData.totem2D) ? totemData.totemTexture : totemData.skinTexture);
                        mczip.file('pack.png', (totemData.totem2D) ? totemData.totemTexture : d);
                        if (!totemData.totem2D) mc.folder('models').folder('item').file('totem_of_undying.json',
                            await fetch(`./javaSrc/model/${(totemData.isSmallHand) ? 'slim' : 'default'}/totem_of_undying.json`).then(v => v.text()));
                        mczip.generateAsync({ type: 'blob' }).then(c => {
                            const i = URL.createObjectURL(c);
                            downloadItem(i, `${totemData.packName}.zip`);
                            URL.revokeObjectURL(i);
                        })
                    } else {
                        const manifest = JSON.stringify(await fetch('./bedrockSrc/packs/manifest.json').then(v => v.json()).then(v => {
                            v.header.name = totemData.packName;
                            v.header.uuid = generateUUID();
                            v.header.description = `Use your ${(totemData.notFor3DTotem) ? 'image' : 'skin'} to custom totem\nCreate by Asaki Zuki\nThanks for using ;-;`;
                            return v;
                        }));

                        mczip.file('manifest.json', manifest);
                        if (!totemData.totem2D) {
                            mczip.file('totem.png', totemData.skinTexture);
                            const a = mczip.folder('animations');
                            a.file('totem_firstperson.json', await fetch('./bedrockSrc/packs/animations/totem_firstperson.json').then(v => v.text()));
                            a.file('totem.json', await fetch('./bedrockSrc/packs/animations/totem.json').then(v => v.text()));
                            mczip.folder('attachables').file('totem.json', JSON.stringify(await fetch('./bedrockSrc/packs/attachables/totem.json').then(v => v.json()).then(v => {
                                v['minecraft:attachable'].description.materials.default = (totemData.lightTotem) ? 'blaze_head' : 'skeleton';
                                return v;
                            })));
                            mczip.folder('render_controllers').file('totem.render_controllers.json', await fetch('./bedrockSrc/packs/render_controllers/totem.render_controllers.json').then(v => v.text()));
                            const model = mczip.folder('models').folder('entity');
                            model.file('totem_left.geo.json', await fetch(`./bedrockSrc/model/${(totemData.isSmallHand) ? 'slim' : 'default'}/totem_left.geo.json`).then(v => v.text()));
                            model.file('totem_right.geo.json', await fetch(`./bedrockSrc/model/${(totemData.isSmallHand) ? 'slim' : 'default'}/totem_right.geo.json`).then(v => v.text()));
                        }
                        mczip.file('pack_icon.png', d);

                        if (([0, 2].includes(totemData.textureType) || !totemData.textureType) && totemData.textureType !== 1)
                            if ((totemData.textureType === 2 || totemData.totem2D) && totemData.totemTexture)
                                mczip.folder('textures').folder('items').file('totem.png', totemData.totemTexture);
                            else
                                mczip.folder('textures').folder('items').file('totem.png', d);

                        mczip.generateAsync({ type: "blob" }).then(c => {
                            const u = URL.createObjectURL(c);
                            downloadItem(u, `${totemData.packName}.mcpack`);
                            URL.revokeObjectURL(u);
                        })
                    }
                })
            }
        }
        else { }
    })

    // Packname

    _.getElementById('packName').oninput = (e) => totemData.packName = (e.target.value === '') ? "Custom Totem Skin" : e.target.value;

    // Draw toggle
    Array.from(_.getElementsByClassName('toggle')).forEach(v => v.innerHTML = `<div class="outside">
        <div class="btnBG"></div><svg width="3" height="15"
            style="position: absolute; top: 50%; transform: translateY(-50%); left: 13.5px;">
            <rect width="3" height="15" style="fill:rgb(255,255,255)"></rect>
        </svg> <svg width="17" height="17"
            style="position: absolute; top: 50%; transform: translateY(-50%); right: 6px;">
            <line x1="3" y1="0" x2="15" y2="0" style="stroke:rgb(65, 65, 65);stroke-width:6px" />
            <line x1="2" y1="3" x2="2" y2="15" style="stroke:rgb(65, 65, 65);stroke-width:3px" />
            <line x1="16" y1="3" x2="16" y2="15" style="stroke:rgb(65, 65, 65);stroke-width:4px" />
            <line x1="3" y1="16" x2="15" y2="16" style="stroke:rgb(65, 65, 65);stroke-width:4px" />
        </svg>
        <div class="button"></div>
    </div>`);

    updateAllOnClick();
}
