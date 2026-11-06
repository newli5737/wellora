import React, { Suspense } from 'react';
import { BookingWizard } from '@/features/booking/components/BookingWizard';
import { Calendar, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Đặt lịch khám trực tuyến — Wellora Healthcare',
  description: 'Đặt lịch hẹn thăm khám sức khỏe tại Wellora Healthcare theo 4 bước thuận tiện và minh bạch.',
};

export default function BookingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded">
          <Calendar className="w-3.5 h-3.5" /> Đặt lịch hẹn thăm khám
        </div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
          Chọn lịch khám thuận tiện cùng Wellora
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Quy trình đặt hẹn không cần đăng ký tài khoản. Lịch hẹn được xác nhận trực tiếp bởi nhân viên phòng khám.
        </p>
      </div>

      {/* Booking Form Wizard wrapped in Suspense for Next.js App Router useSearchParams */}
      <Suspense
        fallback={
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-700 border-t-transparent" />
            <span className="text-sm">Đang khởi tạo biểu mẫu đặt lịch...</span>
          </div>
        }
      >
        <BookingWizard />
      </Suspense>

      {/* Security notice */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-brand-600" />
        <span>Thông tin của bạn được bảo mật theo tiêu chuẩn quy định dữ liệu y tế.</span>
      </div>
    </div>
  );
}

