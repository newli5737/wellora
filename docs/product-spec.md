# Wellora — Đặc tả sản phẩm

## 1. Mục đích và đối tượng

Sản phẩm hỗ trợ ba việc: người mới hiểu phòng khám và dịch vụ; bệnh nhân gửi yêu cầu đặt lịch một cách đơn giản; nhân viên kiểm soát lịch mà không trùng hoặc bỏ sót. Đối tượng: khách chưa đăng nhập, bệnh nhân đặt lịch, staff lễ tân, practitioner, manager/admin. Giao diện mặc định tiếng Việt; không tạo bản dịch khác nếu chưa yêu cầu.

Website không tư vấn/chẩn đoán y khoa và không thay thế liên hệ khẩn cấp. Không yêu cầu người dùng nhập chẩn đoán, tiền sử bệnh hay thông tin sức khỏe chi tiết cho một lịch hẹn thông thường. Nếu cần câu hỏi y tế, phải có phê duyệt nghiệp vụ/pháp lý riêng.

## 2. Phạm vi phiên bản đầu

### Bao gồm

- Trang công khai: trang chủ, danh sách/chi tiết dịch vụ, đội ngũ (nếu có dữ liệu thật), giới thiệu, liên hệ/giờ làm, FAQ/chính sách.
- Đặt lịch công khai theo dịch vụ, cơ sở nếu có, bác sĩ nếu cần, thời gian rảnh và thông tin liên hệ.
- Màn hình xác nhận và tra cứu booking tối thiểu theo cơ chế bảo mật được duyệt.
- Quản trị: đăng nhập nhân viên, xem lịch, lọc, xem chi tiết, xác nhận/hủy/hoàn thành/no-show theo quyền, quản lý lịch làm và catalog cơ bản.
- Responsive desktop/tablet/mobile web.

### Không mặc định bao gồm

Thanh toán online, hồ sơ bệnh án, kê đơn, telehealth, chat, loyalty, CRM marketing, tài khoản bệnh nhân đầy đủ, app Flutter, nhắc lịch SMS/email thật, tích hợp calendar bên thứ ba. Chỉ thêm khi có yêu cầu và đánh giá riêng.

## 3. Sitemap và hành vi

- `/`: hero có CTA đặt lịch; dịch vụ nổi bật; quy trình; đội ngũ/cơ sở chỉ khi có dữ liệu; FAQ và thông tin liên hệ. Không hiển thị số liệu/đánh giá tự tạo.
- `/dich-vu`: danh mục dịch vụ đang hoạt động.
- `/dich-vu/[slug]`: mô tả đã duyệt, thời lượng/giá nếu có dữ liệu xác nhận, CTA chọn dịch vụ.
- `/doi-ngu`: chỉ hiển thị chuyên viên có profile và sự đồng ý công bố.
- `/gioi-thieu`, `/lien-he`, `/chinh-sach-quyen-rieng-tu`, `/dieu-khoan`.
- `/dat-lich`: stepper; không cần đăng nhập để gửi yêu cầu nếu chính sách cho phép.
- `/dat-lich/xac-nhan`: trạng thái và mã tham chiếu; không đưa PII vào URL.
- `/admin/dang-nhap`, `/admin/lich-hen`, `/admin/lich-hen/[id]`, `/admin/khung-gio`, `/admin/dich-vu`, `/admin/nhan-su` (theo quyền).

## 4. Luồng đặt lịch chi tiết

### Bước A — Dịch vụ

Chỉ dịch vụ active, có thời lượng cấu hình hợp lệ. Chọn cơ sở nếu nhiều cơ sở. Có thể chọn “bất kỳ bác sĩ phù hợp” nếu chính sách cho phép. Mọi bước sau phải nhớ lựa chọn khi quay lại.

### Bước B — Ngày và giờ

Lịch hiển thị ngày mở cửa, điều hướng tháng/tuần có giới hạn hợp lý, ngày quá khứ bị khóa. Khi chọn ngày, lấy slot từ API theo service/location/practitioner. Slot hiển thị theo timezone cơ sở; ghi chú timezone nếu người dùng ở múi giờ khác. Slot hết hạn hoặc bị người khác đặt cần báo dễ hiểu, giữ nguyên dữ liệu form và yêu cầu chọn giờ khác.

