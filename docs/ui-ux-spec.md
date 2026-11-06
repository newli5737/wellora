# Wellora — Quy chuẩn UI/UX và art direction

## 1. Hướng thiết kế

Tạo cảm giác “chăm sóc có chuyên môn nhưng gần gũi”: bình tĩnh, sáng rõ, có khoảng thở, nội dung chân thực. Không bắt chước dashboard SaaS template. Mỗi trang có một trọng tâm và thứ bậc nội dung rõ. Không dùng ảnh AI làm bác sĩ/bệnh nhân hoặc giả mạo cơ sở.

### Logo

Nguồn tại `/Wellora Healthcare Logo.png`, 1536×1024 RGBA. Tệp có nền đen/ánh sáng cyan-teal-xanh; không dùng mặc định trên nền trắng. Trước khi triển khai phải xem ảnh ở kích thước thực, kiểm tra alpha, crop hợp lý và thử trên nền được chọn. Được phép tạo bản crop/resize tối ưu web, không được vẽ lại/đổi màu/kéo méo. Giữ nguyên bản; đặt bản dùng web ở `apps/web/public/images/brand/`. Logo ngang phù hợp header; không render toàn bộ ảnh 1536×1024 như một logo ngang nếu gây thừa khoảng đen. Nếu crop, phải giữ đủ biểu tượng và chữ, không cắt vùng nhận diện.

### Palette và tokens

Chỉ định token CSS tập trung tại `styles/tokens.css`; không rải mã màu trong JSX. Bắt đầu từ dải màu tham chiếu, sau khi kiểm tra logo/contrast mới chốt giá trị cụ thể:

- `brand-950/900`: xanh đen/teal đậm dùng cho header/hero/footer có chủ đích.
- `brand-700/600`: xanh dương/teal đậm cho CTA và link cần tương phản.
- `brand-400/300`: cyan làm accent, viền focus/decor; không dùng chữ nhỏ trên nền sáng nếu thiếu contrast.
- `surface-canvas`: trắng ngà/neutral rất nhạt; `surface-raised`: trắng; `text-primary`: xanh đen gần đen; `text-muted`: neutral đủ contrast.
- Semantic: success, warning, danger, info phải khác nhau cả bằng chữ/icon, không chỉ màu.

Mọi text thường đạt contrast tối thiểu 4.5:1, chữ lớn 3:1; focus indicator rõ. Không suy đoán mã màu logo rồi áp đại trà. Tránh màu neon trên diện rộng.

### Typography / shape / motion

Chọn một sans-serif dễ đọc hỗ trợ tiếng Việt tốt, có fallback hệ thống; không thêm nhiều font. Cỡ chữ responsive với line-height thoáng, heading ngắn, nội dung body đủ lớn. Bo góc có scale hạn chế: control/nhãn nhẹ, bảng/section gần vuông; không radius lớn trên tất cả. Bóng chỉ để phân cấp thật, ưu tiên border/spacing. Chuyển động ngắn, không bắt buộc; tôn trọng `prefers-reduced-motion`, không animation trang trí liên tục.

## 2. Layout và trang công khai

- Header: logo có nền/khung đảm bảo đọc, nav vừa đủ, CTA “Đặt lịch”; mobile menu có aria, focus trap hợp lý và đóng bằng Escape.
- Hero: một câu headline có lợi ích cụ thể nhưng không tuyên bố hiệu quả y khoa; một CTA chính, CTA phụ liên hệ; ảnh chỉ khi có asset thật. Tránh gradient lớn và hình bác sĩ stock.
- Dịch vụ: danh sách/lưới chọn lọc, có phân cấp nội dung; mỗi mục có tên/mô tả/ngữ cảnh, không nhồi tất cả vào card bo tròn. Giá/thời lượng chỉ khi đã xác nhận.
- Quy trình khám/đặt lịch: stepper hoặc dải bước ngắn. FAQ dùng accordion có keyboard semantics nếu nội dung dài.
- Footer: địa chỉ/giờ/điện thoại từ một nguồn config, link privacy/terms; không hard-code lặp.
- Chi tiết dịch vụ: nội dung dễ scan, CTA theo dịch vụ cụ thể; không đưa lời khuyên lâm sàng ngoài nội dung được duyệt.

