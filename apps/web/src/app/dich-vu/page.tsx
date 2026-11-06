import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { api, ServiceItem } from '@/lib/api/client';
import { formatCurrency } from '@/lib/format/formatters';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="border-b border-border-default pb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> Chuyên môn & Tận tâm
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Danh mục dịch vụ thăm khám
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
          Wellora cung cấp các dịch vụ chăm sóc sức khỏe ban đầu, sàng lọc và theo dõi định kỳ
          với thời lượng thăm khám đủ sâu và tư vấn phác đồ cá nhân hóa.
        </p>
      </div>

      {/* Services List */}
      {services.length === 0 ? (
        <div className="p-10 text-center bg-white border border-border-default rounded text-slate-500">
          Hiện tại danh mục dịch vụ đang được cập nhật. Vui lòng liên hệ hotline để được hỗ trợ trực tiếp.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-border-default rounded p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    <Clock className="w-3.5 h-3.5" />
                    {service.durationMinutes} phút
                  </span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {formatCurrency(service.priceMinor, service.currency)}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-slate-900">
                  <Link
                    href={`/dich-vu/${service.slug}`}
                    className="hover:text-brand-700 transition-colors"
                  >
                    {service.name}
                  </Link>
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {service.description || 'Thăm khám và tư vấn chuyên sâu cùng bác sĩ chuyên khoa.'}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border-default flex items-center justify-between">
                <Link
                  href={`/dich-vu/${service.slug}`}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/dat-lich?serviceId=${service.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white px-3.5 py-2 rounded transition-colors"
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
