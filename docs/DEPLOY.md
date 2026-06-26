# Hướng Dẫn Deploy GitHub Pages + Google Ads

## Bước 1 — Push code lên GitHub

```bash
cd /Volumes/EXTERNAL/01_DEV_PROJECTS/MyApps/numbertowords

# Nếu chưa có git repo
git init
git add .
git commit -m "feat: add online web tool with Google Ads support"

# Tạo repo trên GitHub rồi push
git remote add origin https://github.com/YOUR_USERNAME/numbertowords.git
git push -u origin main
```

## Bước 2 — Bật GitHub Pages

1. Vào repo trên GitHub → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` · Folder: `/docs`
4. Click **Save**

Sau ~2 phút, site sẽ live tại:
```
https://YOUR_USERNAME.github.io/numbertowords/
```

## Bước 3 — Đăng ký Google AdSense

1. Vào [adsense.google.com](https://adsense.google.com) → Sign in bằng Google
2. Add your site: nhập URL GitHub Pages
3. Chờ Google review (thường 1–3 ngày)
4. Sau khi approved, lấy **Publisher ID** dạng `ca-pub-XXXXXXXXXX`

## Bước 4 — Thêm AdSense vào site

Mở file `docs/index.html`, tìm comment và bỏ comment các đoạn ads:

```html
<!-- TÌM DÒNG NÀY (trong <head>): -->
<!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"... -->

<!-- THAY BẰNG (điền Publisher ID thật): -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"></script>
```

Sau đó thay từng ad unit — tìm `XXXXXXXXXX` và điền đúng Ad Slot ID:

```html
<!-- VỊ TRÍ BANNER ĐẦU TRANG: -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR_ID"
     data-ad-slot="YOUR_SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

### Vị trí 4 chỗ ads trong trang:

| Vị trí | Class | Kích thước đề xuất |
|--------|-------|-------------------|
| Top banner | `.ad-top` | Leaderboard 728×90 hoặc Responsive |
| Trong tool | `.ad-inline` | In-content fluid |
| Sidebar | `.ad-sidebar` | Rectangle 300×250 |
| Giữa trang | `.ad-mid` | Banner responsive |
| Bottom | `.ad-bottom` | Leaderboard responsive |

## Bước 5 — Push cập nhật

```bash
git add docs/index.html
git commit -m "feat: add Google AdSense"
git push
```

GitHub Pages tự động cập nhật sau ~1 phút.

## Tips tăng doanh thu AdSense

- **SEO keywords**: "đọc số thành chữ", "chuyển số thành chữ", "doc so thanh chu" — đã tối ưu trong meta tags
- **Tốc độ tải**: trang tĩnh, không server-side → Core Web Vitals tốt = SEO cao hơn
- **Mobile**: responsive → Google ưu tiên mobile-first indexing
- **Nội dung**: có Guide + FAQ → Google đánh giá trang chất lượng cao
- **Auto ads**: Bật **Auto Ads** trong AdSense dashboard để Google tự tìm vị trí tối ưu
