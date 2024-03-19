
let imageFrame = {};

ImportFile.setup(
    new CreateNode('div', GetElement.body())
    .setCSS({
        position: 'fixed',
        top: '25px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '250px',
        height: '75px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '15px',
        border: '1px solid #fff',
    })
    .appendNode(
        new CreateNode('a')
            .setText('Drag files here')
            .setCSS({
                display: 'block',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                lineHeight: '75px',
                color: '#fff',
                fontSize: '20px',
                textDecoration: 'none',
                fontFamily: 'Arial, sans-serif'
            })
    ),
    (data, name, type) => {
        if (name.match(/[a-z]+$/i)[0] === 'plist') {
            const plistData = XML.plistParse(atob(data.split(',')[1])).frames;
            imageFrame = {};
            for (const key of Object.keys(plistData)) imageFrame[key] = {
                    textureRect: plistData[key].aliases?.textureRect?.match(/\d+/g).map(Number) ?? plistData[key].textureRect.match(/\d+/g).map(Number),
                    textureRotated: (plistData[key].aliases?.textureRotated ?? plistData[key].textureRotated) === 'true',
                }
        }
        else if (name.match(/[a-z]+$/i)[0] === 'png') {
            if (Object.keys(imageFrame).length === 0) alert('Please import the .plist file first')
            else ImageHandle.getImageData(data, async (img, {width, height}) => {
                for (const k of Object.keys(imageFrame)) {
                    await new Promise(res => setTimeout(res, 500));
                    const {textureRect, textureRotated} = imageFrame[k],
                        [x, y, dx, dy] = textureRect;
                    let imgData = []
                    for (let imgIndex = 0; imgIndex < dx * dy; imgIndex++) {
                        const [imgX, imgY] = [imgIndex % dx, Math.floor(imgIndex / dx)],
                            index = ((textureRotated) ? ((dy - imgY + x) + (imgX + y) * width) : ((imgX + x) + (imgY + y) * width)) * 4;
                            
                        imgData.push(img[index]);
                        imgData.push(img[index + 1]);
                        imgData.push(img[index + 2]);
                        imgData.push(img[index + 3]);
                    }

                    ImageHandle.dataToImage(imgData,
                        {width: dx, height: dy}, 
                        (img) => HTML.downloadFile(`data:image/png;base64,${img}`, k)
                    )
                }
            })
        }
    }
)