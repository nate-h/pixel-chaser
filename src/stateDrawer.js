////////////////////////////////////////////////////////////////////////////////
// stateDrawer.js
// Description: Draws intermediate canvas states in a seperate list.
////////////////////////////////////////////////////////////////////////////////

class StateDrawer
{
    constructor()
    {


    }

    addState(imageData, message)
    {
        // below is optional

        var canvas = document.createElement('canvas');

        canvas.id = "CursorLayer";
        canvas.width = 1224;
        canvas.height = 768;
        canvas.style.zIndex = 8;
        canvas.style.position = "absolute";
        canvas.style.border = "1px solid";

        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.fillRect(100, 100, 200, 200);
        ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
        ctx.fillRect(150, 150, 200, 200);
        ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
        ctx.fillRect(200, 50, 200, 200);


        //var stateDrawerList = document.getElementsByTagName("stateDrawerList")[0];


        var stateDrawerList = document.getElementById("stateDrawerList");

        var li = document.createElement("li");
        li.appendChild(canvas);
        stateDrawerList.appendChild(li);
    }
}
