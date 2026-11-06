# Wellora — Hướng dẫn AI agent

Đọc trước khi code. Định hướng website giới thiệu phòng khám, đặt lịch và quản trị lịch hẹn. Mục tiêu: trải nghiệm tin cậy, rõ ràng, có tính người; không giống landing page sinh tự động. Không bịa thông tin y khoa, bằng cấp, giá, địa chỉ, đánh giá hay cam kết. Placeholder phải được gắn nhãn và không xuất bản như thật. Đặt lịch không phải hồ sơ bệnh án; chỉ thu thập dữ liệu cần thiết.

## Nhận diện và UI/UX

Logo nguồn `Wellora Healthcare Logo.png` tại root (PNG RGBA 1536×1024): nền đen, ánh sáng cyan/teal và xanh dương, chữ Wellora nét viền. Không vẽ lại, thay bằng chữ/biểu tượng tự chế, đổi màu hoặc kéo méo. Kiểm tra alpha/nền trước khi dùng; không giả định logo đọc tốt trên nền trắng. Chọn nền tối phù hợp hoặc tạo biến thể/crop dẫn xuất có chủ đích; giữ nguyên bản gốc và kiểm tra trực quan. Asset web đề xuất `apps/web/public/images/brand/wellora-logo.png`, chỉ sao chép sau khi xác minh. Alt `Wellora` khi truyền đạt thương hiệu, alt rỗng nếu trang trí.

- Phòng khám hiện đại, điềm tĩnh, có tính người; ưu tiên rõ ràng, tin cậy, không phô trương công nghệ. Cyan/teal và xanh dương làm màu nhấn, nền nội dung trung tính ấm/sáng; có thể dành vùng xanh đậm/đen cho logo. Tạo token màu tập trung, kiểm tra tương phản WCAG.
- Chỉ dùng ảnh thật có giấy phép. Tránh stock bắt tay, bác sĩ cười giả, ảnh AI y khoa, giải phẫu không cần thiết. Thiếu ảnh thì dùng typography/khoảng trắng/hình khối thay vì ảnh giả.
- Bố cục có nhịp: hero editorial, lưới thông tin có chủ đích, số liệu chỉ khi xác thực, lịch/stepper trực quan. Không biến mọi vùng thành card.
- Không bo tròn mọi thứ: góc vuông/nhẹ cho bảng và khối nội dung, pill cho nhãn/trạng thái, bo lớn có chọn lọc. Tránh card lồng card, bóng dày, gradient/glow phủ khắp, icon vô nghĩa, template AI đại trà.
- Tiếng Việt tự nhiên, đúng dấu, không lorem ipsum khi hoàn thiện. Typography phân cấp. Responsive mobile-first, bàn phím/focus rõ, vùng chạm phù hợp; hướng tới WCAG 2.2 AA, không dùng màu làm tín hiệu duy nhất.

## Stack và kiến trúc

Web: Next.js + React + TypeScript, App Router cho dự án mới. **Không ghép Vite vào cùng ứng dụng Next.js** (Next đã có build/dev). Chỉ dùng Vite cho React app độc lập nếu có lý do ghi nhận; không dựng hai frontend nếu chưa yêu cầu. API: NestJS + TypeScript, REST JSON `/api/v1`, DTO/validation ở biên, OpenAPI. DB: PostgreSQL; theo ORM có sẵn, repo mới chọn duy nhất Prisma hoặc TypeORM và quản lý bằng migration. Mobile tùy chọn Flutter/Dart gọi API, không truy cập DB trực tiếp. Kiểm tra manifest/lockfile trước khi thêm thư viện; app giao tiếp qua API, chỉ chia sẻ types/schema thuần khi phù hợp.

```text
apps/web (Next.js) ──┐
                     ├── REST /api/v1 ── apps/api (NestJS) ── PostgreSQL
apps/mobile (Flutter)┘                   ├── domain/use cases
                                         ├── persistence/repositories
                                         └── integrations (email/SMS tùy cấu hình)
```
Backend là nguồn sự thật về quyền, slot, chính sách, trạng thái. Không gửi dữ liệu nhạy cảm qua URL/log; secrets qua environment, không commit.

## Cấu trúc repo đề xuất

Monorepo, nhưng khảo sát repo hiện tại và giữ quy ước có sẵn; không phá mã để khớp mẫu.

```text
wellora/
├── AGENTS.md, README.md, .env.example
├── docs/ (architecture.md, domain-and-flows.md, api.md, decisions/)
├── apps/
│   ├── web/ (public/images/brand/, src/app, features, components, lib, styles, types)
│   ├── api/src/ (main.ts, common, config, modules, database)
│   └── mobile/ (Flutter, chỉ khi được yêu cầu)
├── packages/ (contracts, config nếu thực sự cần)
└── infrastructure/ (local/deploy, không chứa secrets)
```
Nest module chia theo trách nhiệm: controller, application/service, DTO, domain khi cần, repository/interface, persistence adapter. Không tạo `utils`/`common` khổng lồ, không dồn nghiệp vụ vào controller/component. Web nhóm theo feature; route điều phối/render.

## Chức năng

Website gồm trang chủ (giá trị cốt lõi có căn cứ, dịch vụ, quy trình đặt lịch, đội ngũ/cơ sở nếu có, FAQ, CTA), dịch vụ, đội ngũ, giới thiệu, liên hệ/giờ mở cửa, quyền riêng tư/điều khoản. Tối ưu metadata, semantic HTML, tốc độ, ảnh responsive; không đưa PII vào metadata/index.

