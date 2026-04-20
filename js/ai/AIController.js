
function taoBanCoKeDich() {
    CAU_HINH_THUYEN.forEach(cauHinh => {
        let datThanhCong = false;
        while (!datThanhCong) {
            const hang = Math.floor(Math.random() * 10);
            const cot = Math.floor(Math.random() * 10)
            const laChieuDoc = Math.random() > 0.5;
            const thuyenMoi = new Thuyen(cauHinh.ten, cauHinh.doDai);
            if (banCoKeDich.datThuyen(thuyenMoi, hang, cot, laChieuDoc)) {
                datThanhCong = true;
            }
        }
    });
}

function isValidTarget(r, c) {
    if (r < 0 || r >= 10 || c < 0 || c >= 10) return false;
    let state = banCoNguoiChoi.mangLuoi[r][c];
    return state !== 'trung' && state !== 'truot';
}
function luotKeDich() {
    if (troChoiKetThuc) return;

    const doKho = LuuTru.layDoKho() || 'de';
    let toaDoMayBan;

    if (doKho === 'de') toaDoMayBan = getEasyMove();
    else if (doKho === 'trungBinh') toaDoMayBan = getMediumMove();
    else toaDoMayBan = getHardMove();

    if (!toaDoMayBan || !isValidTarget(toaDoMayBan.r, toaDoMayBan.c)) {
        toaDoMayBan = getEasyMove();
    }

    let hangMayBan = toaDoMayBan.r;
    let cotMayBan = toaDoMayBan.c;

    const ketQuaBan = banCoNguoiChoi.nhanTanCong(hangMayBan, cotMayBan);
    if (doKho === 'trungBinh') {
        updateMediumState(hangMayBan, cotMayBan, ketQuaBan);
    }

    const thuTuO_TrenManHinh = hangMayBan * 10 + cotMayBan;
    const oGiaoDien = document.getElementById('player-grid').children[thuTuO_TrenManHinh];
    const toaDoDocDuoc = `${String.fromCharCode(65 + hangMayBan)}-${cotMayBan + 1}`;

    if (ketQuaBan.kieu === 'trung') {
        oGiaoDien.classList.add('hit');
        rungManHinh('heavy');
        ghiNhatKy('KẺ ĐỊCH', `BẮN TRÚNG TẠI ${toaDoDocDuoc}`, 'hit');
        capNhatSucManh();

        if (ketQuaBan.daChim) {
            AudioSys.playSunk();
            ghiNhatKy('HỆ THỐNG', `THUYỀN CỦA BẠN ĐÃ CHÌM`, 'sunk');
            const huongVachKe = ketQuaBan.laChieuDoc ? 'sunk-v' : 'sunk-h';
            ketQuaBan.toaDo.forEach(viTri => {
                const viTriManHinh = viTri.r * 10 + viTri.c;
                const oChim = document.getElementById('player-grid').children[viTriManHinh];
                if (oChim) oChim.classList.add('sunk-mark', huongVachKe);
            });
        } else {
            AudioSys.playHit();
        }

        if (!kiemTraKetThuc()) setTimeout(luotKeDich, 800);
    } else {
        AudioSys.playMiss();
        oGiaoDien.classList.add('miss');
        ghiNhatKy('KẺ ĐỊCH', `BẮN TRƯỢT TẠI ${toaDoDocDuoc}`, 'miss');
        luotNguoiChoi = true;
    }
}
