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

    {"direction": "TopLeft", "x": -1, "y": -1},
    {"direction": "TopRight", "x": 1, "y": -1},
    {"direction": "BottomLeft", "x": -1, "y": 1},
    {"direction": "BottomRight", "x": 1, "y": 1},
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
        // var declaration.
        this.canvas = document.getElementById("dfsDrawer");
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.imageElement = imageElement;
        this.imgW = this.imageElement.width;
        this.imgH = this.imageElement.height;

        this.fps = 40;
        this.markSum = null;
        this.lastShuffleIndexX = 0;
        this.lastShuffleIndexY = 0;
        this.numPixels = this.canvas.width * this.canvas.height;

        // Get everything else ready.
        this.setupStartingPoints();
        this.setupRandomIndexes();
        this.setupStateArrays();
        this.preProcessImageData();
    }

    preProcessImageData()
    {
        // Draw image on canvas and capture canvas as 1-d array of color values
        this.ctx = this.canvas.getContext('2d');
        this.ctx.drawImage(this.imageElement, 0, 0, this.width, this.height);
        this.imageData = this.ctx.getImageData(0, 0, this.imgW, this.imgH);
        this.data = new Uint8ClampedArray(this.imageData.data);

        // Clear Canvas and Set image data to have white pixels.
        this.clear();
        for(var pixelIndex in this.imageData.data)
            this.imageData.data[pixelIndex] = 255;
    }

    // Creates arrays for visited status and for backtracing.
    setupStateArrays()
    {
        var i = null;
        this.nodesStates = new Array(this.width * this.height);
        for(i = 0; i < this.nodesStates.length; ++i)
            this.nodesStates[i] = NodeStates.Unvisited;
        this.backtrackStates = new Array(this.width * this.height);
        for(i = 0; i < this.backtrackStates.length; ++i)
            this.backtrackStates[i] = 0;
    }

    setupRandomIndexes()
    {
        var i = null;
        this.randomizedRowIndexes = new Array(this.height);
        for(i = 0; i < this.height; i++)
            this.randomizedRowIndexes[i] = i;
        this.randomizedRowIndexes = this.shuffleArray(this.randomizedRowIndexes);

        this.randomizedColumnIndexes = new Array(this.width);
        for(i = 0; i < this.width; i++)
            this.randomizedColumnIndexes[i] = i;
        this.randomizedColumnIndexes = this.shuffleArray(this.randomizedColumnIndexes);
    }

    setupStartingPoints()
    {
        this.leadIndexes = [];
        this.leadIndexes.push(0);
        this.leadIndexes.push(this.width-1);
        this.leadIndexes.push(this.width * this.height -1);
        this.leadIndexes.push((this.width-1)*this.height-1);
    }

    draw()
    {
        var iterCount = 0;

        var intervalFn = function()
        {

            for(var repeat = 0; repeat < 100; ++repeat)
            {
                for(var leadIter in this.leadIndexes)
                {
                    var myIndex = this.leadIndexes[leadIter];
                    this.dfsOnIndex(leadIter, myIndex);
                }
            }


            this.drawImage();

            if(this.markSum >= this.numPixels)
            {
                clearInterval(timerID);
                console.log("done stopped");
            }

        }.bind(this);

        var timerID = setInterval(intervalFn, 1000/this.fps);
    }

    dfsOnIndex(iter, myIndex)
    {
        if(myIndex === null)
            return;

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
        {
            this.leadIndexes[iter] = this.findUnvisitedIndex();
            console.log('end new index: ', this.leadIndexes[iter]);
        }
    }

    clear()
    {
        this.ctx.clearRect(0,0, this.width, this.height);
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

        if(directionString === "TopLeft")
            return "BottomRight";
        if(directionString === "TopRight")
            return "BottomLeft";
        if(directionString === "BottomLeft")
            return "TopRight";
        if(directionString === "BottomRight")
            return "TopLeft";
    }

    // translates index to row, column
    indexToXY(index)
    {
        return {
            "x": index % this.width,
            "y": Math.floor(index / this.width)
        };
    }

    // translates row, column to index
    xyToIndex(x, y)
    {
        if(x < 0 || y < 0 || x >= this.width || y >= this.height)
            return -1;
        return x + y * this.width;
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
        var r = this.data[realIndex + 0];
        var g = this.data[realIndex + 1];
        var b = this.data[realIndex + 2];
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        //return sum*(255 - this.data[realIndex + 3]);
    }

    shuffleArray(a) {
        for(let i = a.length - 1; i > 0; --i)
        {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    findUnvisitedIndex()
    {
        for(var rowIndex = this.lastShuffleIndexY; rowIndex < this.height; ++rowIndex)
        {
            var randRow = this.randomizedRowIndexes[rowIndex];

            for(var columnIndex = this.lastShuffleIndexX; columnIndex < this.width; ++columnIndex)
            {
                var randCol = this.randomizedColumnIndexes[columnIndex];
                var index = this.xyToIndex(randCol, randRow);
                var nodeState = this.getNodeState(index);
                var isUnvisited = nodeState === NodeStates.Unvisited;
                var isLeadIndex = this.leadIndexes.indexOf(index) >= 0;

                if(isUnvisited && !isLeadIndex)
                {
                    this.lastShuffleIndexX = columnIndex;
                    this.lastShuffleIndexY = rowIndex;
                    return index;
                }
            }
        }

        return null;
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
            if(nodeState === NodeStates.Unvisited || nodeState === NodeStates.Done)
                continue;

            if(this.oppositeDirection(this.backtrackStates[neighborIndex]) === neighborsDef.direction)
                return neighborIndex;
        }

        return null;

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
