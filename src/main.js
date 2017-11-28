////////////////////////////////////////////////////////////////////////////////
// main.js
////////////////////////////////////////////////////////////////////////////////

window.onload = function()
{
    var t0 = performance.now();

    // Start to draw image.
    var imageElement = new Image(200, 200);
    var dfsDrawer = null;
    imageElement.src = "assets/myFace.jpg";
    imageElement.onload = function(){
        dfsDrawer = new DfsDrawer(imageElement);
        dfsDrawer.draw();
    };

    var t1 = performance.now();
    console.log("Draw Time " + (t1 - t0) + " milliseconds.");
};
