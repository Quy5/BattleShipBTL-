function getEasyMove() {
    let validTargets = [];
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            if (isValidTarget(r, c)) validTargets.push({ r, c });
        }
    }
    if (validTargets.length > 0) {
        return validTargets[Math.floor(Math.random() * validTargets.length)];
    }
    return { r: 0, c: 0 };
}
