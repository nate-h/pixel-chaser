////////////////////////////////////////////////////////////////////////////////
// gaussianFilter.js
////////////////////////////////////////////////////////////////////////////////


class GaussianFilter extends ImageFilter {

    constructor(filterType) {

        this.kernels = {
            "3x3": {
                "sum": 16,
                "kernel": [
                    [1, 2, 1],
                    [2, 4, 2],
                    [1, 2, 1]
                ]
            },
            "5x5": {
                "sum": 256,
                "kernel": [
                    [1, 4, 6, 4, 1],
                    [4, 16, 24, 16, 4],
                    [6, 24, 36, 24, 6],
                    [4, 16, 24, 16, 4],
                    [1, 4, 6, 4, 1],
                ]
            }
        };
    }

    // Note: scale value needs to divide evenly into width, height
    pixelate(imageData, scale, width, height) {
        console.log("Pixelating!");
        var targetPixelIndexes = [];
        var xItersMax = width/scale;
        var yItersMax = height/scale;
        var numPixelPerBlock = scale * scale;
        var xIter = 0;
        var yIter = 0;
        var blockIndex = 0;
        var blockXY = 0;
        var blockX = 0;
        var blockY = 0;
        var startingX = 0;
        var startingY = 0;
        var colorSum = {"r": 0, "g": 0, "b": 0 };
        var averageColor = {"r": 0, "g": 0, "b": 0 };
        var colorAverage = 0;
        var pixelIndex = 0;
        var colors = 0;

        for (xIter = 0; xIter < xItersMax; ++xIter) {
            for (yIter = 0; yIter < yItersMax; ++yIter) {
                // Calculate average pixel color for this block.
                colorSum = {"r": 0, "g": 0, "b": 0 };
                averageColor = {"r": 0, "g": 0, "b": 0 };

                startingX = xIter * scale;
                startingY = yIter * scale;

                // for loop for getting color sum of all pixels for block.
                for (blockIndex = 0; blockIndex < numPixelPerBlock; ++blockIndex) {
                    // translate index to x, y coordinates.
                    blockXY = this.indexToXY(blockIndex, scale);
                    blockX = startingX + blockXY.x;
                    blockY = startingY + blockXY.y;

                    pixelIndex = this.xyToIndex(blockX, blockY, width, height);
                    colors = this.getColorsAtIndex(imageData, pixelIndex);

                    colorSum.r += colors.r;
                    colorSum.g += colors.g;
                    colorSum.b += colors.b;
                }

                averageColor = {
                    "r": colorSum.r/numPixelPerBlock,
                    "g": colorSum.g/numPixelPerBlock,
                    "b": colorSum.b/numPixelPerBlock,
                };

                // Set Colors for block to average color.
                for (blockIndex = 0; blockIndex < numPixelPerBlock; ++blockIndex) {
                    // translate index to x, y coordinates.
                    blockXY = this.indexToXY(blockIndex, scale);
                    blockX = startingX + blockXY.x;
                    blockY = startingY + blockXY.y;

                    pixelIndex = this.xyToIndex(blockX, blockY, width, height);
                    this.setColorsAtIndex(imageData, pixelIndex, averageColor);
                }
            }
        }
    }
}
