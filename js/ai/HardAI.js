function getHardMove() {
    let probMap = Array(10).fill(0).map(() => Array(10).fill(0));

    let remainingShips = CAU_HINH_THUYEN.filter(c => {
        let s = banCoNguoiChoi.danhSachThuyen.find(ts => ts.ten === c.ten);
        return !s || !s.daChim;
    });

    let minLen = remainingShips.reduce((min, ship) => Math.min(min, ship.doDai), 5); // max is 5

    let activeHits = [];
    let sunkCells = [];

    banCoNguoiChoi.danhSachThuyen.forEach(s => {
        if (s.daChim) {
            s.toaDo.forEach(t => sunkCells.push(t));
        }
    });

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            if (banCoNguoiChoi.mangLuoi[r][c] === 'trung') {
                let isSunk = sunkCells.some(t => t.r === r && t.c === c);
                if (!isSunk) activeHits.push({ r, c });
            }
        }
    }

    const isImpossible = (r, c) => {
        if (r < 0 || r >= 10 || c < 0 || c >= 10) return true;
        let state = banCoNguoiChoi.mangLuoi[r][c];
        if (state === 'truot') return true;
        for (let sCell of sunkCells) {
            let dr = Math.abs(sCell.r - r);
            let dc = Math.abs(sCell.c - c);
            if (dr <= 1 && dc <= 1) return true;
        }
        return false;
    };

    const canPlace = (r, c, len, isVertical) => {
        let hitsOverlapped = 0;
        for (let i = 0; i < len; i++) {
            let rr = isVertical ? r + i : r;
            let cc = isVertical ? c : c + i;
            if (isImpossible(rr, cc)) return { valid: false };
            if (banCoNguoiChoi.mangLuoi[rr][cc] === 'trung') hitsOverlapped++;
        }
        return { valid: true, hitsOverlapped };
    };

    remainingShips.forEach(ship => {
        let len = ship.doDai;
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {

                let horz = canPlace(r, c, len, false);
                if (horz.valid) {
                    if (activeHits.length > 0) {
                        if (horz.hitsOverlapped > 0) {
                            let weight = Math.pow(10, horz.hitsOverlapped);
                            for (let i = 0; i < len; i++) probMap[r][c + i] += weight;
                        }
                    } else {
                        for (let i = 0; i < len; i++) probMap[r][c + i] += 1;
                    }
                }

                let vert = canPlace(r, c, len, true);
                if (vert.valid) {
                    if (activeHits.length > 0) {
                        if (vert.hitsOverlapped > 0) {
                            let weight = Math.pow(10, vert.hitsOverlapped);
                            for (let i = 0; i < len; i++) probMap[r + i][c] += weight;
                        }
                    } else {
                        for (let i = 0; i < len; i++) probMap[r + i][c] += 1;
                    }
                }
            }
        }
    });

    let maxR = -1;
    let maxC = -1;
    let maxProb = -1;

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            if (!isValidTarget(r, c)) continue;
            if (isImpossible(r, c)) continue;

            let p = probMap[r][c];

            if (activeHits.length === 0) {
                if ((r + c) % minLen !== 0) {
                    p = 0;
                }
            }

            let distToCenter = Math.max(Math.abs(r - 4.5), Math.abs(c - 4.5));
            let tieBreaker = (5 - distToCenter) * 0.1;

            let finalProb = p > 0 ? p + tieBreaker : 0;

            if (finalProb > maxProb) {
                maxProb = finalProb;
                maxR = r;
                maxC = c;
            }
        }
    }

    if (maxR === -1 || maxProb === 0) {
        return getEasyMove(); // use fallback if probabilities fail to resolve
    }

    return { r: maxR, c: maxC };
}
