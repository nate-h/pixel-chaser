////////////////////////////////////////////////////////////////////////////////
// gaussianFilter.js
////////////////////////////////////////////////////////////////////////////////


class GaussianFilter extends ImageFilter {

    constructor(kernelOperator) {
        super();

        this.kernels = {
            "3x3": {
                "sum": 16,
                "kernel": [
                    [1, 2, 1],
                    [2, 4, 2],
                    [1, 2, 1]
                ]
            },
            "5x5": {
                "sum": 256,
                "kernel": [
                    [1, 4, 6, 4, 1],
                    [4, 16, 24, 16, 4],
                    [6, 24, 36, 24, 6],
                    [4, 16, 24, 16, 4],
                    [1, 4, 6, 4, 1],
                ]
            }
        };

        // Check/ correct validity of users kernel operator.
        if (this.kernels.hasOwnProperty(kernelOperator)) {
            this.kernelOperator = kernelOperator;
        } else {
            this.kernelOperator = Object.keys(this.kernels)[0];
            console.error("Invalid kernel operator. Choosing default 3x3.");
        }
    }

    // Note: scale value needs to divide evenly into width, height
    run(imageData, imgWidth, imgHeight) {
        let kernel = this.kernels[this.kernelOperator].kernel;
        let sum = this.kernels[this.kernelOperator].sum;
        return this.convolve(imageData, imgWidth, imgHeight, kernel, 1/sum);
    }
}
