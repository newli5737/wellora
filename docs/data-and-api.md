# Wellora — Mô hình dữ liệu và hợp đồng API

Điều chỉnh mô hình khi có yêu cầu khác phải cập nhật spec, migration, test và nêu lý do. Không thêm field nhạy cảm vì “có thể cần sau”.

## 1. Quy tắc chung

- PostgreSQL, UUID, timestamps `timestamptz`; IANA timezone cơ sở là cấu hình bắt buộc. Không lưu giờ địa phương dạng chuỗi làm nguồn sự thật.
- Bảng nghiệp vụ có `created_at`, `updated_at`; booking hủy giữ record, không xóa vật lý.
- FK/unique/index/check constraint cho invariant DB có thể bảo vệ. Không dựa riêng UI hoặc check-then-insert.
- Tiền là integer đơn vị nhỏ nhất + ISO currency, không float. Giá chưa xác nhận thì không trả số giả.
- Giới hạn PII, log không serialize toàn bộ entity/request.

## 2. Thực thể đề xuất

- `locations`: id, name, slug, address/phone nullable, timezone, is_active. Không tạo địa chỉ giả.
- `users`: nhân viên đăng nhập; id, email unique nếu dùng, password_hash nếu tự auth, role, is_active, last_login_at. Role `ADMIN`, `MANAGER`, `STAFF`, `PRACTITIONER`; client không ghi role.
- `patients`: id, full_name, phone/email theo policy. Không lưu hồ sơ bệnh án/diagnosis; có thể không có tài khoản.
- `practitioners`: id, user_id nullable/unique, display_name, bio/photo đã duyệt, is_bookable, is_published. Tách profile công khai khỏi quyền đăng nhập.
- `services`: id, name, slug unique, description đã duyệt, duration_minutes > 0, buffer_before/after, price_minor/currency nullable, is_active/is_published. Giá null không phải 0.
- `practitioner_services`: quan hệ practitioner-service (location nếu cần), unique composite.
- Availability: `working_hours` weekday, local start/end, resource/location, effective range; `availability_exceptions` ngày nghỉ/override. Validate end > start, timezone location, không overlap cùng resource.
- `appointments`: id, reference ngẫu nhiên unique (không tuần tự/PII), patient/service/location, practitioner nullable, starts_at/ends_at, status, contact_snapshot chỉ nếu cần, patient_note nullable có giới hạn/retention, created_by. Đóng băng ends_at lúc booking. Ngăn overlap bằng exclusion constraint hoặc transaction/locking và integration test.
- `appointment_events`/`audit_events`: append-only actor/action/entity/time/request id và metadata redacted. Không lưu token/mật khẩu/note/PII vào metadata.

## 3. Quy ước REST và endpoints

Prefix `/api/v1`, JSON UTF-8, HTTPS production; Swagger là hợp đồng cập nhật cùng code. Response datetime ISO-8601 UTC `Z`; request truyền ISO-8601 có offset; availability trả timezone IANA. Không để DTO ORM lộ ra response.

Public: `GET /public/services`, `GET /public/services/:slug` chỉ trả active/published; `GET /public/practitioners?serviceId=&locationId=` chỉ profile công khai/bookable; `GET /public/availability?serviceId=&locationId=&practitionerId=&from=&to=` giới hạn khoảng truy vấn, không tiết lộ lịch người khác.

`POST /public/appointments` nhận service/location/practitioner?, startsAt, patient contact, note? và consent; idempotency key qua header. Server tính endsAt/giá/trạng thái, không tin client. Tra cứu theo reference chỉ với token xác minh đủ entropy/OTP hoặc cơ chế được duyệt; không cho dò mã. Cancel/reschedule chỉ sau khi chốt xác minh và policy.

Staff: `POST /auth/login`, logout/session theo auth đã chọn; rate limit. `GET /admin/appointments?from=&to=&status=&serviceId=&practitionerId=&locationId=&page=&pageSize=`, `GET /admin/appointments/:id`, `PATCH /admin/appointments/:id/status`. CRUD catalog/availability theo role. Mọi endpoint staff có guard và kiểm tra scope/ownership server-side.

## 4. Lỗi, slot và giao dịch

HTTP: 200/201 success, 204 no content, 400 validation, 401 unauthenticated, 403 forbidden, 404 không tồn tại/không được lộ, 409 conflict/slot vừa mất, 429 rate limit, 500 lỗi bất ngờ. Response lỗi:

```json
{
  "statusCode": 409,
  "code": "APPOINTMENT_SLOT_UNAVAILABLE",
  "message": "Khung giờ này vừa có người đặt. Vui lòng chọn giờ khác.",
  "details": [],
  "requestId": "opaque-id"
}
```

Không trả SQL/stack trace/PII. Details chỉ field và rule message an toàn. Availability là ảnh chụp lúc đọc, không giữ chỗ trừ khi có hold được thiết kế riêng. Submit phải validate resource, giờ mở, tương lai, cutoff/horizon, policy và overlap trong transaction. Cùng practitioner không có appointment overlap ở trạng thái chiếm lịch; chọn bất kỳ bác sĩ thì chọn khả dụng nguyên tử phía server. DB conflict map thành 409.

Idempotency: cùng key + payload trả kết quả đầu; key trùng payload khác → conflict. Key gắn actor/session, có TTL, không thay auth. Gửi thông báo sau commit; lỗi email/SMS không rollback lịch. Outbox chỉ thêm khi cần; không bật tích hợp thật nếu chưa cấu hình.

## 5. Quyền tối thiểu

| Hành động | Public | Staff | Practitioner | Manager/Admin |
|---|---:|---:|---:|---:|
| Catalog published/slot | Có | Có | Có | Có |
| Tạo lịch | Có, rate limit | Có | Có | Có |
| Xem PII lịch | Không, trừ verified self | theo phạm vi | lịch thuộc phạm vi nếu cho phép | theo policy |
| Đổi trạng thái | Không | theo quyền | lịch trong phạm vi nếu cho phép | Có |
| Sửa catalog/giờ làm | Không | Không mặc định | Không mặc định | Có |
| Sửa role/tài khoản | Không | Không | Không | Admin hạn chế |

Mặc định từ chối. Endpoint mới phải định nghĩa actor/permission. Quyền staff cụ thể cần chủ sản phẩm xác nhận.
