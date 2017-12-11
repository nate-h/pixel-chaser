////////////////////////////////////////////////////////////////////////////////
// main.js
////////////////////////////////////////////////////////////////////////////////

window.onload = function()
{
    // Start to draw image.
    var imageElement = new Image(200, 200);
    var dfsDrawer = null;
    imageElement.src = "assets/myFace.jpg";
    imageElement.onload = function()
    {
        dfsDrawer = new DfsDrawer(imageElement);
        dfsDrawer.draw();
    };
};
