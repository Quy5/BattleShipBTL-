
let banCo = new BanCo();
let danhSachThuyenDaDat = [];
let thuyenHienTaiIdx = 0;
let dangChieuDoc = false;

// Khoi chay khi trang duoc tai xong
window.onload = () => {
    hienThiNhan();
    veBanCo();
    dangKySuKien();
    capNhatGiaoDien();
    AudioSys.startBGM();
};

// Hien thi toa do A-J va 1-10
function hienThiNhan() {
    const top = document.getElementById('labels-top');
    const left = document.getElementById('labels-left');

    for (let i = 1; i <= 10; i++) {
        const l = document.createElement('div');
        l.className = 'grid-label';
        l.innerText = i;
        top.appendChild(l);
    }
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].forEach(lText => {
        const l = document.createElement('div');
        l.className = 'grid-label-v';
        l.innerText = lText;
        left.appendChild(l);
    });
}

// Ve luoi ban co de dat thuyen
function veBanCo() {
    const grid = document.getElementById('deployment-grid');
    grid.innerHTML = '';

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.onclick = () => xuLyClickO(r, c);
            cell.onmouseover = () => xuLyHoverO(r, c, true);
            cell.onmouseout = () => xuLyHoverO(r, c, false);
            grid.appendChild(cell);
        }
    }
}

// Tim thuyen tiep theo chua duoc dat
function timThuyenTiepTheo() {
    for (let i = 0; i < CAU_HINH_THUYEN.length; i++) {
        if (!danhSachThuyenDaDat.some(s => s.ten === CAU_HINH_THUYEN[i].ten)) {
            return i;
        }
    }
    return CAU_HINH_THUYEN.length; // Da dat het
}

// Xu ly khi nguoi dung bam vao mot o de dat thuyen
function xuLyClickO(r, c) {
    if (thuyenHienTaiIdx >= CAU_HINH_THUYEN.length) return;

    const cauHinh = CAU_HINH_THUYEN[thuyenHienTaiIdx];
    const thuyenMoi = new Thuyen(cauHinh.ten, cauHinh.doDai);

    if (banCo.datThuyen(thuyenMoi, r, c, dangChieuDoc)) {
        danhSachThuyenDaDat.push({ ten: cauHinh.ten, r, c, v: dangChieuDoc });
        thuyenHienTaiIdx = timThuyenTiepTheo();
        capNhatGiaoDien();
    }
}

// Hien thi xem truoc thuyen khi di chuot qua
function xuLyHoverO(r, c, dangVao) {
    // Xoa trang thai xem truoc cu
    document.querySelectorAll('.cell.preview, .cell.invalid').forEach(cl => {
        const laThuyenCoDinh = cl.classList.contains('ship');
        cl.classList.remove('preview', 'invalid');
        if (!laThuyenCoDinh) {
            cl.classList.remove('blue', 'orange', 'red', 'green', 'purple');
        }
    });

    if (thuyenHienTaiIdx >= CAU_HINH_THUYEN.length || !dangVao) return;

    const cauHinh = CAU_HINH_THUYEN[thuyenHienTaiIdx];
    const coTheDat = banCo.coTheDat(cauHinh.doDai, r, c, dangChieuDoc);

    for (let i = 0; i < cauHinh.doDai; i++) {
        const rr = dangChieuDoc ? r + i : r;
        const cc = dangChieuDoc ? c : c + i;

        if (rr < 10 && cc < 10) {
            const cell = document.querySelector(`.cell[data-row="${rr}"][data-col="${cc}"]`);
            if (cell) {
                if (coTheDat) {
                    cell.classList.add('preview', cauHinh.color);
                } else {
                    cell.classList.add('invalid');
                }
            }
        }
    }
}

