////////////////////////////////////////////////////////////////////////////////
// dfsDrawer.js
// Description: Draws image using dfs algorithm.
////////////////////////////////////////////////////////////////////////////////

class DfsDrawer
{
    constructor(imageElement)
    {
        // var declaration.
        this.canvas = document.getElementById("dfsDrawer");
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.canvas.addEventListener('click', this.onClick.bind(this));

        this.imageElement = imageElement;
        this.imgW = this.imageElement.width;
        this.imgH = this.imageElement.height;

        this.timerID = null;
        this.fps = 40;
        this.loopRepeat = 75;
        this.numPixels = this.canvas.width * this.canvas.height;

        this.nodeStates =
        {
            "Unvisited": 0,
            "Visited": 1,
            "Done": 2,
        };

        this.neighbors =
        [
            {"direction": "Top", "x": 0, "y": -1},
            {"direction": "Down", "x": 0, "y": 1},
            {"direction": "Left", "x": -1, "y": 0},
            {"direction": "Right", "x": 1, "y": 0},
        ];

        /*
        {"direction": "TopLeft", "x": -1, "y": -1},
        {"direction": "TopRight", "x": 1, "y": -1},
        {"direction": "BottomLeft", "x": -1, "y": 1},
        {"direction": "BottomRight", "x": 1, "y": 1},
        */

        this.preProcessImageData();
        this.reset();

        // Get everything else ready.

        this.frontLoadColorSums();
    }

    reset()
    {
        this.markSum = null;
        this.lastShuffleIndexX = 0;
        this.lastShuffleIndexY = 0;

        this.resetStartingPoints();
        this.setupRandomIndexes();
        this.setupStateArrays();
        this.clearRect();

        // Paint imagedata white.
        for(var pixelIndex in this.imageData.data)
            this.imageData.data[pixelIndex] = 255;
    }

    onClick()
    {
        // Clear interval, reset some properties and restart pixel chaser.
        clearInterval(this.timerID);
        this.reset();
        this.draw();
    }

    ////////////////////////////////////////////////////////////////////////////
    // One time functions for setting up
    ////////////////////////////////////////////////////////////////////////////

    // 200, 100, 50, 25, 10,5,2,1
    preProcessImageData()
    {
        // Draw image on canvas and capture canvas as 1-d array of color values
        this.ctx = this.canvas.getContext('2d');
        this.ctx.drawImage(this.imageElement, 0, 0, this.width, this.height);
        this.imageData = this.ctx.getImageData(0, 0, this.imgW, this.imgH);

        // TODO: Apply any filters here.
        this.imageFilter = new ImageFilter();
        this.imageFilter.pixelate(this.imageData, 10, this.width, this.height);

        // Clear Canvas and Set image data to have white pixels.
        this.clearRect();
        this.data = new Uint8ClampedArray(this.imageData.data);
        for(var pixelIndex in this.imageData.data)
            this.imageData.data[pixelIndex] = 255;
    }

    // Creates arrays for visited status and for backtracing.
    setupStateArrays()
    {
        var i = null;

        // Initialize node states array so we can see if we visited a node.
        this.nodesStates = new Array(this.width * this.height);
        for(i = 0; i < this.nodesStates.length; ++i)
            this.nodesStates[i] = this.nodeStates.Unvisited;

        // Initialize backtracing array
        this.backtrackStates = new Array(this.width * this.height);
        for(i = 0; i < this.backtrackStates.length; ++i)
            this.backtrackStates[i] = 0;
    }

    // Cache color values so each value isnt calculated 4 times.
    frontLoadColorSums()
    {
        this.colorSums = new Array(this.width * this.height);
        for(let i = 0; i < this.colorSums.length; ++i)
            this.colorSums[i] = this.simpleColorSumAtIndex(i);
    }

    setupRandomIndexes()
    {
        // setup vars.
        var i = null;
        this.randomizedRowIndexes = new Array(this.height);
        this.randomizedColumnIndexes = new Array(this.width);

        // Initialize arrays with ordred numbers.
        for(i = 0; i < this.height; i++)
            this.randomizedRowIndexes[i] = i;
        for(i = 0; i < this.width; i++)
            this.randomizedColumnIndexes[i] = i;

        // Shuffle those numbers.
        this.randomizedRowIndexes = this.shuffleArray(this.randomizedRowIndexes);
        this.randomizedColumnIndexes = this.shuffleArray(this.randomizedColumnIndexes);
    }

    resetStartingPoints()
    {
        this.leadIndexes = [];
        this.leadIndexes.push(0);
        this.leadIndexes.push(this.width-1);
        this.leadIndexes.push(this.width * this.height -1);
        this.leadIndexes.push((this.width-1)*this.height-1);
    }

