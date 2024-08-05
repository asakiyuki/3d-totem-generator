{
    updateBackground = () => {
        const { clientWidth: x, clientHeight: y } = document.body, stl = document.body.style;
        stl.background = `linear-gradient(to bottom, #0003, #000B), url('${(x < y) ? 'https://asakiyuki.vercel.app/textures/3d-totem/firefly_mo.jpg' : 'https://asakiyuki.vercel.app/textures/3d-totem/firefly_pc.jpeg'}')`;
        stl.backgroundPosition = 'top';
        stl.backgroundSize = 'cover';
        stl.backgroundAttachment = 'fixed';
    };

    window.onresize = updateBackground;
    updateBackground();
}
