////////////////////////////////////////////////////////////////////////////////
// main.js
////////////////////////////////////////////////////////////////////////////////

window.onload = function() {
    // Start to draw image.
    let imageElement = new Image(200, 200);
    let pixelChaser = null;
    imageElement.src = "img/bridge.png";
    imageElement.onload = function() {
        pixelChaser = new PixelChaser(imageElement);
        pixelChaser.draw();
    };
};
