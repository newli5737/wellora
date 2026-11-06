import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, HelpCircle, Sparkles, MapPin, Building2 } from 'lucide-react';
import { api, ServiceItem } from '@/lib/api/client';
import { formatCurrency, getServiceImage } from '@/lib/format/formatters';
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
    <div className="space-y-16 sm:space-y-28">
      {/* Editorial Hero with Real Architectural Clinic Photo */}
      <section className="bg-brand-950 text-white pt-12 pb-20 border-b border-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and Call-to-actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-900/90 border border-brand-700/60 text-brand-300 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                Y học gia đình & Chăm sóc phòng ngừa chuẩn mực
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
                Chăm sóc sức khỏe y khoa bình tĩnh, tận tâm và đúng hẹn.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Wellora mang đến không gian y tế thanh tịnh, nơi người bệnh được lắng nghe cặn kẽ và tôn trọng thời gian bằng quy trình quản trị lịch hẹn minh bạch.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/dat-lich"
                  className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-3.5 rounded transition-colors text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                >
                  <Calendar className="w-5 h-5" />
                  Đặt lịch khám trực tuyến
                </Link>
                <Link
                  href="/dich-vu"
                  className="inline-flex items-center justify-center gap-2 bg-brand-900/70 hover:bg-brand-900 text-slate-200 border border-brand-800 font-medium px-6 py-3.5 rounded transition-colors text-base"
                >
                  Xem danh mục dịch vụ
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-brand-900/80">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Đúng giờ hẹn — Không chờ đợi mệt mỏi
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Bác sĩ chuyên khoa y học gia đình
                </span>
              </div>
            </div>

            {/* Right Column: Real Clinic Photography with Ambient Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-brand-800/80 shadow-2xl aspect-[4/3] sm:aspect-[16/11]">
                <Image
                  src="/images/clinic/hero-clinic.jpg"
                  alt="Không gian phòng khám hiện đại và yên tĩnh tại Wellora Healthcare"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent" />
                
                {/* Floating highlight badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-brand-950/90 backdrop-blur-md border border-brand-800 p-3.5 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center text-brand-300">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Khung giờ đúng hẹn</div>
                      <div className="text-slate-400 text-[11px]">30 – 45 phút thăm khám kỹ lưỡng</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-brand-300 bg-brand-900 px-2 py-1 rounded">
                    Tiêu chuẩn y khoa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Calm Atmosphere Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-border-default gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-1">
              Cơ sở vật chất chuẩn mực
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Không gian y tế tĩnh tại, ngập tràn ánh sáng tự nhiên
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
              Môi trường phòng khám được thiết kế tối giản, sạch khuẩn và cách âm tốt nhằm giảm thiểu cảm giác căng thẳng thường thấy tại các bệnh viện đông đúc.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Building2 className="w-4 h-4 text-brand-700" />
            <span>Phòng khám đa khoa Wellora — Cơ sở trung tâm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group rounded-xl overflow-hidden border border-border-default bg-white flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <Image
                src="/images/clinic/clinic-reception.jpg"
                alt="Khu vực đón tiếp và lễ tân phòng khám Wellora"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">
                  Khu vực đón tiếp & Tiếp nhận chu đáo
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Lễ tân tiếp đón đúng giờ hẹn, hỗ trợ kiểm tra thông tin nhanh gọn trong vòng chưa đầy 3 phút.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group rounded-xl overflow-hidden border border-border-default bg-white flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <Image
                src="/images/clinic/clinic-room.jpg"
                alt="Phòng khám và tư vấn riêng tư yên tĩnh"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">
                  Phòng thăm khám riêng tư
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Không gian tư vấn 1:1 bảo mật tuyệt đối, trang bị bàn khám và thiết bị chẩn đoán hiện đại.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group rounded-xl overflow-hidden border border-border-default bg-white flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <Image
                src="/images/clinic/consultation-care.jpg"
                alt="Bác sĩ thăm hỏi và lắng nghe người bệnh"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">
                  Lắng nghe & Giải thích phác đồ cặn kẽ
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Bác sĩ dành đủ thời gian giải thích chỉ số xét nghiệm và giải đáp mọi thắc mắc của bạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services with Contextual Photos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-border-default pb-6 mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-1">
              Dịch vụ chăm sóc sức khỏe
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Các gói dịch vụ thăm khám chuyên môn
            </h2>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Được thiết kế khoa học nhằm phát hiện sớm nguy cơ và duy trì thể trạng khỏe mạnh lâu dài.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="group bg-white border border-border-default rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Photo representing the service */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={service.imageUrl || getServiceImage(service.slug)}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold text-brand-700 shadow-sm">
                      {formatCurrency(service.priceMinor, service.currency)}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      <span>Thời lượng khám: <strong>{service.durationMinutes} phút</strong></span>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
                      <Link href={`/dich-vu/${service.slug}`}>
                        {service.name}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {service.description || 'Dịch vụ tư vấn và kiểm tra sức khỏe tại Wellora.'}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                  <Link
                    href={`/dich-vu/${service.slug}`}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Xem chi tiết &rarr;
                  </Link>
                  <Link
                    href={`/dat-lich?serviceId=${service.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white px-3.5 py-2 rounded transition-colors shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Đặt lịch ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Doctor Highlight with Real Photo */}
      <section className="bg-surface-subtle py-16 border-y border-border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-border-default shadow-md aspect-[4/3] sm:aspect-[4/3]">
                <Image
                  src="/images/clinic/doctor-ha.jpg"
                  alt="Bác sĩ Nguyễn Thu Hà tại phòng khám Wellora Healthcare"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-white px-3 py-1 rounded-full border border-border-default shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Bác sĩ chuyên khoa giàu y đức
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                BS. CK1 Nguyễn Thu Hà
              </h2>

              <p className="text-sm font-medium text-brand-800">
                Chuyên khoa Y học Gia đình & Chăm sóc sức khỏe phòng ngừa
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                Với hơn 12 năm kinh nghiệm trong công tác khám chữa bệnh ban đầu, Bác sĩ Thu Hà luôn tin rằng y học có giá trị nhất khi người thầy thuốc dành trọn sự tập trung để đồng hành, tìm hiểu lối sống và các yếu tố môi trường ảnh hưởng đến thể trạng của từng bệnh nhân.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/dat-lich"
                  className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-medium px-5 py-2.5 rounded text-sm transition-colors shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Đặt lịch khám với Bác sĩ
                </Link>
                <Link
                  href="/doi-ngu"
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-border-default font-medium px-4 py-2.5 rounded text-sm transition-colors"
                >
                  Xem toàn bộ đội ngũ &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Booking Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-1">
            Quy trình thuận tiện
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Đặt lịch khám 3 bước — Không cần tạo tài khoản
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Hệ thống quản trị slot thông minh đảm bảo không xảy ra trùng lịch hẹn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-border-default shadow-xs text-left">
            <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm mb-4">
              1
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              Chọn dịch vụ & thời gian
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Lựa chọn gói khám và khung giờ còn trống thực tế phù hợp nhất với quỹ thời gian của bạn.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border-default shadow-xs text-left">
            <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm mb-4">
              2
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              Cung cấp thông tin liên hệ
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Chỉ cần họ tên và số điện thoại. Chúng tôi tuyệt đối không yêu cầu bạn tạo mật khẩu phức tạp.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border-default shadow-xs text-left">
            <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm mb-4">
              3
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              Nhận mã & Đến khám đúng hẹn
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Nhận mã tham chiếu ngay lập tức. Lễ tân liên hệ chu đáo và đón tiếp bạn ngay khi đến phòng khám.
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
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border-default pb-6 mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
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
              className="border border-border-default bg-white rounded-lg p-5 space-y-2 shadow-2xs"
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
        <div className="bg-brand-950 text-white rounded-2xl p-8 sm:p-12 border border-brand-900 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
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
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold px-6 py-3.5 rounded-lg text-sm transition-colors shadow"
            >
              <Calendar className="w-4 h-4" />
              Đặt lịch trực tuyến ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
