# Hướng Dẫn Cài Đặt (Dành Cho Normal & Advanced Users)

Tùy theo thói quen và nhu cầu, bạn có thể chọn phiên bản phát hành phù hợp:

---

## 🟢 PHÂN CẤP 1: NORMAL USER (Kế Toán/Văn Phòng Truyền Thống)

Đây là cách đơn giản, cổ điển và quen thuộc nhất với đa số dân văn phòng Việt Nam. Chế độ này thích hợp khi bạn chỉ cần gõ hàm `=DOCSO.VND_VI()` đơn thuần giống các Plugin ngày xưa.

**Cách Cài Đặt Truyền Thống (Sử dụng tải nguyên bản file .xlam):**
1. Tải về file `legacy-vba/DocSoThanhChu.xlam` (hoặc dùng `legacy-vba/Install.vbs` để cài one-click trên Windows). Bạn nên chép file này vào ổ đĩa D hoặc C để cố định vĩnh viễn (tránh để ngoài Desktop rồi vô tình xóa mắt).
2. Khởi động phần mềm Excel trắng.
3. Vào Menu **File** > **Options** > Nhìn bến tay trái chọn thẻ **Add-ins**.
4. Dưới đáy cửa sổ, phần *Manage* để nguyên "Excel Add-ins", bạn bấm chữ **[Go...]**.
5. Trong bảng hiện ra, bấm vào nút **[Browse...]** (Duyệt) và trỏ thẳng vào nơi bạn cất file gốc `DocSoThanhChu.xlam` ở Bước 1. 
6. Đảm bảo ô trống bên cạnh chữ "Docsothanhchu" có dấu Tick (V). Bấm **OK**.

**Ưu điểm:** Bất tử, không cần mạng, vô hình đối với màn hình làm việc, quen thuộc tuyệt đối 100%.

---

## 🚀 PHÂN CẤP 2: ADVANCED USER (Có Tool Giao Diện & AI Mới)

Sử dụng phiên bản này nếu bạn cần dùng **Chế độ Máy tính Web (All-in-One Dashboard)** hoặc ứng dụng AI Llama phân tích dữ liệu ngay trên thanh Ribbon (Mở Sidebar bên tay phải màn hình Excel).

### Đối với cài tự động trên Windows (Sử dụng Batch Script):
1. Giải nén **Phiên bản Advanced (Bản ZIP)**.
2. Chạy nháy đúp vào file `CAI_DAT_WINDOWS.cmd`. 
3. Hệ thống sẽ bí mật tự Copy tệp cài vào lõi `Microsoft\AddIns\` giùm bạn. Một thông báo mọc lên nhắc bạn vào Excel làm đúng thao tác tick tùy chọn Addin là xong.

### Đối với cài trên môi trường Mac / Web Office 365 (Sideload AI Panel):
1. Tải về file trích xuất tên là `manifest-prod.xml`.
2. Mở Excel, tìm đến Tab `Insert` > Bấm `Get Add-ins` (hoặc Cửa hàng Tiện ích).
3. Chọn ngay tab `Upload My Add-in` (Tải lên Add-in Của Tôi).
4. Bạn ném file manifest vừa tải vào. Thanh tiêu đề "Home" của Excel sẽ hiện mấu chốt Nút Panel màu xanh có sức mạnh AI.

### Truy cập Siêu Công Cụ Trình Duyệt:
Bất kể bạn dùng cấp độ nào, môi trường Hub Toàn Diện (Không Cần Cài Đặt) của bạn luôn đón chào 24/7 trực tiếp trên Web tại: 👉  `https://anlvdt.github.io/numbertowords/`
