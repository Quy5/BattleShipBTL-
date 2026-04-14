
// Lop dai dien cho mot con thuyen
class Thuyen {
    constructor(ten, doDai) {
        this.ten = ten;
        this.doDai = doDai;
        this.soLanTrung = 0;
        this.daChim = false;
    }

    // Xu ly khi thuyen bi ban trung
    biTrung() {
        this.soLanTrung++;
        if (this.soLanTrung >= this.doDai) this.daChim = true;
        return this.daChim;
    }
}

// Lop quan ly ban co va logic dat thuyen/tan cong
class BanCo {
    constructor(kichThuoc = 10) {
        this.kichThuoc = kichThuoc;
        this.mangLuoi = Array(kichThuoc).fill(null).map(() => Array(kichThuoc).fill(null));
        this.danhSachThuyen = [];
    }

    // Kiem tra xem co the dat thuyen tai vi tri nay khong
    coTheDat(doDaiThuyen, hang, cot, laChieuDoc) {
        for (let i = 0; i < doDaiThuyen; i++) {
            const r = laChieuDoc ? hang + i : hang;
            const c = laChieuDoc ? cot : cot + i;
            
            // Kiem tra gioi han ban co
            if (r < 0 || r >= this.kichThuoc || c < 0 || c >= this.kichThuoc) return false;
            // Kiem tra xem o nay da co thuyen nao chua
            if (this.mangLuoi[r][c] !== null) return false;

            // Kiem tra cac o xung quanh (deman logic: khong cho phep thuyen nam sat nhau)
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < this.kichThuoc && nc >= 0 && nc < this.kichThuoc) {
                        if (this.mangLuoi[nr][nc] !== null) return false;
                    }
                }
            }
        }
        return true;
    }

    // Dat thuyen len ban co
    datThuyen(thuyen, hang, cot, laChieuDoc) {
        if (!this.coTheDat(thuyen.doDai, hang, cot, laChieuDoc)) return false;

        const toaDo = [];
        for (let i = 0; i < thuyen.doDai; i++) {
            const r = laChieuDoc ? hang + i : hang;
            const c = laChieuDoc ? cot : cot + i;
            this.mangLuoi[r][c] = { tenThuyen: thuyen.ten, index: i };
            toaDo.push({ r, c });
        }
        this.danhSachThuyen.push({ 
            ten: thuyen.ten, 
            doDai: thuyen.doDai, 
            toaDo, 
            laChieuDoc 
        });
        return true;
    }

    // Xu ly khi ban co nhan mot don tan cong
    nhanTanCong(hang, cot) {
        const mucTieu = this.mangLuoi[hang][cot];
        if (mucTieu === null) {
            this.mangLuoi[hang][cot] = 'truot';
            return { kieu: 'truot' };
        } else if (mucTieu === 'truot' || mucTieu === 'trung') {
            return { kieu: 'da_ban' };
        } else {
            const tenThuyen = mucTieu.tenThuyen;
            this.mangLuoi[hang][cot] = 'trung';
            
            // Tim thuyen bi ban va tang so lan trung
            const thuyen = this.danhSachThuyen.find(s => s.ten === tenThuyen);
            if (thuyen) {
                thuyen.soLanTrung = (thuyen.soLanTrung || 0) + 1;
                const daChim = thuyen.soLanTrung >= thuyen.doDai;
                return { 
                    kieu: 'trung', 
                    tenThuyen, 
                    daChim,
                    toaDo: daChim ? thuyen.toaDo : [],
                    laChieuDoc: daChim ? thuyen.laChieuDoc : false
                };
            }
            return { kieu: 'trung', tenThuyen };
        }
    }
}

// Quan ly luu tru du lieu vao LocalStorage
const LuuTru = {
    KHOA_LUU: {
        BAN_CO_NGUOI_CHOI: 'btl_player_board_vn',
        BAN_CO_KE_DICH: 'btl_enemy_board_vn',
        THONG_KE: 'btl_stats_vn',
        TRANG_THAI_GAME: 'btl_state_vn'
    },

    luuBanCoNguoiChoi(banCo) {
        localStorage.setItem(this.KHOA_LUU.BAN_CO_NGUOI_CHOI, JSON.stringify(banCo));
    },

    layBanCoNguoiChoi() {
        const duLieu = localStorage.getItem(this.KHOA_LUU.BAN_CO_NGUOI_CHOI);
        return duLieu ? JSON.parse(duLieu) : null;
    },

    luuThongKe(thongKe) {
        localStorage.setItem(this.KHOA_LUU.THONG_KE, JSON.stringify(thongKe));
    },

    layThongKe() {
        const duLieu = localStorage.getItem(this.KHOA_LUU.THONG_KE);
        return duLieu ? JSON.parse(duLieu) : { lanTrung: 0, lanTruot: 0, thoiGianBatDau: Date.now() };
    },

    xoaTatCa() {
        Object.values(this.KHOA_LUU).forEach(khoa => localStorage.removeItem(khoa));
    }
};

// Cau hinh cac loai thuyen trong game
const CAU_HINH_THUYEN = [
    { ten: 'TAU SAN BAY', doDai: 5, icon: '✈', color: 'blue' },
    { ten: 'THIET GIAP HAM', doDai: 4, icon: '⌖', color: 'orange' },
    { ten: 'TAU KHU TRUC', doDai: 3, icon: '🚀', color: 'red' },
    { ten: 'TAU NGAM', doDai: 3, icon: '👁', color: 'green' },
    { ten: 'TAU TUAN TRA', doDai: 2, icon: '⛵', color: 'purple' }
];
