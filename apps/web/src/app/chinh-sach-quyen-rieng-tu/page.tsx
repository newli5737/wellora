import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';
import { CLINIC_CONFIG } from '@/lib/config/clinic';

export const metadata = {
  title: 'Chính sách quyền riêng tư — Wellora Healthcare',
  description: 'Chính sách thu thập, xử lý và bảo vệ dữ liệu cá nhân tại Wellora Healthcare.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-border-default pb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> Bảo vệ dữ liệu
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Chính sách quyền riêng tư
        </h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
          Cam kết bảo vệ dữ liệu cá nhân và thông tin y tế của người sử dụng dịch vụ tại Wellora Healthcare.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-slate-700 space-y-8 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-700" />
            1. Nguyên tắc thu thập tối thiểu
          </h2>
          <p>
            Wellora tuân thủ nguyên tắc chỉ thu thập dữ liệu cá nhân tối thiểu cần thiết cho việc thiết lập và điều phối lịch hẹn khám:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Họ và tên người thăm khám (để xưng hô và chuẩn bị đón tiếp).</li>
            <li>Số điện thoại liên hệ chính thức (để xác nhận lịch hẹn và thông báo nhắc hẹn).</li>
            <li>Địa chỉ email (tùy chọn, để gửi xác nhận điện tử nếu người dùng cung cấp).</li>
            <li>Ghi chú nguyện vọng khám (tùy chọn, không bắt buộc nhập thông tin bệnh án chi tiết).</li>
          </ul>
          <p className="text-xs bg-slate-100 p-3 rounded text-slate-600">
            Lưu ý quan trọng: Biểu mẫu đặt lịch trực tuyến <strong>không phải là hồ sơ bệnh án điện tử</strong>. Chúng tôi không yêu cầu bạn cung cấp tiền sử bệnh lý phức tạp, thông tin tài chính hay chẩn đoán qua website công khai.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-brand-700" />
            2. Mục đích sử dụng dữ liệu
          </h2>
          <p>
            Dữ liệu bạn cung cấp chỉ được sử dụng cho các mục đích:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Liên hệ xác nhận khung giờ hẹn và bác sĩ thăm khám.</li>
            <li>Thông báo thay đổi hoặc nhắc lịch hẹn trước giờ khám.</li>
            <li>Lưu trữ nhật ký phục vụ công tác đối soát chất lượng dịch vụ nội bộ.</li>
          </ul>
          <p>
            Chúng tôi cam kết không bán, không cho thuê và không chia sẻ dữ liệu liên hệ của bạn cho bất kỳ đơn vị quảng cáo hoặc bên thứ ba nào.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-brand-700" />
            3. Lưu trữ và bảo mật hệ thống
          </h2>
          <p>
            Dữ liệu lịch hẹn được lưu trữ tại cơ sở dữ liệu có kiểm soát truy cập nghiêm ngặt. Chỉ nhân viên y tế và bộ phận lễ tân được phân quyền theo vai trò (Role-Based Access Control) mới có thể xem thông tin liên hệ phục vụ trực tiếp công tác đón tiếp.
          </p>
          <p>
            Mọi thao tác quản trị trên lịch hẹn đều được ghi nhận nhật ký kiểm toán (Audit Trail) để đảm bảo trách nhiệm giải trình.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">
            4. Quyền của người dùng
          </h2>
          <p>
            Bạn có quyền yêu cầu tra cứu trạng thái lịch hẹn bằng mã tham chiếu, yêu cầu cập nhật thông tin liên hệ hoặc yêu cầu hủy lịch bất cứ lúc nào thông qua tổng đài hotline <strong>{CLINIC_CONFIG.hotline}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}

