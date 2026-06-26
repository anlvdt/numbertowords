/**
 * Text constants — single source of truth for user-facing copy (web)
 * Keep claims accurate and verifiable.
 */
'use strict';

const DocSoCopy = {
  brand: {
    name: 'DocSoThanhChu',
    webTagline: 'Công cụ kế toán trên trình duyệt',
    excelTagline: 'Excel Add-in (có AI tùy chọn)',
  },
  privacy: {
    localTools: 'Đọc số, VAT, lương, font, XML: xử lý trên trình duyệt, không gửi dữ liệu về server của dự án.',
    vietqr: 'VietQR: cần internet, ảnh QR lấy từ img.vietqr.io — vui lòng đối chiếu trước khi chuyển khoản.',
    fonts: 'Lần đầu tải trang có thể cần mạng (font Google). Sau đó PWA có thể dùng offline cho phần lớn công cụ.',
  },
  docso: {
    accounting: 'Theo quy tắc đọc số phổ biến trong kế toán VN (TT39/2014/TT-BTC): dùng "nghìn", mười/mươi, mốt/lăm/tư/lẻ.',
    disclaimer: 'Kết quả mang tính tham khảo — nên đối chiếu với quy định nội bộ và chứng từ thực tế.',
  },
  salary: {
    disclaimer: 'Ước tính tham khảo. LCS 2.340.000đ (NĐ 73/2024). LTTV vùng theo NĐ 293/2025. Không bao gồm phụ cấp, thưởng, cam kết lương khác.',
  },
  xml: {
    hint: 'Đọc XML hóa đơn điện tử phổ biến (TT78). Một số mẫu XML từ từng nhà cung cấp có thể khác tag — báo lỗi trên GitHub nếu file không đọc được.',
  },
  excel: {
    vbaFn: '=VND_Vi(A1)',
    officeFn: '=DOCSO.VND_VI(A1)',
    vbaNote: 'VBA (.xlam): Windows & Mac — chỉ hàm trong ô, không có Task Pane AI.',
    officeNote: 'Office.js: Task Pane đọc số + AI (Groq, tùy chọn). Không gồm toàn bộ dashboard web.',
  },
};

if (typeof window !== 'undefined') window.DocSoCopy = DocSoCopy;
