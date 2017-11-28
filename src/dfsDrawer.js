////////////////////////////////////////////////////////////////////////////////
// dfsDrawer.js
// Description: Draws image using dfs algorithm.
////////////////////////////////////////////////////////////////////////////////

// Helper functions
var NeighborsDefinitions =
[
    {"direction": "Top", "x": 0, "y": -1},
    {"direction": "Down", "x": 0, "y": 1},
    {"direction": "Left", "x": -1, "y": 0},
    {"direction": "Right", "x": 1, "y": 0},
];

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
        if(x < 0 || y < 0 || x >= this.canvasW || y >= this.canvasH)
            return -1;
        return x + y * this.canvasW;
    }

    indexColorSum(index)
    {
        var realIndex = index*4;
        var sum = this.data[realIndex] + this.data[realIndex + 1] + this.data[realIndex + 2];
        return sum;
        //return sum*(255 - this.data[realIndex + 3]);
    }

    findDarkestNeighbor(index)
    {
        var xyTuple = this.indexToXY(index);
        var chosenDirection =  null;
        var minSum = null;

        // Get colors value for each of neighbors
        for(var dirIndex in NeighborsDefinitions)
        {
            let neighborsDef = NeighborsDefinitions[dirIndex];
            let x = neighborsDef.x + xyTuple.x;
            let y = neighborsDef.y + xyTuple.x;
            let tempIndex = this.xyToIndex(x, y);

            if(tempIndex < 0)
                continue;

            let colorSum = this.indexColorSum(tempIndex);

            if(minSum === null || colorSum < minSum)
            {
                minSum = colorSum;
                chosenDirection = neighborsDef.direction;
            }
        }

        return chosenDirection;
    }
}
