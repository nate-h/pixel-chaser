////////////////////////////////////////////////////////////////////////////////
// pixelateFilter.js
////////////////////////////////////////////////////////////////////////////////


class PixelateFilter extends ImageFilter {

    constructor(scale) {
        super();

        this.scale = scale;
    }

    // Note: this.scale value needs to divide evenly into width, height
    run(imageData, width, height) {
        let retData = new Uint8ClampedArray(imageData);

        var targetPixelIndexes = [];
        var xItersMax = width/this.scale;
        var yItersMax = height/this.scale;
        var numPixelPerBlock = this.scale * this.scale;
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

                startingX = xIter * this.scale;
                startingY = yIter * this.scale;

                // for loop for getting color sum of all pixels for block.
                for (blockIndex = 0; blockIndex < numPixelPerBlock; ++blockIndex) {
                    // translate index to x, y coordinates.
                    blockXY = this.indexToXY(blockIndex, this.scale);
                    blockX = startingX + blockXY.x;
                    blockY = startingY + blockXY.y;

                    pixelIndex = this.xyToIndex(blockX, blockY, width, height);
                    colors = this.getColorsAtIndex(retData, pixelIndex);

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
                    blockXY = this.indexToXY(blockIndex, this.scale);
                    blockX = startingX + blockXY.x;
                    blockY = startingY + blockXY.y;

                    pixelIndex = this.xyToIndex(blockX, blockY, width, height);
                    this.setColorsAtIndex(retData, pixelIndex, averageColor);
                }
            }
        }

        return retData;
    }
}
