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

var NodeStates =
{
    "Unvisited": 0,
    "Visited": 1,
    "Done": 2,
};

class DfsDrawer
{
    constructor(imageElement)
    {
        this.imageElement = imageElement;
        this.imgW = this.imageElement.width;
        this.imgH = this.imageElement.height;
        this.maxIters = 4000;
        this.leadIndexes = [0];

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
        this.nodesStates = new Array(this.canvasW * this.canvasH);
        for (var i = 0; i < this.nodesStates.length; ++i)
            this.nodesStates[i] = NodeStates.Unvisited;

        // Clear Canvas and Set image data to have white pixels.
        this.clear();
        for(var pixelIndex in this.imageData.data)
            this.imageData.data[pixelIndex] = 255;
    }

    draw()
    {
        var iterCount = 0;
        var numPixels = this.canvasW*this.canvasH;

        var intervalFn = function()
        {

           for(var leadIter in this.leadIndexes)
           {
               // Get my index and node state.
               var myIndex = this.leadIndexes[leadIter];
               var nodeState = this.getNodeState(myIndex);

               // Mark as visited if I've never been visited.
               if(nodeState === NodeStates.Unvisited)
                    this.setNodeState(myIndex, NodeStates.Visited);

                // Find darkest Neighbor that hasn't been visited yet.
                var nextDarkestIndex = this.findDarkestNeighbor(myIndex, NodeStates.Unvisited);

                // remove my index and replace with this one.
                if(nextDarkestIndex >= 0)
                {
                    this.leadIndexes[leadIter] = nextDarkestIndex;
                    continue;
                }

                // If all have been visited, find darkest of those.
                var darkestVisitedNeighbor = this.findDarkestNeighbor(myIndex, NodeStates.Visited);
                if(darkestVisitedNeighbor >= 0)
                {
                    this.setNodeState(myIndex, NodeStates.Done);
                    this.leadIndexes[leadIter] = darkestVisitedNeighbor;
                    continue;
                }
           }

            this.drawImage();

            if(++iterCount >= this.maxIters)
            {
                clearInterval(timerID);
                console.log("done stopped");
            }

        }.bind(this);

        var timerID = setInterval(intervalFn, 50);
    }

    clear()
    {
        this.ctx.clearRect(0,0, this.canvasW, this.canvasH);
    }

    drawImage()
    {
        this.clear();
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

    getNodeState(index)
    {
        return this.nodesStates[index];
    }

    setNodeState(index, nodeState)
    {
        if(nodeState === NodeStates.Visited)
            this.showPixelAtIndex(index);

        this.nodesStates[index] = nodeState;
    }

    showPixelAtIndex(index)
    {
        this.imageData.data[4*index + 0] = this.data[4*index + 0];
        this.imageData.data[4*index + 1] = this.data[4*index + 1];
        this.imageData.data[4*index + 2] = this.data[4*index + 2];
    }

    indexColorSum(index)
    {
        var realIndex = index*4;
        var sum = this.data[realIndex] + this.data[realIndex + 1] + this.data[realIndex + 2];
        return sum;
        //return sum*(255 - this.data[realIndex + 3]);
    }

    findDarkestNeighbor(index, needsNodeState)
    {
        var xyTuple = this.indexToXY(index);
        var chosenDirection =  null;
        var minSum = null;

        // Get colors value for each of neighbors
        for(var dirIndex in NeighborsDefinitions)
        {
            let neighborsDef = NeighborsDefinitions[dirIndex];
            let x = neighborsDef.x + xyTuple.x;
            let y = neighborsDef.y + xyTuple.y;
            let tempIndex = this.xyToIndex(x, y);

            // Test if valid index. Happens for edge nodes.
            if(tempIndex < 0)
                continue;

            // Test if neighbor has target node state.
            if(this.getNodeState(tempIndex) !== needsNodeState)
                continue;

            let colorSum = this.indexColorSum(tempIndex);

            if(minSum === null || colorSum < minSum)
            {
                minSum = colorSum;
                chosenDirection = tempIndex;
            }
        }

        return chosenDirection;
    }
}
