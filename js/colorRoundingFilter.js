////////////////////////////////////////////////////////////////////////////////
// colorRoundingFilter.js
// Custom algorithm that converts rgb image to hsv and then back to rgb.
// While each pixel is in hsv, the algorithm rounds the hue depending on
// the number of bins specified.
//
// Detailed description:
// for each color, break into
////////////////////////////////////////////////////////////////////////////////


class ColorRoundingFilter extends ImageFilter {
    constructor(bins) {
        super()
        this.bins = bins;
    }

    run(imageData, imgWidth, imgHeight) {

        let idx;
        let imageDataCopy = new Uint8ClampedArray(4 * imgWidth * imgHeight);
        let delta = 1/(this.bins - 1);

        for (idx = 0; idx < imgWidth*imgHeight; ++idx) {
            let c = this.getColorsAtIndex(imageData, idx);
            let hsv = this.rgbToHsv(c);

            //console.log('hsv.h', hsv.h);
            let roundedH = delta*Math.round(hsv.h/delta);
            hsv.h = roundedH;
            let rgb = this.hsvToRgb(hsv);

            //console.log('hsv.h', hsv.h);

            //debugger;

            this.setColorsAtIndex(imageDataCopy, idx, rgb);
        }

        return imageDataCopy;
    }


    rgbToHsv(rgb) {
        let r = rgb.r/255;
        let g = rgb.g/255;
        let b = rgb.b/255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h, s, v = max;

        let d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return {'h': h, 's': s, 'v': v};
    }

    hsvToRgb(hsv) {
        let h = hsv.h;
        let s = hsv.s;
        let v = hsv.v;
        let r, g, b;

        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v, g = t, b = p;
                break;
            case 1: r = q, g = v, b = p;
                break;
            case 2: r = p, g = v, b = t;
                break;
            case 3: r = p, g = q, b = v;
                break;
            case 4: r = t, g = p, b = v;
                break;
            case 5: r = v, g = p, b = q;
                break;
        }

        return {'r': r * 255, 'g': g * 255, 'b': b * 255};
    }
}
