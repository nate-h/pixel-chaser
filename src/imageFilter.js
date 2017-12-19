////////////////////////////////////////////////////////////////////////////////
// imageFilter.js
// Description: A class for managing a bunch of image filters.
//              Each function will only modify an image data array
//              and return the result.
////////////////////////////////////////////////////////////////////////////////

// For pixelation algorithm look up:
// https://stackoverflow.com/questions/4047031/help-with-the-theory-behind-a-pixelate-algorithm

class ImageFilter
{
    constructor()
    {

    }

    // Note: scale value needs to divide evenly into width, height
    pixelate(imageData, scale, width, height)
    {
        console.log("Pixelate!");
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

        for(xIter = 0; xIter < xItersMax; ++xIter)
        {
            for(yIter = 0; yIter < yItersMax; ++yIter)
            {
                // Calculate average pixel color for this block.
                colorSum = {"r": 0, "g": 0, "b": 0 };
                averageColor = {"r": 0, "g": 0, "b": 0 };

                startingX = xIter * scale;
                startingY = yIter * scale;

                // for loop for getting color sum of all pixels for block.
                for(blockIndex = 0; blockIndex < numPixelPerBlock; ++blockIndex)
                {
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

                averageColor =
                {
                    "r": colorSum.r/numPixelPerBlock,
                    "g": colorSum.g/numPixelPerBlock,
                    "b": colorSum.b/numPixelPerBlock,
                };

                //console.log(averageColor);

                // Set Colors for block to average color.
                for(blockIndex = 0; blockIndex < numPixelPerBlock; ++blockIndex)
                {
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

    // A filter for making edges much darker so they have a higher
    // probability of being proccessed.
    edgeDarkening()
    {

    }

    getColorsAtIndex(imageData, index)
    {
        var realIndex = index*4;
        var r = imageData[realIndex + 0];
        var g = imageData[realIndex + 1];
        var b = imageData[realIndex + 2];
        return {"r": r, "g": g, "b": b };
    }

    setColorsAtIndex(imageData, index, colors)
    {
        var realIndex = index*4;
        imageData[realIndex + 0] = colors.r;
        imageData[realIndex + 1] = colors.g;
        imageData[realIndex + 2] = colors.b;
    }

    indexToXY(index, width)
    {
        return {
            "x": index % width,
            "y": Math.floor(index / width)
        };
    }

    xyToIndex(x, y, width, height)
    {
        if(x < 0 || y < 0 || x >= width || y >= height)
            return -1;
        return x + y * width;
    }

    grayScale(imageData)
    {
        var data = imageData;

        for(var i = 0; i < data.length; i += 4)
        {
            var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];

            data[i] = brightness;      // red
            data[i + 1] = brightness;  // green
            data[i + 2] = brightness;  // blue
        }

        return data;
    }
}
