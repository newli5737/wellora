import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Calendar, ShieldCheck, ChevronRight, CheckCircle2, UserCheck, MapPin } from 'lucide-react';
import { api, ServiceItem } from '@/lib/api/client';
import { formatCurrency, getServiceImage } from '@/lib/format/formatters';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  try {
    const service = await api.getServiceBySlug(params.slug);
    return {
      title: `${service.name} — Wellora Healthcare`,
      description: service.description || service.name,
    };
  } catch {
    return {
      title: 'Chi tiết dịch vụ — Wellora Healthcare',
    };
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  let service: ServiceItem | null = null;
  try {
    service = await api.getServiceBySlug(params.slug);
  } catch {
    notFound();
  }

  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-800">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/dich-vu" className="hover:text-slate-800">
          Dịch vụ
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-medium truncate max-w-xs">{service.name}</span>
      </nav>

      {/* Main Service Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Main Service Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-border-default shadow-sm">
            <Image
              src={service.imageUrl || getServiceImage(service.slug)}
              alt={service.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Dịch vụ chuyên khoa
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              {service.name}
            </h1>
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Mục tiêu & Ý nghĩa thăm khám</h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {service.description || 'Dịch vụ thăm khám chu đáo được thực hiện theo quy chuẩn y khoa tại Wellora.'}
            </p>

            <h2 className="text-xl font-semibold text-slate-900 pt-4">Quy trình trong buổi khám</h2>
            <ul className="space-y-3 list-none pl-0 text-sm text-slate-600">
              <li className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-border-default">
                <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>Khai thác tiền sử bệnh lý cá nhân, thói quen sinh hoạt và các triệu chứng cần lưu ý.</span>
              </li>
              <li className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-border-default">
                <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>Kiểm tra lâm sàng cơ bản, đo các chỉ số sinh hiệu (huyết áp, nhịp tim, nồng độ oxy, chỉ số BMI).</span>
              </li>
              <li className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-border-default">
                <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>Bác sĩ trực tiếp phân tích kết quả, giải đáp cặn kẽ và thiết lập kế hoạch chăm sóc cá nhân hóa.</span>
              </li>
              <li className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-border-default">
                <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>Dặn dò chế độ dinh dưỡng, vận động khoa học và hẹn lịch tái khám định kỳ nếu cần thiết.</span>
              </li>
            </ul>
          </div>

          {/* Practitioner list */}
          {service.practitioners && service.practitioners.length > 0 && (
            <div className="pt-6 border-t border-border-default space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-brand-700" />
                Bác sĩ phụ trách dịch vụ này
              </h2>
              <div className="space-y-3">
                {service.practitioners.map((p) => (
                  <div
                    key={p.practitioner.id}
                    className="p-4 rounded-xl border border-border-default bg-white flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                        {p.practitioner.photoUrl ? (
                          <Image
                            src={p.practitioner.photoUrl}
                            alt={p.practitioner.displayName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                            <UserCheck className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {p.practitioner.displayName}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {p.practitioner.bio || 'Chuyên viên y tế tại Wellora Healthcare'}
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/dat-lich?serviceId=${service!.id}&practitionerId=${p.practitioner.id}`}
                      className="text-xs font-semibold text-brand-700 hover:text-brand-800"
                    >
                      Đặt khám với bác sĩ &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary & CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-border-default rounded-xl p-6 space-y-6 sticky top-28 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 border-b border-border-default pb-3">
              Thông tin dịch vụ
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Thời lượng khám:</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-brand-600" /> {service.durationMinutes} phút
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Chi phí dự kiến:</span>
                <span className="font-bold text-brand-700 text-lg">
                  {formatCurrency(service.priceMinor, service.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Hình thức:</span>
                <span className="font-medium text-slate-800">Trực tiếp tại phòng khám</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/dat-lich?serviceId=${service.id}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-medium py-3 px-4 rounded-lg text-sm transition-colors shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                Đặt lịch khám ngay
              </Link>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed text-center">
              Không thu tiền trước khi đặt lịch trực tuyến. Bạn có thể thanh toán trực tiếp tại phòng khám sau khi hoàn tất buổi khám.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
