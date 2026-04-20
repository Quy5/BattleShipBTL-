
let aiMediumState = {
    mode: 'hunt',
    firstHit: null,
    lastHit: null,
    direction: null,
    directionQueue: []
};

function getMediumMove() {
    if (aiMediumState.mode === 'target') {
        if (aiMediumState.direction) {
            let nextR = aiMediumState.lastHit.r + aiMediumState.direction.dr;
            let nextC = aiMediumState.lastHit.c + aiMediumState.direction.dc;
            if (isValidTarget(nextR, nextC)) {
                return { r: nextR, c: nextC };
            } else {
                aiMediumState.direction = { dr: -aiMediumState.direction.dr, dc: -aiMediumState.direction.dc };
                aiMediumState.lastHit = { ...aiMediumState.firstHit };
                nextR = aiMediumState.lastHit.r + aiMediumState.direction.dr;
                nextC = aiMediumState.lastHit.c + aiMediumState.direction.dc;
                if (isValidTarget(nextR, nextC)) {
                    return { r: nextR, c: nextC };
                }
            }
        }

        while (aiMediumState.directionQueue.length > 0) {
            let dir = aiMediumState.directionQueue[0];
            let nextR = aiMediumState.firstHit.r + dir.dr;
            let nextC = aiMediumState.firstHit.c + dir.dc;
            if (isValidTarget(nextR, nextC)) {
                return { r: nextR, c: nextC };
            } else {
                aiMediumState.directionQueue.shift();
            }
        }

        aiMediumState.mode = 'hunt';
    }

    let validTargets = [];
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            if ((r + c) % 2 === 0 && isValidTarget(r, c)) {
                validTargets.push({ r, c });
            }
        }
    }
    if (validTargets.length > 0) {
        return validTargets[Math.floor(Math.random() * validTargets.length)];
    }
    return getEasyMove();
}

function updateMediumState(r, c, ketQuaBan) {
    if (ketQuaBan.daChim) {
        aiMediumState.mode = 'hunt';
        aiMediumState.firstHit = null;
        aiMediumState.lastHit = null;
        aiMediumState.direction = null;
        aiMediumState.directionQueue = [];
        return;
    }

    if (ketQuaBan.kieu === 'trung') {
        if (aiMediumState.mode === 'hunt') {
            aiMediumState.mode = 'target';
            aiMediumState.firstHit = { r, c };
            aiMediumState.lastHit = { r, c };
            aiMediumState.direction = null;
            let dirs = [{ dr: 1, dc: 0 }, { dr: -1, dc: 0 }, { dr: 0, dc: 1 }, { dr: 0, dc: -1 }];
            aiMediumState.directionQueue = dirs.sort(() => Math.random() - 0.5);
        } else if (aiMediumState.mode === 'target') {
            aiMediumState.lastHit = { r, c };
            if (!aiMediumState.direction && aiMediumState.directionQueue.length > 0) {
                aiMediumState.direction = aiMediumState.directionQueue.shift();
                aiMediumState.directionQueue = [];
            }
        }
    } else if (ketQuaBan.kieu === 'truot') {
        if (aiMediumState.mode === 'target') {
            if (aiMediumState.direction) {
                aiMediumState.direction = { dr: -aiMediumState.direction.dr, dc: -aiMediumState.direction.dc };
                aiMediumState.lastHit = { ...aiMediumState.firstHit };
            } else if (aiMediumState.directionQueue.length > 0) {
                aiMediumState.directionQueue.shift();
            }
        }
    }
}
