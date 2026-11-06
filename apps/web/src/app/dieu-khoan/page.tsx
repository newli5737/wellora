import React from 'react';
import { ShieldCheck, FileText, AlertTriangle } from 'lucide-react';
import { CLINIC_CONFIG } from '@/lib/config/clinic';

export const metadata = {
  title: 'Điều khoản dịch vụ & Quy định lịch hẹn — Wellora Healthcare',
  description: 'Các điều khoản sử dụng hệ thống đặt lịch hẹn và quy định thăm khám tại Wellora Healthcare.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-border-default pb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> Thỏa thuận người dùng
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Điều khoản dịch vụ & Quy định đặt lịch
        </h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
          Quy chế điều phối lịch hẹn, quy tắc xác nhận và chính sách đổi/hủy lịch tại phòng khám Wellora Healthcare.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-slate-700 space-y-8 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-700" />
            1. Quy trình tiếp nhận và xác nhận lịch hẹn
          </h2>
          <p>
            Khi gửi yêu cầu đặt lịch trên website, bạn nhận được mã tham chiếu với trạng thái <em>Chờ xác nhận (Pending)</em>.
            Yêu cầu này sẽ chính thức trở thành lịch hẹn khám được giữ chỗ khi bộ phận lễ tân của chúng tôi liên hệ xác nhận thành công với bạn qua điện thoại.
          </p>
          <p>
            Wellora có quyền hủy các yêu cầu đặt lịch nếu không thể liên hệ được với người đặt qua số điện thoại cung cấp sau 3 lần gọi trong ngày làm việc.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-brand-700" />
            2. Chính sách đổi lịch và hủy lịch
          </h2>
          <p>
            Nhằm tôn trọng thời gian của bác sĩ và các bệnh nhân khác, chúng tôi đề nghị:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Nếu cần đổi giờ hoặc hủy lịch, vui lòng thông báo trước ít nhất <strong>02 giờ</strong> so với thời điểm hẹn.</li>
            <li>Trường hợp người bệnh đến trễ quá 15 phút so với giờ hẹn mà không thông báo trước, lượt khám có thể được dời sang khung giờ phù hợp tiếp theo để không ảnh hưởng đến lịch của người hẹn sau.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">
            3. Giới hạn trách nhiệm y khoa
          </h2>
          <p>
            Hệ thống đặt lịch trực tuyến của Wellora chỉ hỗ trợ điều phối lịch thăm khám trực tiếp. Mọi thông tin trên website có tính chất định hướng, không thay thế chẩn đoán lâm sàng hay chỉ định phác đồ điều trị trực tiếp từ bác sĩ.
          </p>
          <p>
            Đối với các triệu chứng khẩn cấp (khó thở dữ dội, đau ngực cấp, chấn thương nặng, đột quỵ), quý khách cần lập tức liên hệ cấp cứu 115 hoặc di chuyển đến cơ sở cấp cứu đa khoa gần nhất.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">
            4. Liên hệ hỗ trợ
          </h2>
          <p>
            Mọi thắc mắc liên quan đến điều khoản và quy chế hoạt động, xin vui lòng liên hệ tổng đài <strong>{CLINIC_CONFIG.hotline}</strong> hoặc gửi thư về địa chỉ <strong>{CLINIC_CONFIG.email}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
