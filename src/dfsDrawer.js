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
        // Create a Canvas element
        var canvas = document.getElementById("dfsDrawer");
        this.canvasW = canvas.width;
        this.canvasH = canvas.height;

        this.imageElement = imageElement;
        this.imgW = this.imageElement.width;
        this.imgH = this.imageElement.height;
        this.maxIters = canvas.width * canvas.height;
        this.leadIndexes = [0];
        this.markSum = null;   // TODO make this work. Count number of nodes mark as visited.
        var i = null;


        // Draw image on canvas and capture canvas as 1-d array of color values
        this.ctx = canvas.getContext('2d');
        this.ctx.drawImage(this.imageElement, 0, 0, this.canvasW, this.canvasH);
        this.imageData = this.ctx.getImageData(0, 0, this.imgW, this.imgH);
        this.data = new Uint8ClampedArray(this.imageData.data);

        // Creates arrays for visited status and for backtracing.
        this.nodesStates = new Array(this.canvasW * this.canvasH);
        for(i = 0; i < this.nodesStates.length; ++i)
        this.nodesStates[i] = NodeStates.Unvisited;
        this.backtrackStates = new Array(this.canvasW * this.canvasH);
        for(i = 0; i < this.backtrackStates.length; ++i)
        this.backtrackStates[i] = 0;

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

            for(var repeat = 0; repeat < 50; ++repeat)
            {
                for(var leadIter in this.leadIndexes)
                {
                    var myIndex = this.leadIndexes[leadIter];
                    this.dfsOnIndex(leadIter, myIndex);
                }
            }


            this.drawImage();

            if(this.markSum >= this.maxIters)
            {
                clearInterval(timerID);
                console.log("done stopped");
            }

        }.bind(this);

        var timerID = setInterval(intervalFn, 1);
    }

    dfsOnIndex(iter, myIndex)
    {
        // Get my index and node state.
        var nodeState = this.getNodeState(myIndex);

        // Mark as visited if I've never been visited.
        if(nodeState === NodeStates.Unvisited)
            this.setNodeState(myIndex, NodeStates.Visited);

        // Find darkest Neighbor that hasn't been visited yet.
        var darkNeighbor = this.findDarkestNeighbor(myIndex, NodeStates.Unvisited);

        // Move onto this index and process it now.
        if(darkNeighbor.index !== null)
        {
            this.leadIndexes[iter] = darkNeighbor.index;
            this.backtrackStates[myIndex] = darkNeighbor.direction;
            return;
        }

        // If all have been visited, backtrack and find lightest neighbor
        var lastIndex = this.backTrack(myIndex);

        if(lastIndex !== null)
        {
            this.setNodeState(myIndex, NodeStates.Done);
            this.leadIndexes[iter] = lastIndex;
            return;
        }
        else
            debugger;
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

    oppositeDirection(directionString)
    {
        if(directionString === "Top")
            return "Down";
        if(directionString === "Down")
            return "Top";
        if(directionString === "Left")
            return "Right";
        if(directionString === "Right")
            return "Left";
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
        {
            this.markSum++;
            this.showPixelAtIndex(index);
        }


        this.nodesStates[index] = nodeState;
    }

    showPixelAtIndex(index)
    {
        this.imageData.data[4*index + 0] = this.data[4*index + 0];
        this.imageData.data[4*index + 1] = this.data[4*index + 1];
        this.imageData.data[4*index + 2] = this.data[4*index + 2];
    }

    colorSumAtIndex(index)
    {
        var realIndex = index*4;
        var sum = this.data[realIndex] + this.data[realIndex + 1] + this.data[realIndex + 2];
        return sum;
        //return sum*(255 - this.data[realIndex + 3]);
    }

    allNeighborsVisited(index)
    {
        var xyTuple = this.indexToXY(index);

        // Get colors value for each of neighbors
        for(var dirIndex in NeighborsDefinitions)
        {
            let neighborsDef = NeighborsDefinitions[dirIndex];
            let x = neighborsDef.x + xyTuple.x;
            let y = neighborsDef.y + xyTuple.y;
            let neighborIndex = this.xyToIndex(x, y);

            // Test if valid index. Happens for edge nodes.
            if(neighborIndex < 0)
                continue;

            // Test if neighbor has target node state.
            if(this.getNodeState(neighborIndex) === NodeStates.Unvisited)
                return false;
        }

        return true;
    }

    backTrack(index)
    {

        var xyTuple = this.indexToXY(index);


        // Get colors value for each of neighbors
        for(var dirIndex in NeighborsDefinitions)
        {
            let neighborsDef = NeighborsDefinitions[dirIndex];
            let x = neighborsDef.x + xyTuple.x;
            let y = neighborsDef.y + xyTuple.y;
            let neighborIndex = this.xyToIndex(x, y);

            // Test if valid index. Happens for edge nodes.
            if(neighborIndex < 0)
                continue;

            // Test if neighbor has target node state.
            var nodeState = this.getNodeState(neighborIndex);
            if(nodeState === NodeStates.Unvisted || nodeState === NodeStates.Done)
                continue;

            if(this.oppositeDirection(this.backtrackStates[neighborIndex]) === neighborsDef.direction)
                return neighborIndex;
        }
    }

    findDarkestNeighbor(index, needsNodeState)
    {
        var xyTuple = this.indexToXY(index);
        var darkestNeighbor = {
            index: null,
            sum: null,
            direction: null,
        };

        // See which neight is darkest.
        for(var dirIndex in NeighborsDefinitions)
        {
            let neighborsDef = NeighborsDefinitions[dirIndex];
            let x = neighborsDef.x + xyTuple.x;
            let y = neighborsDef.y + xyTuple.y;
            let neighborIndex = this.xyToIndex(x, y);

            // Test if valid index. Happens for edge nodes.
            if(neighborIndex < 0)
                continue;

            // Test if neighbor has target node state.
            if(this.getNodeState(neighborIndex) !== needsNodeState)
                continue;

            let colorSum = this.colorSumAtIndex(neighborIndex);

            if(darkestNeighbor.index === null || colorSum < darkestNeighbor.sum)
            {
                darkestNeighbor.sum = colorSum;
                darkestNeighbor.index = neighborIndex;
                darkestNeighbor.direction = neighborsDef.direction;
            }
        }

        return darkestNeighbor;
    }

    printNeighborsStats(index)
    {
        var xyTuple = this.indexToXY(index);

        // Get colors value for each of neighbors
        for(var dirIndex in NeighborsDefinitions)
        {
            let neighborsDef = NeighborsDefinitions[dirIndex];
            let x = neighborsDef.x + xyTuple.x;
            let y = neighborsDef.y + xyTuple.y;
            let neighborIndex = this.xyToIndex(x, y);

            // Test if valid index. Happens for edge nodes.
            if(neighborIndex < 0)
                continue;

            let colorSum = this.colorSumAtIndex(neighborIndex);
            let nodeStateString = this.nodeStateAsString(this.getNodeState(neighborIndex));

            console.log(neighborsDef.direction, "Index: ", neighborIndex,
            " State: ", nodeStateString, " Sum: ", colorSum);
        }
    }

    nodeStateAsString(nodeStateInt)
    {
        return Object.keys(NodeStates)[nodeStateInt];
    }
}
