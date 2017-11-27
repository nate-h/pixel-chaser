////////////////////////////////////////////////////////////////////////////////
// dfsDrawer.js
// Description: Draws image using dfs algorithm.
////////////////////////////////////////////////////////////////////////////////

// Helper functions
var Direction = {
    "Top": 0,
    "Down": 1,
    "Left": 2,
    "Right": 3,
};

class DfsDrawer
{
    constructor(imageElement)
    {
        this.imageElement = imageElement;
        this.imgW = this.imageElement.width;
        this.imgH = this.imageElement.height;

        // Create a Canvas element
        var canvas = document.getElementById("dfsDrawer");
        this.canvasW = canvas.width;
        this.canvasH = canvas.height;

        // Draw image on canvas and capture canvas as 1-d array of color values
        this.ctx = canvas.getContext('2d');
        this.ctx.drawImage(this.imageElement, 0, 0, this.canvasW, this.canvasH);
        this.imageData = this.ctx.getImageData(0, 0, this.imgW, this.imgH);
        this.data = new Uint8ClampedArray(this.imageData.data);

        // Initialize array of visited nodes
        this.visited = new Array(this.canvasW * this.canvasH);
        for (var i = 0; i < this.visited.length; ++i)
            this.visited[i] = false;


        this.grayScale();

        this.findDarkestNeighbor(0);
    }

    clearRect()
    {
        this.ctx.clearRect(0,0, this.canvasW, this.canvasH);
    }

    drawImage()
    {
        this.clearRect();
        this.ctx.putImageData(this.imageData, 0, 0);
    }

    grayScale()
    {
        var data = this.imageData.data;

        for(var i = 0; i < data.length; i += 4)
        {
          var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];

          data[i] = brightness;      // red
          data[i + 1] = brightness;  // green
          data[i + 2] = brightness;  // blue
        }

        this.drawImage();
    }

    // translates index to row, column
    indexToXY(index)
    {
        return {
            "x": index % this.canvasW,
            "y": Math.floor(index / this.canvasW)
        };
    }

    // translates row, column to index
    xyToIndex(x, y)
    {
        return x + y * this.canvasW;
    }

    indexColorSum(index)
    {
        var realIndex = index*4;
        var sum = this.data[realIndex] + this.data[realIndex + 1] + this.data[realIndex + 2];
        return sum*this.data[realIndex + 3];
    }

    findDarkestNeighbor(index)
    {
        var xyTuple = this.indexToXY(index);
        var chosenDirection =  null;
        var minSum = null;
        var colorSum = null;
        var tempIndex = null;

        // Get colors value for each of neighbors

        // Check top
        var xTop = xyTuple.x;
        var yTop = xyTuple.y - 1;
        //var tempIndex = this.xyToIndex(xTop, yTop);
        if(yTop >= 0)
        {
            tempIndex = this.xyToIndex(xTop, yTop);
            colorSum = this.indexColorSum(tempIndex);
            console.log(colorSum);
        }

        // Check bottom
        var xBottom = xyTuple.x;
        var yBottom = xyTuple.y + 1;
        if(yBottom < this.canvasH)
        {
            tempIndex = this.xyToIndex(xBottom, yBottom);
            colorSum = this.indexColorSum(tempIndex);
            console.log(colorSum);
        }

        // Check left
        var xLeft = xyTuple.x - 1;
        var yLeft = xyTuple.y;
        if(xLeft >= 0)
        {
            tempIndex = this.xyToIndex(xLeft, yLeft);
            colorSum = this.indexColorSum(tempIndex);
            console.log(colorSum);
        }

        // Check right
        var xRight = xyTuple.x + 1;
        var yRight = xyTuple.y;
        if(xRight < this.canvasW)
        {
            tempIndex = this.xyToIndex(xRight, yRight);
            colorSum = this.indexColorSum(tempIndex);
            console.log(colorSum);
        }
    }
}
