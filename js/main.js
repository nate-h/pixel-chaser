////////////////////////////////////////////////////////////////////////////////
// main.js
////////////////////////////////////////////////////////////////////////////////

window.onload = function() {

    // Define settings for Pixel chaser.
    let settings = {
        canvasElementId: "dfsDrawer",
        debug: true,
        blockSize: 5,
        fps: 30,
        loopRepeat: 55,
        roots: 5,
    };

    // Start to draw image.
    let imageElement = new Image(200, 200);
    let pixelChaser = null;
    imageElement.src = "img/arch.jpg";
    imageElement.onload = function() {
        let showDetails = true;
        pixelChaser = new PixelChaser(imageElement, settings);
        pixelChaser.draw();
    };
};
