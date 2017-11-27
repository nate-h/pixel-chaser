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

    findDarkestNeighbor(index)
    {
        var xyTuple = this.indexToXY(index);
        var chosenDirection =  null;
        var minSum = null;

        // Get colors value for each of neighbors

        // Check top


        // Check bottom
        // Check left
        // Check right
    }
}
