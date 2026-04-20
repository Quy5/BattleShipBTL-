
const LuuTru = {
    KHOA_LUU: {
        BAN_CO_NGUOI_CHOI: 'btl_player_board_vn',
        BAN_CO_KE_DICH: 'btl_enemy_board_vn',
        THONG_KE: 'btl_stats_vn',
        TRANG_THAI_GAME: 'btl_state_vn',
        DO_KHO: 'btl_difficulty_vn'
    },

    luuBanCoNguoiChoi(banCo) {
        localStorage.setItem(this.KHOA_LUU.BAN_CO_NGUOI_CHOI, JSON.stringify(banCo));
    },

    layBanCoNguoiChoi() {
        const duLieu = localStorage.getItem(this.KHOA_LUU.BAN_CO_NGUOI_CHOI);
        return duLieu ? JSON.parse(duLieu) : null;
    },

    luuDoKho(mucDo) {
        localStorage.setItem(this.KHOA_LUU.DO_KHO, mucDo);
    },

    layDoKho() {
        return localStorage.getItem(this.KHOA_LUU.DO_KHO) || 'de'; // Mac dinh la de
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
