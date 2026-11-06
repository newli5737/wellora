# ADR 0001: Khởi tạo kiến trúc Monorepo, Next.js, NestJS và Prisma ORM

## Bối cảnh (Context)
Dự án Wellora là nền tảng website giới thiệu phòng khám, đặt lịch khám công khai và hệ thống quản trị lịch hẹn cho nhân viên y tế / lễ tân.
Các yêu cầu kỹ thuật chốt trong `docs/implementation-guide.md`:
1. Monorepo quản lý qua `npm workspaces`, một lockfile duy nhất tại root.
2. Web: Next.js (App Router) + TypeScript + Tailwind CSS. Không dùng Vite trong cùng app Next.js.
3. API: NestJS + TypeScript, REST JSON chuẩn `/api/v1`, OpenAPI (Swagger), validation ở biên bằng DTO.
4. Database: PostgreSQL, quản lý schema và migration bằng một ORM duy nhất là Prisma (mặc định cho repo mới).

## Quyết định (Decision)
1. Sử dụng npm workspaces với cấu trúc thư mục:
   - `apps/web`: Ứng dụng Next.js App Router
   - `apps/api`: Ứng dụng NestJS REST API
2. Sử dụng Prisma ORM (`@prisma/client` + `prisma` CLI) để quản lý migration, schema và truy vấn cơ sở dữ liệu.
3. Thiết lập Docker Compose cho môi trường phát triển cục bộ với PostgreSQL trên cổng 5435 (tránh đụng cổng 5432-5434 của các container khác trên máy phát triển).
4. Thiết lập Design Tokens tập trung tại `apps/web/src/styles/tokens.css` phản ánh nhận diện thương hiệu từ logo Wellora (cyan/teal/xanh dương trên nền tối có chủ đích, nền nội dung sáng trung tính, WCAG 2.2 AA).

## Hệ quả (Consequences)
- Đảm bảo tính nhất quán giữa API và Web, không trộn lẫn ORM hay build tools.
- API là nguồn sự thật duy nhất (Single Source of Truth) cho dữ liệu, slot, và quy tắc nghiệp vụ.
- Quy trình migration rõ ràng, có thể kiểm thử tự động và seed dữ liệu mẫu có nhãn.

