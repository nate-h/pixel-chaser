////////////////////////////////////////////////////////////////////////////////
// stateDrawer.js
// Description: Draws intermediate canvas states in a seperate list.
////////////////////////////////////////////////////////////////////////////////

class StateDrawer {

    constructor() {
        var stateDrawerList = document.getElementById("stateDrawerList");
        stateDrawerList.style.width = "200px";
        console.log(stateDrawerList);
        this.imageWidth = 200;
        this.imageHeight = 200;
    }

    addState(imageDataData, message) {
        var stateDrawerList = document.getElementById("stateDrawerList");
        var li = document.createElement("li");
        var messageSpan = document.createElement("span");
        messageSpan.innerHTML = message;
        var canvas = this.createCanvas(imageDataData);
        li.appendChild(canvas);
        li.appendChild(messageSpan);
        stateDrawerList.appendChild(li);
    }

    createCanvas(imageDataData) {
        var canvas = document.createElement('canvas');

        canvas.id = "CursorLayer";
        canvas.width = this.imageWidth;
        canvas.height = this.imageHeight;

        var ctx = canvas.getContext("2d");
        var imageData = new ImageData(imageDataData, this.imageWidth, this.imageHeight);

        ctx.putImageData(imageData, 0, 0);

        return canvas;
    }
}
