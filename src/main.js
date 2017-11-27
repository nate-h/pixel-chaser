////////////////////////////////////////////////////////////////////////////////
// main.js
////////////////////////////////////////////////////////////////////////////////


var t0 = performance.now();


var drawImage = function()
{
    var myImage = document.getElementById("imageToDraw");
    var imageWidth = myImage.width;
    var imageHeight = myImage.height;
    myImage.crossOrigin = "Anonymous";

    console.log(myImage);

    // Create a Canvas element
    var canvas = document.getElementById("dfsDrawer");

    // Draw image onto the canvas
    var ctx = canvas.getContext('2d');
    ctx.drawImage(myImage, 0, 0);

    // Finally, get the image data
    // ('data' is an array of RGBA pixel values for each pixel)
    var data = ctx.getImageData(0, 0, imageWidth, imageHeight);

    console.log(data);


    ctx.moveTo(0, 0);
    ctx.lineTo(200, 150);
    ctx.stroke();
};

var t1 = performance.now();
console.log("Draw Time " + (t1 - t0) + " milliseconds.");

window.onload = function()
{
    drawImage();
};
