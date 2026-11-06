import React from 'react';
import { MapPin, Phone, Mail, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CLINIC_CONFIG } from '@/lib/config/clinic';

export const metadata = {
  title: 'Liên hệ & Giờ mở cửa — Wellora Healthcare',
  description: 'Địa chỉ phòng khám, số điện thoại hotline và giờ làm việc chính thức của Wellora Healthcare.',
};

export default function ContactPage() {
  const loc = CLINIC_CONFIG.locations[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="border-b border-border-default pb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> Thông tin chính thức
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Liên hệ & Giờ làm việc
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
          Chúng tôi luôn sẵn sàng đón tiếp và hỗ trợ bạn trong suốt quá trình thăm khám tại Wellora Healthcare.
        </p>
      </div>

      {/* Emergency Alert Box */}
      <div className="p-4 rounded border border-status-warning-border bg-status-warning-bg text-amber-900 text-sm flex gap-3">
        <AlertTriangle className="w-5 h-5 text-status-warning flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold">Lưu ý về các trường hợp khẩn cấp</div>
          <div className="text-xs leading-relaxed text-amber-800">
            {CLINIC_CONFIG.emergencyNotice}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact details */}
        <div className="space-y-8">
          <div className="border border-border-default bg-white rounded p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 border-b border-border-default pb-3">
              {loc.name}
            </h2>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-900">Địa chỉ phòng khám</div>
                  <div className="text-slate-600 mt-0.5">{loc.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-900">Tổng đài đặt hẹn & Tư vấn</div>
                  <div className="text-slate-600 mt-0.5">{CLINIC_CONFIG.phoneDisplay}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-900">Email hỗ trợ</div>
                  <div className="text-slate-600 mt-0.5">{CLINIC_CONFIG.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours card */}
        <div className="border border-border-default bg-white rounded p-6 space-y-6 h-fit">
          <h2 className="text-lg font-semibold text-slate-900 border-b border-border-default pb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-700" />
            Lịch làm việc chi tiết
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Thứ Hai – Thứ Bảy:</span>
              <span className="font-semibold text-slate-900">08:00 – 12:00 & 13:30 – 17:30</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Chủ Nhật:</span>
              <span className="font-medium text-slate-500">Nghỉ</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Các ngày Lễ, Tết:</span>
              <span className="text-slate-500">Thông báo trước theo từng dịp</span>
            </div>
          </div>

          <div className="p-4 rounded bg-surface-subtle text-xs text-slate-600 leading-relaxed">
            Khuyến khích quý khách đặt lịch trước ít nhất 2 giờ để phòng khám chuẩn bị hồ sơ và sắp xếp khung giờ tốt nhất cho bạn.
          </div>
        </div>
      </div>
    </div>
  );
}

