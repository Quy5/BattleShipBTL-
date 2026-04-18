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

    coTheDat(doDaiThuyen, hang, cot, laChieuDoc) {
        for (let i = 0; i < doDaiThuyen; i++) {
            const r = laChieuDoc ? hang + i : hang;
            const c = laChieuDoc ? cot : cot + i;

            if (r < 0 || r >= this.kichThuoc || c < 0 || c >= this.kichThuoc) return false;
            if (this.mangLuoi[r][c] !== null) return false;

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

            const thuyen = this.danhSachThuyen.find(s => s.ten === tenThuyen);
            if (thuyen) {
                thuyen.soLanTrung = (thuyen.soLanTrung || 0) + 1;
                const daChim = thuyen.soLanTrung >= thuyen.doDai;
                thuyen.daChim = daChim;
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

// Cau hinh cac loai thuyen trong game
const CAU_HINH_THUYEN = [
    { ten: 'TAU SAN BAY', doDai: 5, icon: '✈', color: 'blue' },
    { ten: 'THIET GIAP HAM', doDai: 4, icon: '⌖', color: 'orange' },
    { ten: 'TAU KHU TRUC', doDai: 3, icon: '🚀', color: 'red' },
    { ten: 'TAU NGAM', doDai: 3, icon: '👁', color: 'green' },
    { ten: 'TAU TUAN TRA', doDai: 2, icon: '⛵', color: 'purple' }
];
