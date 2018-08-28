////////////////////////////////////////////////////////////////////////////////
// sobelFilter.js
////////////////////////////////////////////////////////////////////////////////


class SobelFilter extends ImageFilter {

    constructor(kernelOperator, threshold) {
        super();

        this.threshold = threshold;
        this.kernels = {
            "basic": {
                "kernel_x": [
                    [1, 0, -1],
                    [2, 0, -2],
                    [1, 0, -1]
                ],
                "kernel_y": [
                    [1, 2, 1],
                    [0, 0, 0],
                    [-1, -2, -1]
                ]
            },
            "basic2": {
                "kernel_x": [
                    [3, 0, -3],
                    [10, 0, -10],
                    [3, 0, -3]
                ],
                "kernel_y": [
                    [3, 10, 3],
                    [0, 0, 0],
                    [-3, -10, -3]
                ]
            }
        };

        // Check/ correct validity of users kernel operator.
        if (this.kernels.hasOwnProperty(kernelOperator)) {
            this.kernelOperator = kernelOperator;
        } else {
            this.kernelOperator = Object.keys(this.kernels)[0];
            console.error("Invalid kernel operator. Choosing default.");
        }
    }

    // Note: scale value needs to divide evenly into width, height
    run(imageData, imgWidth, imgHeight) {
        let kernel_x = this.kernels[this.kernelOperator].kernel_x;
        let kernel_y = this.kernels[this.kernelOperator].kernel_y;
        let intensityMap = this.getIntensityMap(imageData, imgWidth, imgHeight);
        let convolvedData_x = this.convolve1D(intensityMap, imgWidth, imgHeight, kernel_x);
        let convolvedData_y = this.convolve1D(intensityMap, imgWidth, imgHeight, kernel_y);

        // Now create rgb data structure that translates the map to gray scale image.
        let retImageData = new Uint8ClampedArray(imgWidth*imgHeight*4);
        for (var i = 0; i < convolvedData_x.length; ++i) {
            let brightness_x = convolvedData_x[i];
            let brightness_y = convolvedData_y[i];
            let brightness = Math.sqrt(brightness_x*brightness_x + brightness_y*brightness_y);
            if (brightness < this.threshold) {
                brightness = 0;
            }

            let finalRGB = {'r':brightness, 'g':brightness, 'b': brightness};
            this.setColorsAtIndex(retImageData, i, finalRGB);
        }

        return retImageData;
    }
}
