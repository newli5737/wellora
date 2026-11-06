# Wellora — Quy chuẩn triển khai cho AI coding agent

**Tính chất:** tài liệu này là hợp đồng kỹ thuật bắt buộc cho agent. Đọc `/AGENTS.md`, tài liệu này và các tài liệu liên quan trong `/docs` trước khi code. Khi yêu cầu người dùng mâu thuẫn với quy chuẩn: nêu mâu thuẫn, không âm thầm tự chọn. Không được tự ý thay stack, thêm frontend, đổi cấu trúc lớn hoặc giả lập nghiệp vụ. Nếu chưa rõ, ghi giả định và hỏi đúng câu hỏi có thể chặn triển khai.

## 1. Quy tắc chống code lệch/bẩn

1. Khảo sát toàn bộ repo trước: cây file, package manager/lockfile, scripts, cấu hình TS/lint/test, cách chạy. Repo hiện là repo khởi tạo chỉ có logo và hướng dẫn; không giả vờ có code hoặc dependency sẵn.
2. Trước mỗi phần việc, viết checklist ngắn: file dự kiến, luồng dữ liệu, test. Chỉ sửa trong phạm vi; không tái cấu trúc không liên quan.
3. Không tạo file khổng lồ. Component UI nên tập trung một trách nhiệm; module API một domain. Tách logic khi có lý do, không tạo abstraction chỉ để “clean architecture”. Không copy-paste quy tắc nghiệp vụ.
4. Không để `any`, `@ts-ignore`, eslint-disable, `console.log`, catch rỗng, fake success, hard-coded secret, TODO trong luồng hoàn chỉnh. Trường hợp ngoại lệ phải có lý do/code comment và xử lý lỗi rõ.
5. Không viết toàn bộ sản phẩm trong một lượt. Xây vertical slice có thể chạy: khởi tạo nền → trang public → availability/booking xuyên API/DB → admin → hardening. Sau mỗi lát cắt chạy test/typecheck/build liên quan.
6. Không đổi tên/xóa/move file người dùng tạo nếu chưa xác minh tham chiếu. Không xóa lockfile hay tái tạo toàn bộ repo. Không thêm dependency trước khi kiểm tra có thể giải quyết bằng thư viện hiện có.
7. Khi thiếu thông tin thật (địa chỉ, chuyên khoa, bác sĩ, giá, lịch làm, chính sách), tạo cấu hình seed development có nhãn “Dữ liệu mẫu”; production phải rỗng/chặn xuất bản cho tới khi được cấu hình. Không tạo nội dung y tế giả.
8. Trước khi kết thúc phải kiểm tra `git diff`, file mới, secrets, script tests. Báo chính xác lệnh đã chạy, kết quả, lỗi còn lại; tuyệt đối không tuyên bố test/build pass nếu chưa thực thi.

## 2. Quyết định kiến trúc đã chốt

- Monorepo: `apps/web` là Next.js App Router + React + TypeScript; `apps/api` là NestJS + TypeScript; PostgreSQL. Mobile Flutter là app tùy chọn độc lập, chỉ khởi tạo khi có yêu cầu.
- Vite **không** chạy bên trong app Next.js. Chỉ được thêm Vite nếu sản phẩm được yêu cầu một SPA React khác; cần ADR ghi rõ lý do, chủ sở hữu và deploy riêng.
- Frontend gọi Nest REST API; không truy cập PostgreSQL, không chứa credentials DB, không quyết định quyền/trạng thái/slot. API là nguồn sự thật. Cùng origin/reverse proxy ưu tiên cho production; CORS chỉ mở origins cấu hình rõ.
- API `/api/v1`, JSON, ISO-8601 có offset ở boundary; nội bộ thời gian có timezone rõ. OpenAPI là hợp đồng máy đọc được. Không để DTO persistence/ORM lộ trực tiếp ra response.
- Repo mới chọn **Prisma** làm mặc định nếu không có ràng buộc khác; chỉ chọn TypeORM khi dependency/chuyên môn/hiện trạng repo đòi hỏi và ghi ADR. Tuyệt đối không trộn ORM.
- Dùng npm workspaces nếu khởi tạo repo mới và không có lựa chọn khác; một lockfile ở root. Không bắt buộc thêm Nx/Turborepo. Chỉ thêm orchestration khi có nhu cầu build thực tế.
- Không chia sẻ package TypeScript giữa web/API trước khi có nhu cầu thật. Nếu chia sẻ, chỉ contracts thuần, không import Nest/React/ORM và có quy trình build/test rõ.