// Cap nhat toan bo giao dien trang dat thuyen
function capNhatGiaoDien() {
    lamMoiBanCo();
    hienThiDanhSachThuyen();
    document.getElementById('battle-btn').disabled = danhSachThuyenDaDat.length < CAU_HINH_THUYEN.length;
    document.getElementById('placed-count').innerText = danhSachThuyenDaDat.length;
}

// Hien thi danh sach thuyen o thanh ben
function hienThiDanhSachThuyen() {
    const list = document.getElementById('ship-list');
    list.innerHTML = '';
    CAU_HINH_THUYEN.forEach((cfg, index) => {
        const daDat = danhSachThuyenDaDat.some(s => s.ten === cfg.ten);
        const item = document.createElement('div');
        item.className = `ship-item ${cfg.color}`;
        if (index === thuyenHienTaiIdx) item.classList.add('active');
        if (daDat) item.classList.add('placed');

        let segmentsHTML = '';
        for (let i = 0; i < cfg.doDai; i++) {
            segmentsHTML += `<div class="segment ${!daDat && index === thuyenHienTaiIdx ? 'filled' : ''}"></div>`;
        }

        item.innerHTML = `
            <div class="ship-icon">${cfg.icon}</div>
            <div class="ship-info">
                <div class="info-header"><h3>${cfg.ten}</h3><span class="status-label">${daDat ? 'SAN SANG' : 'DANG DOI...'}</span></div>
                <div class="segmented-bar">${segmentsHTML}</div>
            </div>
        `;

        item.onclick = () => { if (!daDat) { thuyenHienTaiIdx = index; capNhatGiaoDien(); } };
        list.appendChild(item);
    });
}

// Ve lai thuyen da dat tren ban co
function lamMoiBanCo() {
    document.querySelectorAll('.cell').forEach(cell => {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        cell.className = 'cell';
        const nguoiO = banCo.mangLuoi[r][c];
        if (nguoiO && typeof nguoiO === 'object') {
            const cauHinh = CAU_HINH_THUYEN.find(s => s.ten === nguoiO.tenThuyen);
            cell.classList.add('ship', cauHinh.color);
        }
    });
}

// Dang ky cac su kien nut bam
function dangKySuKien() {
    const nutNgauNhien = document.getElementById('shuffle-btn');
    if (nutNgauNhien) nutNgauNhien.onclick = tuDongDatThuyen;

    const nutXoay = document.getElementById('rotate-btn');
    if (nutXoay) nutXoay.onclick = () => {
        dangChieuDoc = !dangChieuDoc;
        document.getElementById('orientation-mode').innerText = dangChieuDoc ? 'CHIEU DOC' : 'CHIEU NANG';
    };

    const nutXoa = document.getElementById('clear-btn');
    if (nutXoa) nutXoa.onclick = () => {
        if (confirm("XOA TAT CA THUYEN DA DAT?")) {
            banCo = new BanCo();
            danhSachThuyenDaDat = [];
            thuyenHienTaiIdx = 0;
            capNhatGiaoDien();
        }
    };

    const nutChienDau = document.getElementById('battle-btn');
    if (nutChienDau) nutChienDau.onclick = () => {
        LuuTru.luuBanCoNguoiChoi(banCo);
        location.href = 'combat.html';
    };
}

// Tu dong sap xep thuyen ngau nhien
function tuDongDatThuyen() {
    banCo = new BanCo();
    danhSachThuyenDaDat = [];
    CAU_HINH_THUYEN.forEach(cfg => {
        let daDat = false;
        while (!daDat) {
            const r = Math.floor(Math.random() * 10);
            const c = Math.floor(Math.random() * 10);
            const v = Math.random() > 0.5;
            const thuyenMoi = new Thuyen(cfg.ten, cfg.doDai);
            if (banCo.datThuyen(thuyenMoi, r, c, v)) {
                danhSachThuyenDaDat.push({ ten: cfg.ten, r, c, v });
                daDat = true;
            }
        }
    });
    thuyenHienTaiIdx = CAU_HINH_THUYEN.length;
    capNhatGiaoDien();
}