    simpleColorSumAtIndex(index)
    {
        var realIndex = index*4;
        var r = this.data[realIndex + 0];
        var g = this.data[realIndex + 1];
        var b = this.data[realIndex + 2];
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Drawing/ Algorithm functions.
    ////////////////////////////////////////////////////////////////////////////

    draw()
    {
        console.log("Start drawing.");
        var iterCount = 0;

        var intervalFn = function()
        {
            for(var repeat = 0; repeat < this.loopRepeat; ++repeat)
            {
                for(var leadIter in this.leadIndexes)
                    this.applyDfsOnIndex(leadIter);
            }

            this.drawImage();

            if(this.markSum >= this.numPixels)
            {
                clearInterval(this.timerID);
                console.log("Completed drawing.");
            }

        }.bind(this);

        this.timerID = setInterval(intervalFn, 1000/this.fps);
    }

    applyDfsOnIndex(iter)
    {
        var myIndex = this.leadIndexes[iter];
        if(myIndex === null)
            return;

        // Get my index and node state.
        var nodeState = this.getNodeState(myIndex);

        // Mark as visited if I've never been visited.
        if(nodeState === this.nodeStates.Unvisited)
            this.setNodeState(myIndex, this.nodeStates.Visited);

        // Find darkest Neighbor that hasn't been visited yet.
        var darkNeighbor = this.findDarkestNeighbor(myIndex, this.nodeStates.Unvisited);

        // Move onto this index and process it now.
        if(darkNeighbor.index !== null && !this.indexTaken(iter, darkNeighbor.index))
        {
            this.leadIndexes[iter] = darkNeighbor.index;
            this.backtrackStates[myIndex] = darkNeighbor.direction;
            return;
        }

        // If all have been visited, backtrack and find lightest neighbor
        var lastIndex = this.backTrack(myIndex);

        if(lastIndex !== null)
        {
            this.setNodeState(myIndex, this.nodeStates.Done);
            this.leadIndexes[iter] = lastIndex;
            return;
        }
        else
        {
            this.leadIndexes[iter] = this.findUnvisitedIndex();
            //console.log('end new index: ', this.leadIndexes[iter]);
        }
    }

    clearRect()
    {
        this.ctx.clearRect(0,0, this.width, this.height);
    }

    drawImage()
    {
        this.ctx.putImageData(this.imageData, 0, 0);
    }

    indexTaken(iter, newIndex)
    {
        for(var index in this.leadIndexes)
        {
            if(index === iter)
                continue;
            if(this.leadIndexes[index] === newIndex)
                return true;
        }

        return false;
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
        if(nodeState === this.nodeStates.Visited)
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

    shuffleArray(array)
    {
        for(let i = array.length - 1; i > 0; --i)
        {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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
                var isUnvisited = nodeState === this.nodeStates.Unvisited;
                var isLeadIndex = this.leadIndexes.indexOf(index) >= 0;

                if(isUnvisited && !isLeadIndex)
                {
                    this.lastShuffleIndexX = columnIndex;
                    this.lastShuffleIndexY = rowIndex;
                    return index;
                }
            }

            this.lastShuffleIndexX = 0;
        }

        return null;
    }

    backTrack(index)
    {

        var xyTuple = this.indexToXY(index);


        // Get colors value for each of neighbors
        for(var dirIndex in this.neighbors)
        {
            let neighborsDef = this.neighbors[dirIndex];
            let x = neighborsDef.x + xyTuple.x;
            let y = neighborsDef.y + xyTuple.y;
            let neighborIndex = this.xyToIndex(x, y);

            // Test if valid index. Happens for edge nodes.
            if(neighborIndex < 0)
                continue;

            // Test if neighbor has target node state.
            var nodeState = this.getNodeState(neighborIndex);
            if(nodeState === this.nodeStates.Unvisited || nodeState === this.nodeStates.Done)
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
        for(var dirIndex in this.neighbors)
        {
            let neighborsDef = this.neighbors[dirIndex];
            let x = neighborsDef.x + xyTuple.x;
            let y = neighborsDef.y + xyTuple.y;
            let neighborIndex = this.xyToIndex(x, y);

            // Test if valid index. Happens for edge nodes.
            if(neighborIndex < 0)
                continue;

            // Test if neighbor has target node state.
            if(this.getNodeState(neighborIndex) !== needsNodeState)
                continue;

            let colorSum = this.colorSums[neighborIndex];

            if(darkestNeighbor.index === null || colorSum < darkestNeighbor.sum)
            {
                darkestNeighbor.sum = colorSum;
                darkestNeighbor.index = neighborIndex;
                darkestNeighbor.direction = neighborsDef.direction;
            }
        }

        return darkestNeighbor;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Debug functions.
    ////////////////////////////////////////////////////////////////////////////

    printNeighborsStats(index)
    {
        var xyTuple = this.indexToXY(index);

        // Get colors value for each of neighbors
        for(var dirIndex in this.neighbors)
        {
            let neighborsDef = this.neighbors[dirIndex];
            let x = neighborsDef.x + xyTuple.x;
            let y = neighborsDef.y + xyTuple.y;
            let neighborIndex = this.xyToIndex(x, y);

            // Test if valid index. Happens for edge nodes.
            if(neighborIndex < 0)
                continue;

            let colorSum = this.colorSums[neighborIndex];
            let nodeStateString = this.nodeStateAsString(this.getNodeState(neighborIndex));

            console.log(neighborsDef.direction, "Index: ", neighborIndex,
            " State: ", nodeStateString, " Sum: ", colorSum);
        }
    }

    nodeStateAsString(nodeStateInt)
    {
        return Object.keys(this.nodeStates)[nodeStateInt];
    }
}
