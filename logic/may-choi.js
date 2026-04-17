
/**
 * Hàm này dùng để sắp xếp ngẫu nhiên 5 chiếc thuyền của kẻ địch lên bàn cờ.
 */
function taoBanCoKeDich() {
    // Duyệt qua từng cấu hình thuyền cài đặt sẵn (ví dụ: Tàu sân bay, Tàu ngầm...)
    CAU_HINH_THUYEN.forEach(cauHinh => {
        let datThanhCong = false;

        // Lặp lại việc tìm vị trí cho đến khi tìm được một chỗ hợp lệ để đặt thuyền
        while (!datThanhCong) {
            // Chọn ngẫu nhiên hàng (0-9) và cột (0-9)
            const hang = Math.floor(Math.random() * 10);
            const cot = Math.floor(Math.random() * 10);

            // Chọn ngẫu nhiên xem thuyền nằm dọc hay nằm ngang (tỉ lệ 50/50)
            const laChieuDoc = Math.random() > 0.5;

            // Tạo đối tượng thuyền mới
            const thuyenMoi = new Thuyen(cauHinh.ten, cauHinh.doDai);

            // Hàm datThuyen sẽ kiểm tra xem vị trí có bị đè lên thuyền khác hay vượt quá bàn cờ không
            // Nếu hợp lệ, thuyền sẽ được đặt và trả về true, vòng lặp dừng lại.
            if (banCoKeDich.datThuyen(thuyenMoi, hang, cot, laChieuDoc)) {
                datThanhCong = true;
            }
        }
    });
}

/**
 * Hàm này xử lý hành động bắn của máy (kẻ địch).
 */
function luotKeDich() {
    // Nếu trò chơi đã kết thúc thì dừng hoạt động
    if (troChoiKetThuc) return;

    let hangMayBan, cotMayBan;

    // 1. CHỌN MỤC TIÊU: Máy sẽ tìm một ô ngẫu nhiên MÀ CHƯA TỪNG BẮN VÀO TRƯỚC ĐÓ.
    let oDaBanRoi = true;
    while (oDaBanRoi) {
        hangMayBan = Math.floor(Math.random() * 10);
        cotMayBan = Math.floor(Math.random() * 10);

        const trangThaiO = banCoNguoiChoi.mangLuoi[hangMayBan][cotMayBan];
        // Nếu ô đó là 'trung' hoặc 'truot', nghĩa là máy đã đổi tọa độ này rồi, phải tìm ô khác
        oDaBanRoi = (trangThaiO === 'trung' || trangThaiO === 'truot');
    }

    // 2. TẤN CÔNG: Ghi nhận đòn tấn công vào hệ thống dữ liệu bàn cờ
    const ketQuaBan = banCoNguoiChoi.nhanTanCong(hangMayBan, cotMayBan);

    // 3. XỬ LÝ GIAO DIỆN
    // Xác định thẻ div trên màn hình tương ứng với tọa độ vừa bắn
    const thuTuO_TrenManHinh = hangMayBan * 10 + cotMayBan;
    const oGiaoDien = document.getElementById('player-grid').children[thuTuO_TrenManHinh];

    // Đổi tọa độ số (VD: 0, 4) thành tọa độ quân sự dễ đọc (VD: A-5) (65 là mã chữ cái 'A')
    const toaDoDocDuoc = `${String.fromCharCode(65 + hangMayBan)}-${cotMayBan + 1}`;

    // 4. KIỂM TRA KẾT QUẢ BẮN
    if (ketQuaBan.kieu === 'trung') {
        // ---------- NẾU MÁY BẮN TRÚNG ---------- //

        oGiaoDien.classList.add('hit'); // Đổi màu ô trên màn hình
        rungManHinh('heavy'); // Hiệu ứng rung khung hình
        ghiNhatKy('ĐỊCH BẮN', `TRÚNG TẠI ${toaDoDocDuoc}`, 'hit');
        capNhatSucManh(); // Giảm thanh máu của người chơi

        // Kiểm tra xem viên đạn có làm chìm thuyền không
        if (ketQuaBan.daChim) {
            AudioSys.playSunk(); // Âm thanh thuyền chìm

            // Vẽ đường gạch ngang/dọc qua con thuyền đã chìm
            const huongVachKe = ketQuaBan.laChieuDoc ? 'sunk-v' : 'sunk-h';
            ketQuaBan.toaDo.forEach(viTri => {
                const viTriManHinh = viTri.r * 10 + viTri.c;
                const oChim = document.getElementById('player-grid').children[viTriManHinh];
                if (oChim) oChim.classList.add('sunk-mark', huongVachKe);
            });
        } else {
            AudioSys.playHit(); // Âm thanh nổ bình thường
        }

        // Luật trò chơi: Bắn trúng thì máy được bắn tiếp phát nữa
        if (!kiemTraKetThuc()) {
            setTimeout(luotKeDich, 800); // Dừng 0.8 giây rồi gọi lại hàm này
        }

    } else {
        // ---------- NẾU MÁY BẮN TRƯỢT ---------- //

        AudioSys.playMiss(); // Âm thanh rớt xuống nước
        oGiaoDien.classList.add('miss');
        ghiNhatKy('ĐỊCH BẮN', `BẮN TRƯỢT TẠI ${toaDoDocDuoc}`, 'miss');

        // Hết lượt, báo hiệu để người chơi tiếp tục
        luotNguoiChoi = true;
    }
}
