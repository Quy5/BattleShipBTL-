
let banCoNguoiChoi, banCoKeDich;
let sucManhNguoiChoi = 100, sucManhKeDich = 100;
let soLanTrung = 0, soLanTruot = 0;
let soLuotBan = 0;
let thoiGianBatDau = Date.now();
let mucTieuDaChon = null;
let luotNguoiChoi = true;
let troChoiKetThuc = false;

// Khoi chay khi vao trang chien dau
window.onload = () => {
    const duLieuSaved = LuuTru.layBanCoNguoiChoi();
    if (!duLieuSaved) {
        location.href = 'deployment.html';
        return;
    }

    // Khoi tao ban co nguoi choi tu du lieu da luu
    banCoNguoiChoi = new BanCo();
    banCoNguoiChoi.mangLuoi = duLieuSaved.mangLuoi;
    banCoNguoiChoi.danhSachThuyen = duLieuSaved.danhSachThuyen;

    // Khoi tao ban co ke dich ngau nhien
    banCoKeDich = new BanCo();
    taoBanCoKeDich();

    veBanCo();
    dangKySuKien();
    capNhatThongKe();
    capNhatSucManh();

    // Bo dem thoi gian
    setInterval(() => {
        if (troChoiKetThuc) return;
        const thoiGianTroiQua = Math.floor((Date.now() - thoiGianBatDau) / 1000);
        const timerEl = document.getElementById('turn-timer');
        if (timerEl) timerEl.innerText = (thoiGianTroiQua % 60).toString().padStart(2, '0');
    }, 1000);

    // Thu bat dau BGM
    AudioSys.startBGM();
};

// Ve luoi ban co cho ca nguoi choi va ke dich
function veBanCo() {
    const pGrid = document.getElementById('player-grid');
    const eGrid = document.getElementById('enemy-grid');
    pGrid.innerHTML = ''; eGrid.innerHTML = '';

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            // Ban co nguoi choi (hien thi thuyen cua minh)
            const pCell = document.createElement('div');
            pCell.className = 'cell';
            const oNguoiChoi = banCoNguoiChoi.mangLuoi[r][c];
            if (oNguoiChoi && typeof oNguoiChoi === 'object') {
                const cfg = CAU_HINH_THUYEN.find(s => s.ten === oNguoiChoi.tenThuyen);
                const mauSac = cfg ? cfg.color : 'blue';
                pCell.classList.add('ship', mauSac);
            }
            pGrid.appendChild(pCell);

            // Ban co ke dich (che giau thuyen)
            const eCell = document.createElement('div');
            eCell.className = 'cell';
            eCell.id = `e-cell-${r}-${c}`;
            eCell.onclick = () => xuLyChonMucTieu(r, c);
            eGrid.appendChild(eCell);
        }
    }
}

// Ghi thong tin vao nhat ky chien dau
function ghiNhatKy(toaDo, trangThai, kieu) {
    const logEl = document.getElementById('combat-log');
    const dongMoi = document.createElement('div');
    dongMoi.className = `log-entry ${kieu}`;

    const id = soLuotBan.toString().padStart(2, '0');
    dongMoi.innerHTML = `<span class="id">${id}:</span> <span class="status">${trangThai}</span>`;

    const hienTai = logEl.querySelector('.log-entry.active');
    if (hienTai) hienTai.remove();

    logEl.appendChild(dongMoi);
    logEl.scrollLeft = logEl.scrollWidth;
}

// Cap nhat trang thai dang theo doi trong nhat ky
function capNhatNhatKyHienTai(vanBan) {
    const logEl = document.getElementById('combat-log');
    let hienTai = logEl.querySelector('.log-entry.active');
    if (!hienTai) {
        hienTai = document.createElement('div');
        hienTai.className = 'log-entry active';
        logEl.appendChild(hienTai);
    }
    const id = (soLuotBan + 1).toString().padStart(2, '0');
    hienTai.innerHTML = `<span class="id">${id}:</span> DANG THEO DOI...`;
    logEl.scrollLeft = logEl.scrollWidth;
}

// Cap nhat thanh mau (suc manh) cua nguoi choi
function capNhatSucManh() {
    const tongOThuyen = banCoNguoiChoi.danhSachThuyen.reduce((acc, s) => acc + s.doDai, 0);
    const soLanBiTrung = document.querySelectorAll('#player-grid .cell.hit').length;
    sucManhNguoiChoi = Math.round(((tongOThuyen - soLanBiTrung) / tongOThuyen) * 100);

    document.getElementById('player-integrity-fill').style.width = sucManhNguoiChoi + '%';
    document.getElementById('player-integrity').innerText = sucManhNguoiChoi + '%';
}

// Cap nhat thong ke do chinh xac
function capNhatThongKe() {
    const tongSoPhatBan = soLanTrung + soLanTruot;
    const doChinhXac = tongSoPhatBan > 0 ? Math.round((soLanTrung / tongSoPhatBan) * 100) : 0;
    document.getElementById('acc-fill').style.width = doChinhXac + '%';
    document.getElementById('acc-value').innerText = doChinhXac + '%';
}

// Kiem tra xem game da ket thuc chua
function kiemTraKetThuc() {
    const tongOThuyen = CAU_HINH_THUYEN.reduce((acc, s) => acc + s.doDai, 0);
    const diemNguoiChoi = document.querySelectorAll('#enemy-grid .cell.hit').length;
    const diemKeDich = document.querySelectorAll('#player-grid .cell.hit').length;

    if (diemNguoiChoi === tongOThuyen) { ketThucGame(true); return true; }
    if (diemKeDich === tongOThuyen) { ketThucGame(false); return true; }
    return false;
}

// Xu ly khi game ket thuc (thang hoac thua)
function ketThucGame(thang) {
    troChoiKetThuc = true;

    const soThuyenDichChim = banCoKeDich.danhSachThuyen.filter(s => (s.soLanTrung || 0) >= s.doDai).length;

    localStorage.setItem('btl_final_stats_vn', JSON.stringify({
        win: thang,
        shots: soLuotBan,
        accuracy: Math.round((soLanTrung / soLuotBan) * 100) || 0,
        sunk: soThuyenDichChim,
        duration: Math.round((Date.now() - thoiGianBatDau) / 1000)
    }));
    setTimeout(() => location.href = 'victory.html', 1500);
}

// Dang ky cac su kien nut bam trong tran dau
function dangKySuKien() {
    document.getElementById('fire-btn').onclick = khaiHoa;
    document.getElementById('restart-btn').onclick = () => {
        if (confirm("HUY BO NHIEM VU?")) location.href = 'home.html';
    };
}

// Hieu ung rung man hinh khi bi ban trung
function rungManHinh(cuongDo = 'light') {
    const body = document.body;
    body.classList.remove('shake-light', 'shake-heavy');
    void body.offsetWidth; // kich hoat reflow
    body.classList.add(cuongDo === 'heavy' ? 'shake-heavy' : 'shake-light');
    setTimeout(() => {
        body.classList.remove('shake-light', 'shake-heavy');
    }, 500);
}
