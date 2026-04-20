
function xuLyChonMucTieu(r, c) {
    if (!luotNguoiChoi || troChoiKetThuc) return;
    if (banCoKeDich.mangLuoi[r][c] === 'trung' || banCoKeDich.mangLuoi[r][c] === 'truot') return;

    document.querySelectorAll('.cell.targeted').forEach(cell => cell.classList.remove('targeted'));

    mucTieuDaChon = { r, c };
    const cell = document.getElementById(`e-cell-${r}-${c}`);
    cell.classList.add('targeted');

    const nutKhaiHoa = document.getElementById('fire-btn');
    if (nutKhaiHoa) nutKhaiHoa.disabled = false;

    capNhatNhatKyHienTai(`DANG KHOA MUC TIEU...`);
}

function khaiHoa() {
    if (!mucTieuDaChon || !luotNguoiChoi || troChoiKetThuc) return;

    const { r, c } = mucTieuDaChon;
    mucTieuDaChon = null;
    soLuotBan++;

    const cell = document.getElementById(`e-cell-${r}-${c}`);
    cell.classList.remove('targeted');

    const nutKhaiHoa = document.getElementById('fire-btn');
    if (nutKhaiHoa) nutKhaiHoa.disabled = true;

    const ketQua = banCoKeDich.nhanTanCong(r, c);
    const toaDoVanBan = `${String.fromCharCode(65 + r)}-${c + 1}`;

    if (ketQua.kieu === 'trung') {
        const cfg = CAU_HINH_THUYEN.find(s => s.ten === ketQua.tenThuyen);
        cell.classList.add('hit', 'ship', cfg ? cfg.color : 'blue');
        rungManHinh('light');
        soLanTrung++;
        ghiNhatKy('NGƯỜI CHƠI', `BẮN TRÚNG TẠI ${toaDoVanBan}`, 'hit');

        if (ketQua.daChim) {
            AudioSys.playSunk();
            ghiNhatKy('HỆ THỐNG', `THUYỀN ĐỊCH ${ketQua.tenThuyen} ĐÃ CHÌM`, 'sunk');
            const lopChieu = ketQua.laChieuDoc ? 'sunk-v' : 'sunk-h';
            ketQua.toaDo.forEach(pos => {
                const cellChim = document.getElementById(`e-cell-${pos.r}-${pos.c}`);
                if (cellChim) cellChim.classList.add('sunk-mark', lopChieu);
            });
        } else {
            AudioSys.playHit();
        }
        kiemTraKetThuc();
    } else if (ketQua.kieu === 'truot') {
        AudioSys.playMiss();
        cell.classList.add('miss');
        soLanTruot++;
        ghiNhatKy('NGƯỜI CHƠI', `BẮN TRƯỢT TẠI ${toaDoVanBan}`, 'miss');
        luotNguoiChoi = false;
        setTimeout(luotKeDich, 800);
    }

    capNhatThongKe();
}