## 3. Cây thư mục chi tiết

```text
wellora/
├── AGENTS.md
├── README.md
├── package.json                 # workspace scripts; khi monorepo được khởi tạo
├── package-lock.json
├── .env.example                 # chỉ tên biến + giá trị giả/để trống
├── .gitignore
├── docs/
│   ├── implementation-guide.md  # tài liệu này
│   ├── product-spec.md
│   ├── data-and-api.md
│   ├── ui-ux-spec.md
│   └── adr/                     # quyết định kiến trúc quan trọng
├── apps/
│   ├── web/
│   │   ├── public/images/brand/wellora-logo.png
│   │   └── src/
│   │       ├── app/             # route/layout/loading/error/not-found
│   │       ├── features/
│   │       │   ├── booking/{components,hooks,api,schemas,types}/
│   │       │   ├── services/{components,api,types}/
│   │       │   └── admin/{appointments,availability,staff}/
│   │       ├── components/{ui,layout}/
│   │       ├── lib/{api,auth,format,validation}/
│   │       ├── styles/{tokens.css,globals.css}
│   │       └── types/
│   └── api/
│       └── src/
│           ├── main.ts
│           ├── app.module.ts
│           ├── common/{auth,decorators,filters,guards,interceptors,pipes}/
│           ├── config/
│           ├── database/{prisma,seed}/
│           └── modules/
│               ├── auth/{dto,guards,strategies}/
│               ├── patients/{dto}/
│               ├── practitioners/{dto}/
│               ├── services/{dto}/
│               ├── availability/{dto}/
│               ├── appointments/{dto}/
│               └── audit/
├── apps/mobile/                 # chỉ tạo khi được yêu cầu
└── infrastructure/              # compose/deploy khi cần
```

Quy tắc route web: URL mô tả tài nguyên, route page/layout chỉ ghép feature component; không đặt truy vấn nghiệp vụ lớn vào page. Gợi ý URL: `/`, `/dich-vu`, `/dich-vu/[slug]`, `/doi-ngu`, `/dat-lich`, `/dat-lich/xac-nhan`, `/lien-he`, `/admin/dang-nhap`, `/admin/lich-hen`, `/admin/lich-hen/[id]`, `/admin/khung-gio`. Không tạo trang hồ sơ bệnh án nếu chưa có phạm vi và đánh giá riêng.

Quy tắc API module: controller chỉ parse request, áp guard, gọi use-case/service và map response; DTO validation tại boundary; service điều phối nghiệp vụ; repository encapsulate persistence. Không query DB trong controller. Không tạo generic repository “dùng cho mọi thứ” nếu che mất query domain.

## 4. Thứ tự triển khai bắt buộc

**Giai đoạn 0 — thiết kế trước code:** kiểm tra repo/scripts; chốt ADR; thiết lập TS strict, lint/format, test, env validation, PostgreSQL local và migration. Đọc các spec khác. Chốt route, schema, API contract, design tokens. Seed mẫu chỉ cho development.

**Giai đoạn 1 — public:** header/footer, home, service list/detail, about/team/contact từ nguồn dữ liệu có thật/configurable; metadata và responsive. Không có nội dung thật thì ẩn section hoặc đánh dấu chưa cấu hình, không dựng đội ngũ/đánh giá/báo giá giả.

**Giai đoạn 2 — vertical slice booking:** catalog/availability API → chọn dịch vụ/ngày/slot → submit → transaction DB → confirmation. Server kiểm tra slot lần cuối. Hai request đồng thời cùng slot chỉ một request thành công. Test cả thành công, validation, slot hết, lỗi DB. Không dùng mock API trong production.

**Giai đoạn 3 — quản trị:** authentication + role guard phía server; lịch/list, filter/pagination, chi tiết/chuyển trạng thái, cấu hình availability. Test unauthorized, IDOR, xung đột lịch và audit.

**Giai đoạn 4 — phát hành:** rà soát security, accessibility, SEO, performance, migration triển khai, backup/restore; log/monitoring không chứa PII; người có trách nhiệm duyệt nội dung y tế/pháp lý. Không bật thanh toán, SMS/email thật, tài khoản bệnh nhân hay đồng bộ lịch ngoài phạm vi được duyệt.

