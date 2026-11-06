import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { api, ServiceItem } from '@/lib/api/client';
import { formatCurrency } from '@/lib/format/formatters';
import { CLINIC_CONFIG } from '@/lib/config/clinic';

async function getServices(): Promise<ServiceItem[]> {
  try {
    return await api.getServices();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const services = await getServices();

  const faqs = [
    {
      q: 'Quy trình tiếp nhận và xác nhận lịch hẹn diễn ra như thế nào?',
      a: 'Sau khi bạn gửi thông tin đặt lịch trên website, hệ thống sẽ gửi mã tham chiếu xác nhận tiếp nhận. Đội ngũ lễ tân Wellora sẽ liên hệ qua điện thoại hoặc tin nhắn trong vòng 1-2 giờ làm việc để hoàn tất xác nhận lịch hẹn chính thức.',
    },
    {
      q: 'Tôi có thể đổi hoặc hủy lịch hẹn không?',
      a: 'Bạn hoàn toàn có thể đổi giờ hoặc hủy lịch hẹn trước ít nhất 2 giờ so với thời điểm khám bằng cách liên hệ hotline 1900 8888 hoặc thông báo khi lễ tân gọi xác nhận.',
    },
    {
      q: 'Tôi cần mang theo những gì khi đến khám?',
      a: 'Bạn vui lòng mang theo Căn cước công dân (hoặc giấy tờ tùy thân có ảnh) cùng các kết quả xét nghiệm, đơn thuốc cũ (nếu có) để bác sĩ có thêm căn cứ đánh giá sức khỏe.',
    },
    {
      q: 'Dữ liệu cá nhân và thông tin liên hệ của tôi được bảo mật ra sao?',
      a: 'Wellora cam kết chỉ thu thập dữ liệu tối thiểu cần thiết để điều phối lịch hẹn. Dữ liệu được mã hóa, lưu trữ an toàn và tuyệt đối không chia sẻ cho bên thứ ba cho mục đích thương mại.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Editorial Hero */}
      <section className="bg-brand-950 text-white pt-16 pb-20 border-b border-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/80 border border-brand-700/60 text-brand-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Chăm sóc sức khỏe y học gia đình & phòng ngừa
            </div>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              Chăm sóc sức khỏe chuẩn mực, tận tâm và đúng hẹn.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Wellora mang đến trải nghiệm y tế bình tĩnh, minh bạch và tôn trọng thời gian của bạn.
              Đặt lịch khám thuận tiện, chọn trước thời gian phù hợp và được thăm khám chu đáo bởi đội ngũ chuyên môn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/dat-lich"
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-3.5 rounded transition-colors text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              >
                <Calendar className="w-5 h-5" />
                Đặt lịch khám ngay
              </Link>
              <Link
                href="/dich-vu"
                className="inline-flex items-center justify-center gap-2 bg-brand-900/60 hover:bg-brand-900 text-slate-200 border border-brand-800 font-medium px-6 py-3.5 rounded transition-colors text-base"
              >
                Xem các dịch vụ
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" /> Không phải chờ đợi lâu
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" /> Bác sĩ chuyên khoa giàu kinh nghiệm
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Why Wellora */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border-default pb-8 mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Giá trị cốt lõi trong từng dịch vụ
          </h2>
          <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base">
            Chúng tôi tin rằng việc chăm sóc sức khỏe chất lượng bắt đầu từ sự lắng nghe cẩn trọng và tôn trọng người bệnh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-border-default bg-white p-6 rounded">
            <div className="w-10 h-10 rounded bg-brand-50 text-brand-700 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Khung giờ chuẩn xác
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Lịch khám được phân bổ thời lượng thực tế và có thời gian giãn cách giữa các ca khám, giúp bạn không phải chờ đợi kéo dài.
            </p>
          </div>

          <div className="border border-border-default bg-white p-6 rounded">
            <div className="w-10 h-10 rounded bg-brand-50 text-brand-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Chuyên môn minh bạch
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Thông tin dịch vụ, bác sĩ phụ trách và thời lượng khám được công khai rõ ràng, giúp bạn chủ động trong kế hoạch chăm sóc bản thân.
            </p>
          </div>

          <div className="border border-border-default bg-white p-6 rounded">
            <div className="w-10 h-10 rounded bg-brand-50 text-brand-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Bảo mật dữ liệu y tế
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Chỉ thu thập thông tin liên hệ cần thiết cho việc điều phối lịch hẹn. Dữ liệu cá nhân luôn được mã hóa và bảo mật nghiêm ngặt.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-border-default pb-6 mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Dịch vụ thăm khám & Tư vấn
            </h2>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Các gói dịch vụ chăm sóc sức khỏe chủ động được thiết kế khoa học.
            </p>
          </div>
          <Link
            href="/dich-vu"
            className="text-sm font-medium text-brand-700 hover:text-brand-800 flex items-center gap-1"
          >
            Tất cả dịch vụ <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="p-8 text-center bg-white border border-border-default rounded text-slate-500 text-sm">
            Đang cập nhật danh mục dịch vụ. Vui lòng quay lại sau hoặc liên hệ hotline {CLINIC_CONFIG.hotline}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-border-default rounded p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="inline-flex items-center gap-1 font-medium text-brand-700">
                      <Clock className="w-3.5 h-3.5" />
                      {service.durationMinutes} phút
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(service.priceMinor, service.currency)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6">
                    {service.description || 'Dịch vụ tư vấn và kiểm tra sức khỏe tại Wellora.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-border-default flex items-center justify-between">
                  <Link
                    href={`/dich-vu/${service.slug}`}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Xem chi tiết
                  </Link>
                  <Link
                    href={`/dat-lich?serviceId=${service.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white px-3 py-2 rounded transition-colors"
                  >
                    Đặt lịch ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3-Step Booking Process */}
      <section className="bg-surface-subtle py-16 border-y border-border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Quy trình đặt lịch 3 bước nhanh chóng
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Chỉ mất 2 phút để hoàn tất yêu cầu đặt lịch hẹn trực tuyến.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded border border-border-default text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm mb-4 mx-auto sm:mx-0">
                1
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Chọn dịch vụ & thời gian
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Lựa chọn gói dịch vụ cần khám và khung giờ còn trống phù hợp nhất với thời gian của bạn.
              </p>
            </div>

            <div className="bg-white p-6 rounded border border-border-default text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm mb-4 mx-auto sm:mx-0">
                2
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Cung cấp thông tin liên hệ
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nhập họ tên và số điện thoại nhận xác nhận. Bạn không cần phải tạo tài khoản rườm rà.
              </p>
            </div>

            <div className="bg-white p-6 rounded border border-border-default text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm mb-4 mx-auto sm:mx-0">
                3
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Nhận mã & Đến khám đúng giờ
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hệ thống cấp mã tham chiếu tra cứu. Nhân viên y tế sẽ đón tiếp và thăm khám chu đáo.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/dat-lich"
              className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-medium px-6 py-3 rounded text-sm transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4" /> Bắt đầu đặt lịch ngay
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordion / Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border-default pb-6 mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Câu hỏi thường gặp (FAQ)
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Những điều bạn có thể quan tâm trước khi đặt lịch khám tại Wellora.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-border-default bg-white rounded p-5 space-y-2"
            >
              <h3 className="text-base font-semibold text-slate-900 flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed pl-7.5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-brand-950 text-white rounded p-8 sm:p-12 border border-brand-900 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Bắt đầu chăm sóc sức khỏe của bạn ngay hôm nay
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Chọn dịch vụ và khung giờ phù hợp để được thăm khám chuẩn mực cùng đội ngũ y tế Wellora.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/dat-lich"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold px-6 py-3.5 rounded text-sm transition-colors shadow"
            >
              <Calendar className="w-4 h-4" />
              Đặt lịch trực tuyến
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