Đặt lịch theo bước có tiến trình, quay lại không mất dữ liệu: dịch vụ/cơ sở; bác sĩ; ngày/slot còn hiệu lực và timezone; thông tin liên hệ tối thiểu, giải thích mục đích; xác nhận, mã tham chiếu và hướng dẫn. Backend xác thực slot khi ghi, ngăn trùng bằng transaction/ràng buộc và xử lý cạnh tranh; idempotency khi cần. Không tin slot/giá/trạng thái client gửi. Quy định trạng thái (ví dụ `pending`, `confirmed`, `cancelled`, `completed`, `no_show`) và chính sách đổi/hủy. Không tự xác nhận/thu tiền nếu chưa yêu cầu. UI có loading, lỗi phục hồi, hết slot, mất mạng, thành công.

Quản trị: lịch ngày/tuần/danh sách, lọc ngày/bác sĩ/dịch vụ/trạng thái; xem/tạo/sửa/đổi/hủy theo quyền, ghi actor/time audit. Quản lý giờ làm, ngày nghỉ, thời lượng/buffer, không tạo lịch chồng. Vai trò tối thiểu admin/manager, staff, practitioner; bệnh nhân chỉ truy cập lịch mình qua xác minh. Guard backend bắt buộc; guard UI chỉ là UX. Bảng/lịch dễ quét, không biến mọi dữ liệu thành card.

## Dữ liệu, bảo mật, kiểm thử

Cân nhắc các thực thể `User`, `Patient`, `Practitioner`, `Service`, `Location`, `Availability/WorkingHours`, `Appointment`, `AuditEvent`. ID nhất quán; thời gian `timestamptz` + timezone cơ sở; tiền dạng số nguyên đơn vị nhỏ nhất + currency. Có FK/index/ràng buộc và migration. API thống nhất pagination/filter/lỗi/status; DTO whitelist trường. Tách endpoint tra slot/tạo lịch; test cạnh tranh slot.

Dữ liệu sức khỏe/liên hệ nhạy cảm: thu thập tối thiểu, giới hạn quyền, HTTPS production, hash mật khẩu chuẩn nếu tự quản lý, chống brute force, session/token có vòng đời rõ. Không log PII/token/ghi chú; audit thao tác quản trị. Xác định retention/xóa dữ liệu và pháp lý thị trường trước go-live; không tuyên bố tuân thủ nếu chưa kiểm chứng. Cân nhắc CORS, CSRF, rate limit, validation, backup/restore.

Trước khi sửa, đọc repo, manifest/lockfile, README, cấu hình và test. TypeScript strict, tránh `any`; `.env.example` không secret; seed giả chỉ local/test. Test unit quy tắc slot/trạng thái, integration API + PostgreSQL, UI đặt lịch/lỗi, responsive/accessibility. Chạy formatter/linter, typecheck, test, build theo script thật; không khai đã chạy nếu chưa. Cập nhật README lệnh cài/chạy/migration/test. Không nuốt lỗi, không để placeholder/TODO trong luồng hoàn thiện.

## Quy trình agent và nghiệm thu

1. Khảo sát repo/phạm vi/dependency/lệnh chạy; ghi giả định, không bịa dữ liệu thương hiệu.
2. Chốt domain, luồng, quyền, schema/API trước code diện rộng.
3. Xây design tokens, xác minh logo; làm một luồng UI→API→DB hoàn chỉnh trước.
4. Triển khai feature/module cùng migration, validation, quyền và test.
5. Kiểm tra tiếng Việt, trạng thái, mobile/desktop, keyboard/focus/contrast; tránh lạm dụng card/radius.
6. Chạy kiểm tra, tổng kết file đổi/test/rủi ro/câu hỏi mở.

Nghiệm thu: bệnh nhân đặt lịch hợp lệ; staff quản lý theo quyền; không đặt trùng; UI responsive, lỗi/thành công rõ, logo đúng; tài liệu/test khớp thực tế.

Trước go-live cần xác nhận chuyên khoa, địa chỉ/cơ sở, đội ngũ được phép công bố, dịch vụ/thời lượng/giá, giờ/timezone, quy tắc xác nhận-hủy-đổi-no-show, email/SMS, xác thực, ngôn ngữ, chính sách dữ liệu và pháp lý. Chưa xác nhận thì chỉ dùng cấu hình mẫu trong môi trường phát triển.

## Tài liệu bắt buộc trước khi code

Tài liệu này là bản tóm tắt. Trước mọi task triển khai, đọc các spec chi tiết:

- `docs/implementation-guide.md` — quy tắc chống code bẩn, kiến trúc, cấu trúc repo, trình tự và tiêu chí done.
- `docs/product-spec.md` — phạm vi, sitemap, luồng bệnh nhân/nhân viên, trạng thái và dữ liệu cần xác nhận.
- `docs/data-and-api.md` — mô hình dữ liệu, REST contract, cạnh tranh slot, lỗi và quyền.
- `docs/ui-ux-spec.md` — art direction, logo, layout, accessibility và các mẫu UI bị cấm.

Không coi cây thư mục hay nghiệp vụ trong spec là lý do để bỏ qua repo thực tế. Không tự thay đổi quyết định kiến trúc mà không ghi ADR/cập nhật tài liệu.


