const totemData = {
    isSmallHand: false,
    packName: "Custom Totem Skin",
    textureType: 0,
    totemTexture: undefined,
    notFor3DTotem: false,
    isJava: false,
    skin: undefined
};
generateUUID = () => {
    return "$$$$$$$$-$$$$-$$$$-$$$$-$$$$$$$$$$$$"
        .replaceAll(/\$/g,
            () => Math.floor(Math.random() * 16).toString(16));
}
document.getElementById('selectedTextureImage').onchange = (e) => {
    const r = new FileReader(), f = e.srcElement.files[0];
    totemData.totemTexture = f;
    r.readAsDataURL(f);
    document.getElementById('filename2').innerText = f.name;
    r.addEventListener('load', (g) => {
        fetch(g.target.result).then(v => v.blob()).then(v => document.getElementsByClassName('previewImage')[1].src = URL.createObjectURL(v));
    })
}
document.getElementById("selectedSkinImage").onchange = (e) => {
    const f = e.srcElement.files[0];
    const r = new FileReader();
    r.readAsDataURL(f);
    r.addEventListener('load', async (g) => {
        const b = await (await fetch(g.target.result)).blob(),
            img = document.getElementsByClassName('previewImage')[0]
        img.src = URL.createObjectURL(b);

        await new Promise(res => setTimeout(res, 2));
        totemData.skin = f;
        document.getElementById('filename').innerText = f.name;
    });
}

$("#setToSmallHand").mouseup(() => {
    totemData.isSmallHand = true; updateHand();
})
$("#setToBigHand").mouseup(() => {
    totemData.isSmallHand = false; updateHand();
})
$("#bedrockVersion").mouseup(() => {
    totemData.isJava = false; updateMCVersion();
})
$("#javaVersion").mouseup(() => {
    totemData.isJava = true; updateMCVersion();
})
$("#automatic").mouseup(() => {
    totemData.textureType = 0; updateTexture();
})
$("#vanilla_texture").mouseup(() => {
    totemData.textureType = 1; updateTexture();
})
$("#custom_texture").mouseup(() => {
    totemData.textureType = 2; updateTexture();
})
document.getElementById('download').onclick = async () => {
    const canvas = document.getElementById('imagePreview'), ctx = canvas.getContext('2d'), img = document.getElementsByClassName('previewImage')[0];
    const { naturalHeight, naturalWidth } = img;
    if ((totemData.skin && !totemData.notFor3DTotem) || (totemData.totemTexture && totemData.notFor3DTotem)) {
        if (!totemData.notFor3DTotem) {
            if (![64, 128].includes(naturalHeight) && ![64, 128].includes(naturalWidth)) {
                alert('Your image may not Minecraft skin!');
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
                const manifest = await (await fetch('./javaSrc/packs/pack.mcmeta')).text();
                const zip = new JSZip();
                zip.file('pack.mcmeta', manifest);
                const mc = zip.folder('assets').folder('minecraft');
                mc.folder('textures').folder('item').file('totem_of_undying.png', totemData[(totemData.notFor3DTotem) ? "totemTexture" : "skin"]);
                zip.file('pack.png', (totemData.notFor3DTotem) ? totemData.totemTexture : i);

                if (!totemData.notFor3DTotem) {
                    const model = await (await fetch(`./javaSrc/model/${(totemData.isSmallHand) ? 'small' : 'slim'}/totem_of_undying.json`)).text();
                    mc.folder('models').folder('item').file('totem_of_undying.json', model);
                }

                zip.generateAsync({ type: "blob" }).then(c => {
                    const a = document.createElement('a');
                    a.setAttribute('href', URL.createObjectURL(c));
                    a.setAttribute('download', `${totemData.packName}.zip`);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
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
                        totemModelLeft = await (await fetch(`./bedrockSrc/model/${(totemData.isSmallHand) ? 'small' : 'slim'}/totem_left.geo.json`)).text(),
                        totemModelRight = await (await fetch(`./bedrockSrc/model/${(totemData.isSmallHand) ? 'small' : 'slim'}/totem_right.geo.json`)).text();
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
                    const a = document.createElement('a');
                    a.setAttribute('href', URL.createObjectURL(c));
                    a.setAttribute('download', `${totemData.packName}.mcpack`);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            }
        }, 'image/png', '-moz-parse-options:format=bmp;bpp=128')
    } else {
        alert(`Import ${(totemData.notFor3DTotem) ? 'image' : 'skin'} first!`)
    }
}
document.getElementById("packName").oninput = (v) => {
    totemData.packName = (v.srcElement.value === '') ? 'Custom Totem Skin' : v.srcElement.value;
}
document.getElementById("packName").addEventListener('keypress', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) document.getElementById('download').click();
})

updateHand = () => {
    document.getElementById('setToBigHand').className = (totemData.isSmallHand) ? "" : "active";
    document.getElementById('setToSmallHand').className = (totemData.isSmallHand) ? "active" : "";
}
updateMCVersion = () => {
    document.getElementById('bedrockVersion').className = (totemData.isJava) ? "" : "active";
    document.getElementById('javaVersion').className = (totemData.isJava) ? "active" : "";
    document.getElementsByClassName('selectedButton withImportTexture')[0].style.display = (!totemData.isJava || totemData.notFor3DTotem) ? '' : 'none';
}
updateTexture = () => {
    document.getElementById('automatic').className = (totemData.textureType === 0) ? "active" : "";
    document.getElementById('vanilla_texture').className = (totemData.textureType === 1) ? "active" : "";
    document.getElementById('custom_texture').className = (totemData.textureType === 2) ? "active" : "";
    document.getElementById('importTexturePanel').className = (totemData.textureType === 2) ? "btn" : "btn inputDisable";
};

document.getElementById('notfor3dtotem').onclick = (m) => {
    totemData.notFor3DTotem = m.srcElement.checked;
    document.title = `${(totemData.notFor3DTotem) ? '2D' : '3D'} Totem Generator`;
    document.getElementsByClassName('header')[0].innerText = `${(totemData.notFor3DTotem) ? '2D' : '3D'} Totem Generator`;

    document.getElementsByClassName('importSkin')[0].style.display = (totemData.notFor3DTotem) ? 'none' : '';
    document.getElementsByClassName('selectedButton')[0].style.display = (totemData.notFor3DTotem) ? 'none' : '';
    document.getElementsByClassName('totemTextureSelectedButton')[0].style.display = (totemData.notFor3DTotem) ? 'none' : '';
    document.getElementsByClassName('totemTextureSelectedButton')[1].style.display = (totemData.notFor3DTotem) ? 'none' : '';
    document.getElementsByClassName('selectedButton')[1].style.height = (totemData.notFor3DTotem) ? '112px' : '';
    document.getElementById('importTexturePanel').className = (totemData.notFor3DTotem || totemData.textureType === 2) ? 'btn' : 'btn inputDisable';
    updateMCVersion();
}