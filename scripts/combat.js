
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
};

// Tu dong tao ban co cua may (ke dich)
function taoBanCoKeDich() {
    CAU_HINH_THUYEN.forEach(cfg => {
        let daDat = false;
        while (!daDat) {
            const r = Math.floor(Math.random() * 10);
            const c = Math.floor(Math.random() * 10);
            const v = Math.random() > 0.5;
            const thuyenMoi = new Thuyen(cfg.ten, cfg.doDai);
            if (banCoKeDich.datThuyen(thuyenMoi, r, c, v)) daDat = true;
        }
    });
}

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

// Khi nguoi choi chon mot o de ban tren ban co dich
function xuLyChonMucTieu(r, c) {
    if (!luotNguoiChoi || troChoiKetThuc) return;
    if (banCoKeDich.mangLuoi[r][c] === 'trung' || banCoKeDich.mangLuoi[r][c] === 'truot') return;

    // Xoa muc tieu cu da chon
    document.querySelectorAll('.cell.targeted').forEach(cell => cell.classList.remove('targeted'));
    
    mucTieuDaChon = { r, c };
    const cell = document.getElementById(`e-cell-${r}-${c}`);
    cell.classList.add('targeted');

    const nutKhaiHoa = document.getElementById('fire-btn');
    if (nutKhaiHoa) nutKhaiHoa.disabled = false;
    
    capNhatNhatKyHienTai(`DANG KHOA MUC TIEU...`);
}

// Thuc hien lenh ban
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
        ghiNhatKy(toaDoVanBan, 'TRUNG MUC TIEU', 'hit');
        
        if (ketQua.daChim) {
            ghiNhatKy('SYSTEM', `THUYEN DICH ${ketQua.tenThuyen} DA CHIM`, 'sunk');
            const lopChieu = ketQua.laChieuDoc ? 'sunk-v' : 'sunk-h';
            ketQua.toaDo.forEach(pos => {
                const cellChim = document.getElementById(`e-cell-${pos.r}-${pos.c}`);
                if (cellChim) cellChim.classList.add('sunk-mark', lopChieu);
            });
        }
        kiemTraKetThuc();
    } else if (ketQua.kieu === 'truot') {
        cell.classList.add('miss');
        soLanTruot++;
        ghiNhatKy(toaDoVanBan, 'BAN TRUOT', 'miss');
        luotNguoiChoi = false;
        setTimeout(luotKeDich, 800);
    }
    
    capNhatThongKe();
}

// Luot may ban (Ke dich)
function luotKeDich() {
    if (troChoiKetThuc) return;
    
    let r, c;
    do {
        r = Math.floor(Math.random() * 10);
        c = Math.floor(Math.random() * 10);
    } while (banCoNguoiChoi.mangLuoi[r][c] === 'trung' || banCoNguoiChoi.mangLuoi[r][c] === 'truot');

    const ketQua = banCoNguoiChoi.nhanTanCong(r, c);
    const idO = r * 10 + c;
    const cell = document.getElementById('player-grid').children[idO];
    const toaDoVanBan = `${String.fromCharCode(65 + r)}-${c + 1}`;

    if (ketQua.kieu === 'trung') {
        cell.classList.add('hit');
        rungManHinh('heavy');
        ghiNhatKy('DICH BAN', `TRUNG TAI ${toaDoVanBan}`, 'hit');
        capNhatSucManh();
        
        if (ketQua.daChim) {
            const lopChieu = ketQua.laChieuDoc ? 'sunk-v' : 'sunk-h';
            ketQua.toaDo.forEach(pos => {
                const cellChim = document.getElementById('player-grid').children[pos.r * 10 + pos.c];
                if (cellChim) cellChim.classList.add('sunk-mark', lopChieu);
            });
        }
        if (!kiemTraKetThuc()) setTimeout(luotKeDich, 800);
    } else {
        cell.classList.add('miss');
        ghiNhatKy('DICH BAN', `BAN TRUOT TAI ${toaDoVanBan}`, 'miss');
        luotNguoiChoi = true;
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
    localStorage.setItem('btl_final_stats_vn', JSON.stringify({
        win: thang, 
        shots: soLuotBan,
        accuracy: Math.round((soLanTrung / soLuotBan) * 100),
        duration: Math.round((Date.now() - thoiGianBatDau) / 1000)
    }));
    setTimeout(() => location.href = 'victory.html', 1500);
}

// Dang ky cac su kien nut bam trong tran dau
function dangKySuKien() {
    document.getElementById('fire-btn').onclick = khaiHoa;
    document.getElementById('restart-btn').onclick = () => {
        if (confirm("HUY BO NHIEM VU?")) location.href = 'index.html';
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