### Bước C — Thông tin liên hệ

Tối thiểu: họ tên, một kênh liên hệ bắt buộc (điện thoại hoặc email theo chính sách), kênh còn lại tùy nhu cầu. Ghi chú là optional, giới hạn độ dài và nhắc không nhập thông tin khẩn cấp/nhạy cảm. Consent riêng, không chọn sẵn, cho xử lý dữ liệu cần cho yêu cầu. Không yêu cầu tạo mật khẩu nếu không có tài khoản bệnh nhân.

### Bước D — Rà soát và gửi

Tóm tắt dịch vụ, cơ sở, bác sĩ (nếu chọn), ngày giờ, tên và kênh liên hệ được che một phần khi cần. Người dùng xác nhận chính sách. Submit một lần; chống double-click. Trả lỗi trường inline hoặc lỗi slot `409` để chọn lại. Khi thành công, hiển thị mã tham chiếu và trạng thái thật (`pending` hay `confirmed` theo cấu hình). Không hứa lịch chắc chắn nếu đang chờ xác nhận.

### Hủy/đổi lịch

Không cho phép thao tác chỉ dựa vào mã dễ đoán. Cần xác minh bằng đăng nhập, OTP hoặc token ngẫu nhiên đủ entropy; phương thức phải được phê duyệt. Kiểm tra thời hạn/chính sách ở server; mọi thay đổi có audit.

## 5. Quy trình quản trị

Staff đăng nhập, xem lịch theo ngày/tuần và danh sách. Bộ lọc: ngày, bác sĩ, dịch vụ, trạng thái, cơ sở. Mặc định hôm nay theo timezone cơ sở. Trang chi tiết chỉ hiển thị dữ liệu cần thiết; hành động có xác nhận cho hủy/chuyển trạng thái nhạy cảm. Khi thay đổi, hiển thị trạng thái mới và thời điểm; lỗi quyền/xung đột không mất context.

Admin/manager cấu hình dịch vụ, nhân sự, giờ làm, ngày nghỉ và thời lượng. Không cho lưu giờ kết thúc trước giờ bắt đầu; không cho tạo lịch làm/exception chồng không hợp lệ. Phân quyền tối thiểu quyền cần thiết; staff không tự cấp role.

## 6. Trạng thái booking

Trạng thái được phép cấu hình nhưng mặc định đề xuất:

- `pending`: nhận yêu cầu, chờ staff xác nhận.
- `confirmed`: đã được phòng khám xác nhận.
- `cancelled`: đã hủy; giữ record để audit, không xóa vật lý.
- `completed`: lượt hẹn đã diễn ra.
- `no_show`: bệnh nhân không đến theo quy trình.

Chuyển trạng thái phải do API kiểm tra; lưu actor, timestamp và lý do khi cần. Không chuyển ngược trạng thái tùy ý; định nghĩa transition matrix trong implementation trước khi tạo action. Tùy lựa chọn vận hành, booking có thể tự `confirmed` hoặc `pending`, không hard-code mặc định khi chưa được chủ sản phẩm xác nhận.

## 7. Dữ liệu nội dung và CMS

Phiên bản đầu có thể quản lý nội dung qua cấu hình/seed hoặc admin CRUD tối thiểu; không tự xây CMS tổng quát. Dữ liệu public phải có trạng thái publish/active. Dữ liệu mẫu được đánh dấu development và không seed vào production. Nội dung y tế, chứng chỉ, giá và chính sách phải có nguồn/người duyệt. Thông tin footer (địa chỉ, hotline, giờ) lấy từ cấu hình thống nhất, không hard-code ở nhiều component.

## 8. Ngoài phạm vi / điều kiện go-live

Trước khi mở cho bệnh nhân thật cần nội dung chính thức, privacy/terms được duyệt, domain/HTTPS, tài khoản nhân viên và phân quyền, chiến lược backup/restore, retention, hướng dẫn xử lý booking lỗi và xác nhận email/SMS. Cần người chịu trách nhiệm vận hành cập nhật giờ nghỉ và xử lý pending. Không bật production nếu seed/demo hoặc placeholder còn hiển thị.
