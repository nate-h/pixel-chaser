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
        var startingIndex = 0;
        var colorSum = 0;
        var colorAverage = 0;

        for(xIter = 0; xIter < xItersMax; ++xIter)
        {
            for(yIter = 0; yIter < yItersMax; ++yIter)
            {
                // Calculate average pixel color for this block.
                colorSum = 0;
                //startingIndex = xIter * yIter  ??


                // for loop for getting color sum of all pixels for block.
                for(blockIndex = 0; blockIndex < numPixelPerBlock; ++blockIndex)
                {
                    // translate index to x, y coordinates.

                }

                colorAverage = colorSum / numPixelPerBlock;

                // for loop for getting color sum of all pixels for block.

            }
        }

    }

    grayScale(imageData)
    {
        var data = imageData.data;

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
