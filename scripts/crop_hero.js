const sharp = require('sharp');
const path = require('path');

async function cropImage() {
    const inputPath = path.join(__dirname, '../public/images/homepage_right.jpg');
    const outputPath = path.join(__dirname, '../public/images/homepage_right_cropped.jpg');

    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        const topCut = Math.round(metadata.height * 0.225); // 22.5% from top
        const bottomCut = Math.round(metadata.height * 0.10); // 10% from bottom
        const newHeight = metadata.height - topCut - bottomCut;

        await image
            .extract({
                left: 0,
                top: topCut,
                width: metadata.width,
                height: newHeight
            })
            .toFile(outputPath);

        console.log(`Successfully cropped image:
    Original: ${metadata.width}x${metadata.height}
    Cropped: ${metadata.width}x${newHeight}
    Saved to: ${outputPath}`);
    } catch (error) {
        console.error('Error cropping image:', error);
    }
}

cropImage();
