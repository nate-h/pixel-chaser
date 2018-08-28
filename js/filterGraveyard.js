// Some exmaple filters declared here.

// Apply pixelation.
let pixelateFilter = new PixelateFilter(this.blockSize);
let pixelatedData = pixelateFilter.run(
    this.modifiedImageData, this.width, this.height);

// Apply gaussian.
let gKernel = "3x3";
let gaussianFilter = new GaussianFilter(gKernel);
let gaussianData = gaussianFilter.run(
    this.modifiedImageData, this.width, this.height);

// Apply gaussian.
let gKernel5 = "5x5";
let gaussianFilter5 = new GaussianFilter(gKernel5);
let gaussianData5 = gaussianFilter5.run(
    this.modifiedImageData, this.width, this.height);

// Apply sobel filter.
let sobelKernal = "basic";
let threshold = 100;
let sobelFilter = new SobelFilter(sobelKernal, threshold);
let sobelData = sobelFilter.run(
    this.modifiedImageData, this.width, this.height);

// Apply sobel filter w/ gaussian.
let sobelFilterWG = new SobelFilter(sobelKernal, threshold);
let sobelDataWG = sobelFilterWG.run(
    gaussianData5, this.width, this.height);
