# Wellora — Hệ thống Website & Quản trị Lịch hẹn Phòng khám

Hệ thống website giới thiệu phòng khám, đặt lịch khám trực tuyến và quản trị lịch hẹn cho nhân viên y tế / lễ tân tại Wellora Healthcare.

Được xây dựng theo hợp đồng kỹ thuật và quy chuẩn UI/UX tại `AGENTS.md` và thư mục `docs/`.

---

## 1. Kiến trúc hệ thống

Dự án áp dụng mô hình **Monorepo** với `npm workspaces`:
- `apps/web`: Ứng dụng Frontend xây dựng bằng **Next.js (App Router)**, React 18, TypeScript (strict), Tailwind CSS và Design Tokens tập trung tại `apps/web/src/styles/tokens.css`.
- `apps/api`: Dịch vụ Backend REST API xây dựng bằng **NestJS**, TypeScript (strict), OpenAPI (Swagger), Class-Validator và **Prisma ORM**.
- `infrastructure/docker-compose.yml`: Cấu hình PostgreSQL 16 local chạy trên cổng `5435` (tránh xung đột với cổng 5432-5434).

---

## 2. Yêu cầu môi trường

- **Node.js**: >= v20.18.0
- **npm**: >= 10.8.0
- **Docker & Docker Compose** (để khởi chạy PostgreSQL local)

---

## 3. Cài đặt và Khởi chạy

### Bước 1: Khởi động cơ sở dữ liệu PostgreSQL
```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

### Bước 2: Cài đặt dependencies (tại root repo)
```bash
npm install
```

### Bước 3: Áp dụng Migration & Tạo Client Prisma
```bash
npm run db:migrate
```

### Bước 4: Nạp dữ liệu mẫu phát triển (Seed Development Only)
```bash
npm run db:seed
```

> **Lưu ý bảo mật & dữ liệu y tế:** Dữ liệu seed chỉ sử dụng cho môi trường kiểm thử cục bộ (`development`). Script seed tự động từ chối chạy khi phát hiện `NODE_ENV=production`.

### Bước 5: Chạy đồng thời cả API và Web

**Chạy API (Port 4000):**
```bash
npm run dev:api
```
- Endpoint REST API: `http://localhost:4000/api/v1`
- Tài liệu tương tác Swagger / OpenAPI: `http://localhost:4000/api/docs`

**Chạy Web (Port 3000):**
```bash
npm run dev:web
```
- Truy cập trang chủ: `http://localhost:3000`
- Đặt lịch khám: `http://localhost:3000/dat-lich`
- Tra cứu lịch hẹn: `http://localhost:3000/dat-lich/xac-nhan`
- Cổng quản trị nhân viên: `http://localhost:3000/admin/dang-nhap`

---

## 4. Tài khoản kiểm thử nội bộ (Seed Data)

| Vai trò | Email đăng nhập | Mật khẩu mặc định |
| :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@wellora.local` | `WelloraDev123!@#` |
| **Lễ tân / Nhân viên (Staff)** | `staff@wellora.local` | `WelloraDev123!@#` |
| **Bác sĩ (Practitioner)** | `doctor.ha@wellora.local` | `WelloraDev123!@#` |

---

## 5. Lệnh kiểm thử và kiểm tra chất lượng mã nguồn

```bash
# Chạy toàn bộ Unit & Integration tests (Kiểm tra chống race condition đặt trùng slot)
npm run test

# Kiểm tra chặt chẽ TypeScript strict cho cả Web và API
npm run typecheck

# Build toàn bộ monorepo (Tạo bản dựng production)
npm run build
```

---

## 6. Các quyết định thiết kế nổi bật

1. **Logo & Thương hiệu**: Asset web `apps/web/public/images/brand/wellora-logo.png` được crop tối ưu tỷ lệ từ bản gốc `wellora_logo.png` (1536×1024 RGBA), giữ nguyên vẹn ánh sáng cyan/teal, đường nét và độ trong suốt của logo trên nền xanh đen (`brand-950`).
2. **Khóa độc quyền chống đặt trùng slot (Concurrency Protection)**: Trong giao dịch `Prisma.$transaction`, hệ thống sử dụng khóa hàng độc quyền PostgreSQL (`SELECT ... FOR UPDATE` trên bảng `practitioners`) để tuần tự hóa các yêu cầu cạnh tranh cùng một khung giờ, loại bỏ hoàn toàn nguy cơ double-booking.
3. **Bảo vệ quyền riêng tư**: Không lưu trữ chẩn đoán bệnh án trên website công khai; mã tham chiếu ngẫu nhiên không chứa PII; dữ liệu hiển thị có phân quyền rõ ràng.

