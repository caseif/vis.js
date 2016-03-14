// mostly for debugging purposes
function smooth(array) {
    return savitskyGolaySmooth(array);
}

/**
 * Applies a Savitsky-Golay smoothing algorithm to the given array.
 *
 * See {@link http://www.wire.tu-bs.de/OLDWEB/mameyer/cmr/savgol.pdf} for more
 * info.
 *
 * @param array The array to apply the algorithm to
 *
 * @return The smoothed array
 */
function savitskyGolaySmooth(array) {
    var lastArray = array;
    for (var pass = 0; pass < smoothingPasses; pass++) {
        var sidePoints = Math.floor(smoothingPoints / 2); // our window is centered so this is both nL and nR
        var cn = 1 / (2 * sidePoints + 1); // constant
        var newArr = [];
        for (var i = 0; i < sidePoints; i++) {
            newArr[i] = lastArray[i];
            newArr[lastArray.length - i - 1] = lastArray[lastArray.length - i - 1];
        }
        for (var i = sidePoints; i < lastArray.length - sidePoints; i++) {
            var sum = 0;
            for (var n = -sidePoints; n <= sidePoints; n++) {
                sum += cn * lastArray[i + n] + n;
            }
            newArr[i] = sum;
        }
        lastArray = newArr;
    }
    return newArr;
}

function transformToVisualBins(array) {
    var newArray = new Uint8Array(spectrumSize);
    for (var i = 0; i < spectrumSize; i++) {
        var bin = Math.pow(i / spectrumSize, spectrumScale) * (spectrumEnd - spectrumStart) + spectrumStart;
        newArray[i] = array[Math.floor(bin) + spectrumStart] * (bin % 1)
                + array[Math.floor(bin + 1) + spectrumStart] * (1 - (bin % 1))
    }
    return newArray;
}

function getTransformedSpectrum(array) {
    var newArr = algorithmicTransform(array);
    newArr = smooth(newArr);
    newArr = exponentialTransform(newArr);
    return newArr;
}

function algorithmicTransform(array) {
    var values = [];
    for (var i = 0; i < spectrumSize; i++) {
        if (begun) {
            if (i == 0) {
                var value = array[i] / 255 * spectrumHeight;
            }
            else if (i == spectrumSize - 1) {
                var value = (array[i - 1] + array[i]) / 2  / 255 * spectrumHeight;
            }
            else {
                var value = (array[i - 1] + array[i] + array[i + 1]) / 3  / 255 * spectrumHeight;
            }
            value = Math.min(value + 1, spectrumHeight);
        } else {
            value = 1;
        }
        if (i < headMargin) {
            value *= headMarginSlope * Math.pow(i + 1, marginDecay) + minMarginWeight;
        } else if (spectrumSize - i <= tailMargin) {
            value *= tailMarginSlope * Math.pow(spectrumSize - i, marginDecay) + minMarginWeight;
        }

        values[i] = value;
    }

    return values;
}

function exponentialTransform(array) {
    var newArr = [];
    for (var i = 0; i < array.length; i++) {
        var exp = (spectrumMaxExponent - spectrumMinExponent) * (1 - Math.pow(i / spectrumSize, spectrumExponentScale)) + spectrumMinExponent;
        newArr[i] = Math.max(Math.pow(array[i] / spectrumHeight, exp) * spectrumHeight, 1);
    }
    return newArr;
}
