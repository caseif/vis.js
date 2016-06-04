function centerBiasedRandom(range, bias) {
    return biasedRandom(range / 2, bias) * (Math.random() >= 0.5 ? 1 : -1);
}

function biasedRandom(range, bias) {
    return (range - Math.pow(Math.random() * Math.pow(range, bias), 1 / bias));
}
