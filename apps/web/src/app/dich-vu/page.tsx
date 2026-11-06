import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { api, ServiceItem } from '@/lib/api/client';
import { formatCurrency, getServiceImage } from '@/lib/format/formatters';

export const metadata = {
  title: 'Danh mục dịch vụ y tế — Wellora Healthcare',
  description: 'Danh mục các dịch vụ thăm khám sức khỏe tổng quát, theo dõi định kỳ và tư vấn dinh dưỡng tại Wellora Healthcare.',
};

async function getServices(): Promise<ServiceItem[]> {
  try {
    return await api.getServices();
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header with Ambient Photo Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-brand-950 text-white p-8 sm:p-12 border border-brand-900 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-300 bg-brand-900/80 px-2.5 py-1 rounded">
            <ShieldCheck className="w-3.5 h-3.5" /> Chuyên môn y học gia đình
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Danh mục dịch vụ thăm khám
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Wellora cung cấp các gói dịch vụ chăm sóc sức khỏe ban đầu, sàng lọc và theo dõi định kỳ với thời lượng thăm khám đủ sâu và tư vấn phác đồ cá nhân hóa.
          </p>
        </div>
      </div>

      {/* Services List with Images */}
      {services.length === 0 ? (
        <div className="p-10 text-center bg-white border border-border-default rounded text-slate-500">
          Hiện tại danh mục dịch vụ đang được cập nhật. Vui lòng liên hệ hotline để được hỗ trợ trực tiếp.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white border border-border-default rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={service.imageUrl || getServiceImage(service.slug)}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-bold text-brand-700 shadow-xs">
                    {formatCurrency(service.priceMinor, service.currency)}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    <span>Thời lượng: <strong>{service.durationMinutes} phút</strong></span>
                  </div>

                  <h2 className="text-xl font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
                    <Link href={`/dich-vu/${service.slug}`}>
                      {service.name}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {service.description || 'Thăm khám và tư vấn chuyên sâu cùng bác sĩ chuyên khoa.'}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                <Link
                  href={`/dich-vu/${service.slug}`}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/dat-lich?serviceId=${service.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white px-3.5 py-2 rounded transition-colors shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Đặt lịch
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
