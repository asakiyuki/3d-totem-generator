const totemData = {
    isSmallHand: false,
    packName: "Custom Totem Skin",
    textureType: 0,
    totemTexture: undefined,
    notFor3DTotem: false,
    isJava: false,
    skin: undefined,
    isPlayerName: false,
    lastSearch: '',
    isWait: false
};
const _ = document;
{
    clickSound = (soundFile) => {
        try {
            if (!soundFile) throw `soundFile is underfined!`
            new Audio(`./src/sound/${soundFile}`).play();
        } catch (e) { console.error(e); }
    }
    generateUUID = () => {
        return "$$$$$$$$-$$$$-$$$$-$$$$-$$$$$$$$$$$$"
            .replaceAll(/\$/g,
                () => Math.floor(Math.random() * 16).toString(16));
    }
    _.getElementById('selectedTextureImage').onchange = (e) => {
        const r = new FileReader(), f = e.target.files[0];
        if (['png', 'jpg', 'jpeg'].includes(f.type.match(/[a-z]+/g)?.[1])) {
            totemData.totemTexture = f;
            console.log(f);
            r.readAsDataURL(f);
            _.getElementById('filename2').innerText = f.name;
            r.addEventListener('load', (g) => {
                fetch(g.target.result).then(v => v.blob()).then(v => _.getElementsByClassName('previewImage')[1].src = URL.createObjectURL(v));
            });
        } else {
            alert('Only png, jpg, jpeg can be used!')
            clickSound('snes_pop.ogg');
        }
    }
    _.getElementById("selectedSkinImage").onchange = (e) => {
        const f = e.target.files[0];
        if (f.type.match(/[a-z]+/g)?.[1] === 'png') {
            const r = new FileReader();
            r.readAsDataURL(f);
            r.addEventListener('load', async (g) => {
                const b = await (await fetch(g.target.result)).blob(),
                    img = _.getElementsByClassName('previewImage')[0]
                img.src = URL.createObjectURL(b);

                await new Promise(res => setTimeout(res, 2));
                totemData.skin = f;
                _.getElementById('filename').innerText = f.name;
            });
        } else {
            alert('Only png can be used!')
            clickSound('snes_pop.ogg');
        }
    }
    {
        $("#setToSmallHand").mouseup(() => {
            if (!totemData.isSmallHand) clickSound('release.ogg');
            totemData.isSmallHand = true;
            updateHand();
        })
        $("#setToBigHand").mouseup(() => {
            if (totemData.isSmallHand) clickSound('release.ogg');
            totemData.isSmallHand = false;
            updateHand();
        })
        $("#bedrockVersion").mouseup(() => {
            if (totemData.isJava) clickSound('release.ogg');
            totemData.isJava = false;
            updateMCVersion();
        })
        $("#javaVersion").mouseup(() => {
            if (!totemData.isJava) clickSound('release.ogg');
            totemData.isJava = true;
            updateMCVersion();
        })
        $("#automatic").mouseup(() => {
            if (totemData.textureType !== 0) clickSound('release.ogg');
            totemData.textureType = 0;
            updateTexture();
        })
        $("#vanilla_texture").mouseup(() => {
            if (totemData.textureType !== 1) clickSound('release.ogg');
            totemData.textureType = 1;
            updateTexture();
        })
        $("#custom_texture").mouseup(() => {
            if (totemData.textureType !== 2) clickSound('release.ogg');
            totemData.textureType = 2;
            updateTexture();
        })
    }

    getSkinByPlayerName = async () => {
        try {
            await new Promise(r => setTimeout(r, 100));
            totemData.isWait = true;
            const p = _.getElementById('playerName').value;
            if (p.replaceAll(' ', '').length !== 0) {
                if (!(p.length >= 3 && p.length <= 16) || p.replaceAll(/([A-Za-z0-9]|_)+/g, '').length !== 0) {
                    alert('Character limited (3-16)!\nYou can fill with A-Z letter, numbers, and underscore \'_\'!')
                    totemData.isWait = false;
                    clickSound('snes_pop.ogg');
                }
                else {
                    if (totemData.lastSearch !== p) {
                        totemData.lastSearch = p;
                        const getByPlayerName = JSON.parse((await (await fetch(`https://api.allorigins.win/get?url=https://api.mojang.com/users/profiles/minecraft/${p}`)).json()).contents);
                        if (getByPlayerName.id) {
                            const getPlayer = JSON.parse(atob(JSON.parse((await (await fetch(`https://api.allorigins.win/get?url=https://sessionserver.mojang.com/session/minecraft/profile/${getByPlayerName.id}`)).json()).contents).properties[0].value)).textures.SKIN;
                            await fetch((await (await fetch(`https://api.allorigins.win/get?url=${getPlayer.url}`)).json()).contents).then(k => k.blob()).then(k => {
                                totemData.skin = k;
                                totemData.isSmallHand = getPlayer?.metadata?.model === 'slim';
                                updateHand();
                                _.getElementsByClassName('previewImage')[0].src = URL.createObjectURL(k);
                            });
                            totemData.isWait = false;
                        } else {
                            totemData.isWait = false;
                            alert(`Player ${p} does not exist!`)
                            clickSound('snes_pop.ogg');
                        }
                    } else
                        totemData.isWait = false;
                }
            } else {
                totemData.isWait = false;
                alert(`You haven't fill with player's name!`)
                clickSound('snes_pop.ogg');
            }
        } catch (e) {
            alert(`Error: ${e}\n${e.stack}`);
            clickSound('snes_pop.ogg');
        }
    }
    _.getElementById('getSkin').onclick = (e) => {
        clickSound('release.ogg');
        getSkinByPlayerName()
    }

    _.getElementById('playerName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) getSkinByPlayerName();
    })

    _.getElementById('usePlayerName').onclick = async (e) => {
        clickSound('release.ogg');
        totemData.isPlayerName = e.target.checked;
        _.getElementById('importSkinElement').style.display = (e.target.checked) ? 'none' : '';
        _.getElementById('inputText').style.display = (e.target.checked) ? '' : 'none';
    }

    _.getElementById('download').onclick = async () => {
        clickSound('release.ogg');
        if (totemData.isWait) { alert('Wait me!'); return }
        await new Promise(r => setTimeout(r, 100));
        const canvas = _.getElementById('imagePreview'), ctx = canvas.getContext('2d'), img = _.getElementsByClassName('previewImage')[0];
        const { naturalHeight, naturalWidth } = img;
        if ((totemData.skin && !totemData.notFor3DTotem) || (totemData.totemTexture && totemData.notFor3DTotem)) {
            if (!totemData.notFor3DTotem) {
                if (![64, 128].includes(naturalHeight) && ![64, 128].includes(naturalWidth)) {
                    alert('Your image may not Minecraft skin!');
                    clickSound('snes_pop.ogg');
                    return;
                }
                if (naturalHeight === 64 && naturalWidth === 64) {
                    canvas.setAttribute('width', '8'); canvas.setAttribute('height', '8');
                    ctx.clearRect(0, 0, 8, 8);
                    ctx.drawImage(img, 8, 8, 8, 8, 0, 0, 8, 8);
                    ctx.drawImage(img, 40, 8, 8, 8, 0, 0, 8, 8);
                } else {
                    canvas.setAttribute('width', '16'); canvas.setAttribute('height', '16');
                    ctx.clearRect(0, 0, 16, 16);
                    ctx.drawImage(img, 16, 16, 16, 16, 0, 0, 16, 16);
                    ctx.drawImage(img, 80, 16, 16, 16, 0, 0, 16, 16);
                }
            }

            canvas.toBlob(async (i) => {
                if (totemData.isJava) {
                    let manifest = await (await fetch('./javaSrc/packs/pack.mcmeta')).json();
                    manifest.pack.description = `Use your ${(totemData.notFor3DTotem) ? 'image' : 'skin'} to custom totem. Create by Asaki Zuki. Thanks for using ;-;`;
                    manifest = JSON.stringify(manifest, null, 4);

                    const zip = new JSZip();
                    zip.file('pack.mcmeta', manifest);
                    const mc = zip.folder('assets').folder('minecraft');
                    mc.folder('textures').folder('item').file('totem_of_undying.png', totemData[(totemData.notFor3DTotem) ? "totemTexture" : "skin"]);
                    zip.file('pack.png', (totemData.notFor3DTotem) ? totemData.totemTexture : i);

                    if (!totemData.notFor3DTotem) {
                        const model = await (await fetch(`./javaSrc/model/${(totemData.isSmallHand) ? 'slim' : 'default'}/totem_of_undying.json`)).text();
                        mc.folder('models').folder('item').file('totem_of_undying.json', model);
                    }

                    zip.generateAsync({ type: "blob" }).then(c => {
                        const a = _.createElement('a');
                        a.setAttribute('href', URL.createObjectURL(c));
                        a.setAttribute('download', `${totemData.packName}.zip`);
                        _.body.appendChild(a);
                        a.click();
                        _.body.removeChild(a);
                    })
                }
                else {
                    let manifest = await (await fetch('./bedrockSrc/packs/manifest.json')).json();
                    manifest.header.name = totemData.packName;
                    manifest.header.uuid = generateUUID();
                    manifest.header.description = `Use your ${(totemData.notFor3DTotem) ? 'image' : 'skin'} to custom totem\nCreate by Asaki Zuki\nThanks for using ;-;`;
                    manifest = JSON.stringify(manifest, null, 4);

                    const zip = new JSZip();
                    zip.file('manifest.json', manifest);

                    if (!totemData.notFor3DTotem) {
                        const renderController = await (await fetch('./bedrockSrc/packs/render_controllers/totem.render_controllers.json')).text(),
                            totem = await (await fetch('./bedrockSrc/packs/attachables/totem.json')).text(),
                            totemFirstPerson = await (await fetch('./bedrockSrc/packs/animations/totem_firstperson.json')).text(),
                            totemAnims = await (await fetch('./bedrockSrc/packs/animations/totem.json')).text(),
                            totemModelLeft = await (await fetch(`./bedrockSrc/model/${(totemData.isSmallHand) ? 'slim' : 'default'}/totem_left.geo.json`)).text(),
                            totemModelRight = await (await fetch(`./bedrockSrc/model/${(totemData.isSmallHand) ? 'slim' : 'default'}/totem_right.geo.json`)).text();
                        zip.file('pack_icon.png', i, { base64: true });
                        zip.file('totem.png', totemData.skin, { base64: true });
                        const animations = zip.folder('animations');
                        animations.file('totem_firstperson.json', totemFirstPerson);
                        animations.file('totem.json', totemAnims);
                        zip.folder('attachables').file('totem.json', totem);
                        zip.folder('render_controllers').file('totem.render_controllers.json', renderController);
                        const model = zip.folder('models').folder('entity');
                        model.file('totem_left.geo.json', totemModelLeft);
                        model.file('totem_right.geo.json', totemModelRight);
                    } else
                        zip.file('pack_icon.png', totemData.totemTexture);

                    if (([0, 2].includes(totemData.textureType) || !totemData.totemTexture) && totemData.textureType !== 1)
                        if ((totemData.textureType === 2 || totemData.notFor3DTotem) && totemData.totemTexture)
                            zip.folder('textures').folder('items').file('totem.png', totemData.totemTexture);
                        else
                            zip.folder('textures').folder('items').file('totem.png', i, { base64: true });

                    zip.generateAsync({ type: "blob" }).then(c => {
                        const a = _.createElement('a');
                        a.setAttribute('href', URL.createObjectURL(c));
                        a.setAttribute('download', `${totemData.packName}.mcpack`);
                        _.body.appendChild(a);
                        a.click();
                        _.body.removeChild(a);
                    })
                }
            }, 'image/png', '-moz-parse-options:format=bmp;bpp=128')
        } else {
            alert(`Import ${(totemData.notFor3DTotem) ? 'image' : 'skin'} first!`)
            clickSound('snes_pop.ogg');
        }
    }
    _.getElementById("packName").oninput = (v) => {
        totemData.packName = (v.target.value === '') ? 'Custom Totem Skin' : v.target.value;
    }
    _.getElementById("packName").addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) _.getElementById('download').click();
    })
    updateHand = () => {
        _.getElementById('setToBigHand').className = (totemData.isSmallHand) ? "" : "active";
        _.getElementById('setToSmallHand').className = (totemData.isSmallHand) ? "active" : "";
    }
    updateMCVersion = () => {
        _.getElementById('bedrockVersion').className = (totemData.isJava) ? "" : "active";
        _.getElementById('javaVersion').className = (totemData.isJava) ? "active" : "";
        _.getElementsByClassName('importSkin')[1].style.top = (totemData.isJava || totemData.notFor3DTotem) ? '0px' : '8px'
        _.getElementsByClassName('selectedButton withImportTexture')[0].style.display = (!totemData.isJava || totemData.notFor3DTotem) ? '' : 'none';
    }
    updateTexture = () => {
        _.getElementById('automatic').className = (totemData.textureType === 0) ? "active" : "";
        _.getElementById('vanilla_texture').className = (totemData.textureType === 1) ? "active" : "";
        _.getElementById('custom_texture').className = (totemData.textureType === 2) ? "active" : "";
        _.getElementById('importTexturePanel').className = (totemData.textureType === 2) ? "btn" : "btn inputDisable";
    };
    _.getElementById('notfor3dtotem').onclick = (m) => {
        clickSound('release.ogg');
        totemData.notFor3DTotem = m.target.checked;
        _.title = `${(totemData.notFor3DTotem) ? '2D' : '3D'} Totem Generator`;
        _.getElementsByClassName('header')[0].innerText = `${(totemData.notFor3DTotem) ? '2D' : '3D'} Totem Generator`;

        _.getElementsByClassName('importSkin')[0].style.display = (totemData.notFor3DTotem) ? 'none' : '';
        _.getElementsByClassName('selectedButton')[0].style.display = (totemData.notFor3DTotem) ? 'none' : '';
        _.getElementsByClassName('totemTextureSelectedButton')[0].style.display = (totemData.notFor3DTotem) ? 'none' : '';
        _.getElementsByClassName('totemTextureSelectedButton')[1].style.display = (totemData.notFor3DTotem) ? 'none' : '';
        _.getElementsByClassName('selectedButton')[1].style.height = (totemData.notFor3DTotem) ? '112px' : '';
        _.getElementById('importTexturePanel').className = (totemData.notFor3DTotem || totemData.textureType === 2) ? 'btn' : 'btn inputDisable';
        updateMCVersion();
        _.getElementsByClassName('no_use_3d_totem')[1].style.display = (totemData.notFor3DTotem) ? 'none' : '';
        _.getElementsByClassName('no_use_3d_totem')[0].style.marginBottom = (totemData.notFor3DTotem) ? '8px' : '';
        _.getElementsByClassName('importSkin')[1].style.top = (totemData.isJava || totemData.notFor3DTotem) ? '0px' : '8px'
    }
    _.getElementsByClassName('importSkin')[1].style.top = '8px';
    _.getElementsByClassName('link')[0].onclick = () => clickSound('modal_hide.ogg');
    _.getElementsByClassName('link')[1].onclick = () => clickSound('modal_hide.ogg');
    _.getElementsByClassName('link')[2].onclick = () => clickSound('modal_hide.ogg');
    _.getElementById('selectedSkinImage').onclick = () => clickSound('release.ogg');
    _.getElementById('importTexturePanel').onclick = () => { if (totemData.notFor3DTotem || totemData.textureType === 2) clickSound('release.ogg') };
}