////////////////////////////////////////////////////////////////////////////////
// imageFilter.js
// Description: A class for managing a bunch of image filters.
//              Each function will only modify an image data array
//              and return the result.
////////////////////////////////////////////////////////////////////////////////

// For pixelation algorithm look up:
// https://stackoverflow.com/questions/4047031/help-with-the-theory-behind-a-pixelate-algorithm

class ImageFilter {

    constructor() {

    }

    getColorsAtIndex(imageData, index) {
        var realIndex = index*4;
        var r = imageData[realIndex + 0];
        var g = imageData[realIndex + 1];
        var b = imageData[realIndex + 2];
        return {"r": r, "g": g, "b": b };
    }

    getIntensityMap(imageData, width, height) {
        // Note: reduces array size by factor of 4 since only need 1 channel.
        let intensityMap = new Uint8ClampedArray(width*height);
        for (var i = 0; i < width*height; i++) {
            let c = this.getColorsAtIndex(imageData, i);
            var brightness = 0.34 * c[0] + 0.5 * c[1] + 0.16 * c[2];
            intensityMap[i] = brightness;
        }

        return intensityMap;
    }

    setColorsAtIndex(imageData, index, colors) {
        var realIndex = index*4;
        imageData[realIndex + 0] = colors.r;
        imageData[realIndex + 1] = colors.g;
        imageData[realIndex + 2] = colors.b;
    }

    indexToXY(index, width) {
        return {
            "x": index % width,
            "y": Math.floor(index / width)
        };
    }

    xyToIndex(x, y, width, height) {
        if (x < 0 || y < 0 || x >= width || y >= height) {
            return -1;
        }
        return x + y * width;
    }

    range(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    convolve(imageData, imgWidth, imgHeight, kernel, finalMultiplier=1.0) {
        let imageDataCopy = new Uint8ClampedArray(imageData);
        let kLen = kernel.length;
        let kMid = Math.floor(kernel.length/2);
        let kMin = -kMid;
        let kMax = kMid;
        let x = 0;
        let y = 0;
        let kx = 0;
        let ky = 0;

        for (x = 0; x < imgWidth; ++x) {
            for (y = 0; y < imgHeight; ++y) {

                let centerIndex = this.xyToIndex(x, y, imgWidth, imgHeight);
                let centerColors = this.getColorsAtIndex(imageData, centerIndex);
                let centerKernelMult = kernel[kMid][kMid];
                let sum = {"r": 0, "g": 0, "b": 0};

                // Apply kernel to x,y
                for (kx = kMin; kx <= kMax; ++kx) {
                    for (ky = kMin; ky <= kMax; ++ky) {
                        // Iterate over cells in kernel, and add their weighted values to sum.
                        let weight = kernel[kx+kMid][ky+kMid];
                        let tx = x + kx;
                        let ty = y + ky;
                        let cappedX = this.range(tx, 0, imgWidth -1);
                        let cappedY = this.range(ty, 0, imgHeight -1);
                        let kerIndex = this.xyToIndex(cappedX, cappedY, imgWidth, imgHeight);
                        let kernelColor = this.getColorsAtIndex(imageData, kerIndex);
                        sum.r += kernelColor.r*weight;
                        sum.g += kernelColor.g*weight;
                        sum.b += kernelColor.b*weight;
                    }
                }

                // Set sum
                sum.r *= finalMultiplier;
                sum.g *= finalMultiplier;
                sum.b *= finalMultiplier;
                let pixelIndex = this.xyToIndex(x, y, imgWidth, imgHeight);
                this.setColorsAtIndex(imageDataCopy, pixelIndex, sum);
            }
        }

        return imageDataCopy;
    }
}
