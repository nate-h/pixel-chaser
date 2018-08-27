////////////////////////////////////////////////////////////////////////////////
// main.js
////////////////////////////////////////////////////////////////////////////////

window.onload = function() {
    // Start to draw image.
    let imageElement = new Image(200, 200);
    let pixelChaser = null;
    imageElement.src = "img/bridge.png";
    imageElement.onload = function() {
        let canvasIdName = "dfsDrawer";
        let showDetails = true;
        pixelChaser = new PixelChaser(canvasIdName, imageElement, showDetails);
        pixelChaser.draw();
    };
};
