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
}
