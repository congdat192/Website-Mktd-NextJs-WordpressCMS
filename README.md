# WordPress Headless Frontend - Next.js 15

Dự án frontend Next.js 15 với App Router, TypeScript và Tailwind CSS, đóng vai trò headless frontend cho WordPress CMS.

## 🚀 Tính năng

- ✅ **Next.js 15** với App Router
- ✅ **TypeScript** cho type safety
- ✅ **Tailwind CSS** cho styling
- ✅ **WordPress REST API** integration
- ✅ **ISR (Incremental Static Regeneration)** với revalidate 60s
- ✅ **SEO-friendly** với dynamic metadata
- ✅ **Responsive design** cho mobile và desktop
- ✅ Sẵn sàng deploy lên **Vercel**

## 📁 Cấu trúc dự án

```
.
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   ├── page.tsx          # Chi tiết bài viết
│   │   │   └── not-found.tsx     # 404 cho blog
│   │   └── page.tsx              # Danh sách blog
│   ├── pages/
│   │   └── [slug]/
│   │       ├── page.tsx          # WordPress pages
│   │       └── not-found.tsx     # 404 cho pages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx             # Global 404
│   └── page.tsx                  # Homepage
├── components/
│   ├── Header.tsx                # Header component
│   └── Footer.tsx                # Footer component
├── lib/
│   └── wordpress.ts              # WordPress API client
├── .env.example                  # Environment variables template
├── next.config.mjs               # Next.js configuration
├── tailwind.config.mjs           # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## 🛠️ Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env.local` từ template:

```bash
cp .env.example .env.local
```

Sau đó chỉnh sửa `.env.local` và thay đổi URL WordPress API của bạn:

```env
NEXT_PUBLIC_WP_API_URL="https://cms.matkinhtamduc.com/wp-json"
```

**Lưu ý:** Thay `https://cms.matkinhtamduc.com` bằng domain WordPress thực tế của bạn.

### 3. Chạy development server

```bash
npm run dev
```

Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)

## 📝 Các lệnh có sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start` - Chạy production server
- `npm run lint` - Chạy ESLint

## 🌐 WordPress API Configuration

Dự án sử dụng WordPress REST API để lấy dữ liệu. Các endpoint được sử dụng:

- **Posts:** `{WP_API_URL}/wp/v2/posts`
- **Pages:** `{WP_API_URL}/wp/v2/pages`

### Yêu cầu WordPress

1. WordPress phải bật REST API (mặc định đã bật)
2. Nếu WordPress ở domain khác, cần cấu hình CORS
3. Đảm bảo các bài viết/trang đã được publish

### Cấu hình CORS (nếu cần)

Thêm vào `wp-config.php` hoặc sử dụng plugin:

```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
```

## 🎨 Customization

### Thay đổi branding

Chỉnh sửa các file sau:

- `components/Header.tsx` - Logo và menu
- `components/Footer.tsx` - Footer content
- `app/layout.tsx` - Metadata (title, description)
- `app/page.tsx` - Homepage content

### Thêm routes mới

Tạo thư mục mới trong `app/` theo cấu trúc App Router của Next.js:

```
app/
  products/
    page.tsx          # /products
    [slug]/
      page.tsx        # /products/[slug]
```

### Styling

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.mjs`
- Component styles: Sử dụng Tailwind utility classes

## 🚀 Deploy lên Vercel

### Cách 1: Deploy qua Vercel Dashboard

1. Push code lên GitHub
2. Truy cập [vercel.com](https://vercel.com)
3. Import repository
4. Thêm biến môi trường `NEXT_PUBLIC_WP_API_URL`
5. Deploy

### Cách 2: Deploy qua Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy production
vercel --prod
```

**Lưu ý:** Nhớ thêm biến môi trường trong Vercel dashboard:
- Settings → Environment Variables
- Thêm `NEXT_PUBLIC_WP_API_URL` với giá trị WordPress API URL

## 📚 Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🔧 Troubleshooting

### Không load được bài viết

1. Kiểm tra `NEXT_PUBLIC_WP_API_URL` trong `.env.local`
2. Kiểm tra WordPress REST API có hoạt động: `{WP_URL}/wp-json/wp/v2/posts`
3. Kiểm tra CORS nếu WordPress ở domain khác
4. Xem console log để biết lỗi cụ thể

### Build error

1. Chạy `npm install` lại
2. Xóa `.next` folder và build lại
3. Kiểm tra TypeScript errors với `npm run lint`

### Images không hiển thị

1. Kiểm tra `next.config.mjs` có cấu hình `remotePatterns`
2. Đảm bảo WordPress media URLs accessible
3. Kiểm tra featured images đã được set trong WordPress

## 📄 License

MIT License - Tự do sử dụng cho dự án cá nhân và thương mại.

## 👨‍💻 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra phần Troubleshooting ở trên
2. Xem lại cấu hình WordPress API
3. Kiểm tra console log và terminal output

---

**Phát triển bởi:** Mắt Kính Tâm Đức Development Team