## 3. Booking UI

Màn đặt lịch cần cấu trúc đơn giản, nội dung chính chiếm ưu tiên; không đặt từng field trong card riêng. Stepper chỉ báo tiến trình thật. Trên desktop có thể giữ summary ở cột phụ; trên mobile summary thu gọn/hiện trước submit. Lịch ngày/slot có trạng thái selected, unavailable, loading và keyboard operation; dùng button semantic, aria-label ngày đầy đủ. Không phân biệt slot chỉ bằng màu. Focus không mất sau khi lỗi; lỗi tổng quát được announce qua live region.

Mỗi bước phải có tiêu đề, hướng dẫn, back/continue rõ. Nút tiếp theo disabled chỉ khi không thể tiếp tục và có chỉ dẫn. Submit có loading và chống double-submit. Nếu slot vừa mất, giữ form, giải thích, đưa người dùng về chọn slot; không reset toàn bộ. Mã xác nhận không tuần tự; không đưa dữ liệu cá nhân lên URL. Consent tách khỏi marketing, không chọn sẵn.

## 4. Admin UI

Admin là công cụ vận hành, không phải trang marketing. Ưu tiên lịch/table density vừa phải, header cố định nếu hữu ích, filter rõ và khả dụng bàn phím. Trên màn nhỏ chuyển sang list có ngày/giờ rõ thay vì ép calendar nhiều cột. Trạng thái có label text + màu/icon. Cẩn trọng khi hiển thị PII; che liên hệ ở list nếu không cần. Hành động hủy cần confirm và nêu hậu quả. Có empty state hướng dẫn cấu hình, không hiển thị dashboard số liệu bịa.

## 5. Responsive, accessibility, trạng thái

Kiểm tra tối thiểu 360px, 768px, 1280px; không overflow ngang ngoài bảng có chủ đích. Touch targets phù hợp, form label luôn hiển thị, autocomplete đúng, báo lỗi cạnh field và summary khi nhiều lỗi. Tab order hợp lý, focus visible, contrast đạt mức yêu cầu. Không dùng placeholder làm label. Loading có skeleton chỉ khi giữ được cấu trúc; error có retry/next action; empty có giải thích; success xác nhận rõ.

Kiểm tra `prefers-reduced-motion`, zoom 200%, keyboard-only, screen reader semantics cơ bản. Không tự tuyên bố đạt WCAG nếu chưa kiểm thử công cụ và thủ công.

## 6. Không được làm

Không lấy template SaaS/medical dashboard mặc định; không card mọi section, radius mọi element, gradient/glow khắp trang, glassmorphism, icon random, emoji thay icon, số liệu/đánh giá giả, ảnh bác sĩ AI, copywriting kiểu “công nghệ tiên tiến hàng đầu” khi không có chứng cứ. Không sử dụng logo trên nền khiến chữ chìm. Không bịa token màu hoặc tạo nhiều biến thể thương hiệu tự phát.

## 7. Kiểm tra trực quan trước nghiệm thu

- Mở trang ở desktop và mobile; kiểm tra crop/logo, tương phản, alignment, overflow.
- Xem trạng thái loading/empty/error/success, form validation, slot conflict và admin không có dữ liệu.
- Dùng keyboard qua nav, menu, calendar, form, dialog; focus không bị mất.
- Kiểm tra copy tiếng Việt, dấu câu, thông tin mẫu và mọi dữ liệu chưa xác minh.
- Soát lại card/radius: mỗi lần dùng phải có lý do phân cấp, không phải thói quen component.
