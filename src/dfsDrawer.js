////////////////////////////////////////////////////////////////////////////////
// dfsDrawer.js
////////////////////////////////////////////////////////////////////////////////

class DfsDrawer
{
    constructor(imageElement)
    {
        this.imageElement = imageElement;
        this.imgW = this.imageElement.width;
        this.imgH = this.imageElement.height;

        // Create a Canvas element
        var canvas = document.getElementById("dfsDrawer");
        this.canvasW = canvas.width;
        this.canvasH = canvas.height;

        // Draw image on canvas and capture canvas as 1-d array of color values
        this.ctx = canvas.getContext('2d');
        this.ctx.drawImage(this.imageElement, 0, 0, this.canvasW, this.canvasH);
        this.imageData = this.ctx.getImageData(0, 0, this.imgW, this.imgH);

        // Test lines.
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(200, 200);
        this.ctx.stroke();

        this.clearRect();

        this.grayScale();
    }

    clearRect()
    {
        this.ctx.clearRect(0,0, this.canvasW, this.canvasH);
    }

    grayScale()
    {
        var data = this.imageData.data;

        for(var i = 0; i < data.length; i += 4) {
          var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
          // red
          data[i] = brightness;
          // green
          data[i + 1] = brightness;
          // blue
          data[i + 2] = brightness;
        }

        // overwrite original image
        this.ctx.putImageData(this.imageData, 0, 0);
    }
}
