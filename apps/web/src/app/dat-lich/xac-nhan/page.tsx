'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, Calendar, MapPin, Search, AlertCircle, ArrowRight } from 'lucide-react';
import { api, ApiError } from '@/lib/api/client';
import { formatDateTime, getStatusBadgeInfo } from '@/lib/format/formatters';
import { CLINIC_CONFIG } from '@/lib/config/clinic';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const urlRef = searchParams.get('ref') || '';

  const [inputRef, setInputRef] = useState(urlRef);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  // If redirected from successful submission, read from sessionStorage first
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('wellora_last_booking');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.reference === urlRef || !urlRef) {
            setBookingData(parsed);
            if (!urlRef) setInputRef(parsed.reference);
            return;
          }
        } catch {
          // ignore parsing error
        }
      }
    }

    if (urlRef) {
      handleLookup(urlRef);
    }
  }, [urlRef]);

  const handleLookup = async (refToLookup: string) => {
    const clean = refToLookup.trim().toUpperCase();
    if (!clean) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await api.getAppointmentStatus(clean);
      setBookingData(data);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMsg(
        apiErr.message ||
          'Không tìm thấy thông tin lịch hẹn. Vui lòng kiểm tra lại mã tham chiếu.',
      );
      setBookingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(inputRef);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Search Bar for Reference Code */}
      <div className="bg-white border border-border-default rounded p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Tra cứu trạng thái lịch hẹn
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhập mã tham chiếu được cấp khi gửi yêu cầu để kiểm tra tiến trình xác nhận.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Ví dụ: WEL-202611-A89F"
            value={inputRef}
            onChange={(e) => setInputRef(e.target.value.toUpperCase())}
            className="flex-1 px-3.5 py-2.5 bg-white border border-border-default rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 font-mono uppercase"
          />
          <button
            type="submit"
            disabled={loading || !inputRef.trim()}
            className="bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded text-sm transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Tra cứu
          </button>
        </form>

        {errorMsg && (
          <div className="p-3.5 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Appointment Details Result */}
      {bookingData && (
        <div className="bg-white border border-border-default rounded p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Header Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border-default gap-4">
            <div>
              <div className="text-xs text-slate-500">Mã tham chiếu lịch hẹn:</div>
              <div className="text-2xl font-bold font-mono text-brand-900 tracking-wide mt-0.5">
                {bookingData.reference}
              </div>
            </div>

            <div>
              {(() => {
                const info = getStatusBadgeInfo(bookingData.status);
                return (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${info.badgeClass}`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {info.label}
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Details breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-500">Dịch vụ đăng ký:</span>
              <div className="font-semibold text-slate-900">
                {bookingData.serviceName || bookingData.service?.name}
              </div>
              {bookingData.service?.durationMinutes && (
                <div className="text-xs text-slate-500">
                  Thời lượng dự kiến: {bookingData.service.durationMinutes} phút
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500">Bác sĩ / Nhân sự y tế:</span>
              <div className="font-semibold text-slate-900">
                {bookingData.practitionerName || 'Phòng khám phân công bác sĩ phù hợp'}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500">Thời gian hẹn khám:</span>
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-600 flex-shrink-0" />
                {formatDateTime(bookingData.startsAt)}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500">Địa điểm phòng khám:</span>
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
                {bookingData.locationName || bookingData.location?.name}
              </div>
              <div className="text-xs text-slate-500 pl-5.5">
                {bookingData.locationAddress || bookingData.location?.address}
              </div>
            </div>
          </div>

          {/* Operational Guidance */}
          <div className="pt-6 border-t border-border-default space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Các bước tiếp theo cần lưu ý:
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>
                  Đội ngũ lễ tân Wellora sẽ liên hệ qua điện thoại trước giờ hẹn để xác nhận lịch và hỗ trợ các dặn dò chuyên môn nếu cần thiết.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>
                  Nếu bạn cần đổi khung giờ hoặc hủy lịch, vui lòng gọi hotline <strong>{CLINIC_CONFIG.hotline}</strong> trước ít nhất 2 giờ.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>
                  Vui lòng có mặt trước giờ hẹn khoảng 10 phút để làm thủ tục đón tiếp nhanh chóng.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-4 flex justify-between items-center text-xs">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              Về trang chủ
            </Link>
            <Link
              href="/dat-lich"
              className="text-brand-700 hover:text-brand-800 font-semibold flex items-center gap-1"
            >
              Đặt thêm lịch hẹn khác <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-700 border-t-transparent" />
          <span className="text-sm">Đang tải thông tin lịch hẹn...</span>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