Không bắt đầu giai đoạn kế nếu giai đoạn trước không build/typecheck được, trừ blocker môi trường được ghi rõ và không che giấu.

## 5. Quy chuẩn frontend

- TypeScript strict; props có type; form schema validation ở UI để hỗ trợ người dùng, server vẫn validate độc lập.
- `features/<domain>` chứa UI, hooks, API adapter, schema/type theo domain. `components/ui` chỉ primitive trình bày (Button, Input, Select, Dialog, Badge, Table), không gọi API/không biết trạng thái booking.
- API client tập trung trong `src/lib/api`; base URL từ env, timeout/abort, parse error có kiểu. Không rải `fetch` trong component. Không đưa secret vào `NEXT_PUBLIC_*`.
- Server Components mặc định cho nội dung tĩnh/SEO; Client Component chỉ khi cần state/event/browser API. Không biến cả app thành client component để né thiết kế data fetching.
- Mỗi màn hình có loading, error, empty, success; nút submit disable đúng lúc, lỗi validation gắn với trường, không mất dữ liệu khi lỗi mạng. Không hiển thị stack trace hoặc lỗi backend thô.
- State chỉ ở nơi cần; không dựng global state/store nếu form/local state đủ. Format ngày/giờ/tiền qua helper thống nhất; không tự ghép chuỗi ngày ở mỗi màn hình.

## 6. Quy chuẩn backend

- `main.ts`: cấu hình prefix/version, validation pipe whitelist/forbid unknown, filter lỗi chuẩn, CORS allowlist, OpenAPI. Config được validate lúc start; fail-fast khi thiếu biến bắt buộc.
- Controller mỏng; DTO input tách create/update/query; output response không lộ password hash, internal flags hoặc ORM object.
- Domain rule ở service/use case: slot, state transition, authorization condition. Repository chỉ persistence; không để controller tự gọi Prisma.
- Dùng transaction khi nhiều ghi phải nguyên tử. Chống booking race bằng constraint/locking/transaction phù hợp DB; kiểm tra lỗi unique và trả `409 Conflict` có mã lỗi ổn định, không chỉ check availability trước rồi insert rời rạc.
- Pagination có giới hạn max page size; filter/sort whitelist; query không nhận tên cột tuỳ ý. Thời gian lưu UTC instant và giữ IANA timezone của cơ sở cho quy tắc lịch làm.
- Error response có `statusCode`, `code`, `message` an toàn, `details` validation có kiểm soát, `requestId`; không trả SQL/stack trace. Log requestId, route, status, duration; redact PII.
- Không tự retry thao tác ghi không idempotent. Tích hợp email/SMS qua adapter và config, lỗi gửi thông báo không được làm mất booking đã commit.

## 7. Tiêu chí “done” cho mỗi thay đổi

- Đúng yêu cầu, nằm đúng module; không có dữ liệu giả/secret, không code chết hoặc debug.
- Migration có thể chạy; rollback/triển khai được cân nhắc; `.env.example` cập nhật nếu thêm env.
- Unit test cho quy tắc domain; integration test cho API/DB khi liên quan; UI test cho luồng/state khi thay đổi giao diện.
- Chạy lint, typecheck, test, build đúng scripts của repo; kiểm tra `git diff --check`, diff và status. Báo từng lệnh cùng kết quả.
- Kiểm tra responsive, keyboard/focus, tiếng Việt, lỗi/empty/loading; không tự nhận đạt WCAG nếu chưa kiểm thử.
- Tóm tắt: thay đổi, quyết định, file chính, cách chạy, kiểm tra, giới hạn/câu hỏi cần xác nhận.

## 8. Dữ liệu cần chủ sản phẩm xác nhận

Chuyên khoa; thông tin pháp nhân/địa chỉ/cơ sở; dịch vụ, thời lượng, giá và thuế; bác sĩ/thông tin công khai; giờ mở cửa, ngày nghỉ, timezone; cách xác nhận và chính sách hủy/đổi/no-show; xác thực bệnh nhân/nhân viên; email/SMS; retention/xóa dữ liệu và yêu cầu pháp lý; ngôn ngữ. Không được tự điền các dữ liệu này như sự thật.

