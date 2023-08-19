const totemData = {
    isSmallHand: false,
    packName: "Custom Totem Skin",
    skin: undefined
};
generateUUID = () => {
    return "$$$$$$$$-$$$$-$$$$-$$$$-$$$$$$$$$$$$"
        .replaceAll(/\$/g,
            () => Math.floor(Math.random() * 16).toString(16));
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
        const ctx = document.getElementById('imagePreview').getContext('2d');
        ctx.clearRect(0, 0, 8, 8);
        ctx.drawImage(img, 8, 8, 8, 8, 0, 0, 8, 8);
        ctx.drawImage(img, 40, 8, 8, 8, 0, 0, 8, 8);
    });
}

$("#setToSmallHand").click(() => {
    totemData.isSmallHand = true; updateHand();
})
$("#setToBigHand").click(() => {
    totemData.isSmallHand = false; updateHand();
})
document.getElementById('download').onclick = async () => {
    if (totemData.skin) {
        document.getElementById('imagePreview').toBlob(async (i) => {
            let manifest = await (await fetch('./source/packs/manifest.json')).json();
            manifest.header.name = totemData.packName;
            manifest.header.uuid = generateUUID();
            manifest = JSON.stringify(manifest, null, 4);

            const renderController = await (await fetch('./source/packs/render_controllers/totem.render_controllers.json')).text(),
                totem = await (await fetch('./source/packs/attachables/totem.json')).text(),
                totemFirstPerson = await (await fetch('./source/packs/animations/totem_firstperson.json')).text(),
                totemAnims = await (await fetch('./source/packs/animations/totem.json')).text(),
                totemModelLeft = await (await fetch(`./source/model/${(totemData.isSmallHand) ? 'small' : 'slim'}/totem_left.geo.json`)).text(),
                totemModelRight = await (await fetch(`./source/model/${(totemData.isSmallHand) ? 'small' : 'slim'}/totem_right.geo.json`)).text();

            const zip = new JSZip();
            zip.file('manifest.json', manifest);
            zip.file('totem.png', totemData.skin, { base64: true });
            zip.file('pack_icon.png', (i), { base64: true });
            const animations = zip.folder('animations');
            animations.file('totem_firstperson.json', totemFirstPerson);
            animations.file('totem.json', totemAnims);
            zip.folder('attachables').file('totem.json', totem);
            zip.folder('render_controllers').file('totem.render_controllers.json', renderController);
            const model = zip.folder('models').folder('entity');
            model.file('totem_left.geo.json', totemModelLeft);
            model.file('totem_right.geo.json', totemModelRight);

            zip.generateAsync({ type: "blob" }).then(c => {
                const a = document.createElement('a');
                a.setAttribute('href', URL.createObjectURL(c));
                a.setAttribute('download', `${totemData.packName}.mcpack`);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
        }, 'image/png', '-moz-parse-options:format=bmp;bpp=128')
    } else {
        alert('Choose your skin before download!')
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