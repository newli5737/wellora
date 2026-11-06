'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingState } from '../types/booking';
import { api, ApiError } from '@/lib/api/client';
import { formatCurrency, formatDateTime } from '@/lib/format/formatters';
import { Calendar, User, Phone, MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ReviewStepProps {
  state: BookingState;
  onBack: () => void;
  onBackToSlotSelection: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  state,
  onBack,
  onBackToSlotSelection,
}) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSlotConflict, setIsSlotConflict] = useState(false);

  const service = state.services.find((s) => s.id === state.serviceId);
  const practitioner = state.practitioners.find((p) => p.id === state.practitionerId);
  const location = state.locations.find((l) => l.id === state.locationId) || state.locations[0];

  const handleSubmit = async () => {
    if (!state.selectedSlot || !service) return;

    setSubmitting(true);
    setErrorMessage(null);
    setIsSlotConflict(false);

    try {
      const res = await api.createAppointment({
        serviceId: service.id,
        locationId: location?.id,
        practitionerId: state.practitionerId || undefined,
        startsAt: state.selectedSlot.startsAt,
        patientName: state.patientName,
        patientPhone: state.patientPhone,
        patientEmail: state.patientEmail || undefined,
        patientNote: state.patientNote || undefined,
        consent: state.consent,
      });

      // Save confirmation reference into sessionStorage so confirmation page can display it safely without PII in URL
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('wellora_last_booking', JSON.stringify(res));
      }

      router.push(`/dat-lich/xac-nhan?ref=${res.reference}`);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.statusCode === 409 || apiErr.code === 'APPOINTMENT_SLOT_UNAVAILABLE') {
        setIsSlotConflict(true);
        setErrorMessage(
          apiErr.message ||
            'Khung giờ bạn vừa chọn đã có người đặt trước. Vui lòng quay lại bước 2 để chọn khung giờ khác.',
        );
      } else {
        setErrorMessage(
          apiErr.message || 'Đã có lỗi xảy ra trong quá trình gửi yêu cầu. Vui lòng thử lại.',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          4. Rà soát thông tin & Gửi yêu cầu
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Vui lòng kiểm tra lại thông tin chi tiết trước khi xác nhận gửi yêu cầu đặt lịch.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded border border-red-200 bg-red-50 text-red-900 text-sm flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <div className="font-semibold">Không thể hoàn tất đặt lịch</div>
            <p className="text-xs text-red-800 leading-relaxed">{errorMessage}</p>
            {isSlotConflict && (
              <button
                type="button"
                onClick={onBackToSlotSelection}
                className="mt-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 px-3 py-1.5 rounded transition-colors"
              >
                &larr; Quay lại chọn khung giờ khác
              </button>
            )}
          </div>
        </div>
      )}

      {/* Summary Box */}
      <div className="border border-border-default bg-white rounded divide-y divide-border-default">
        {/* Service & Time */}
        <div className="p-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Dịch vụ & Thời gian khám
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-base font-semibold text-slate-900">
                {service?.name}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                Thời lượng dự kiến: {service?.durationMinutes} phút
              </div>
            </div>
            <div className="text-right sm:text-right">
              <span className="font-bold text-brand-700 text-base">
                {formatCurrency(service?.priceMinor, service?.currency)}
              </span>
            </div>
          </div>

          <div className="bg-surface-subtle p-3 rounded text-sm text-slate-800 flex items-center gap-2 mt-2">
            <Calendar className="w-4 h-4 text-brand-700 flex-shrink-0" />
            <span>
              Thời gian hẹn:{' '}
              <strong className="text-slate-900 font-semibold">
                {state.selectedSlot ? formatDateTime(state.selectedSlot.startsAt) : 'Chưa chọn'}
              </strong>
            </span>
          </div>
        </div>

        {/* Location & Doctor */}
        <div className="p-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Địa điểm & Bác sĩ phụ trách
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900">{location?.name || 'Cơ sở Wellora'}</div>
                <div className="text-xs text-slate-500 mt-0.5">{location?.address}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900">
                  {practitioner ? practitioner.displayName : 'Bác sĩ theo lịch phân công phòng khám'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Chuyên khoa y học gia đình
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Contact Info */}
        <div className="p-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Thông tin liên hệ người khám
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500 text-xs">Họ và tên:</span>
              <div className="font-medium text-slate-900">{state.patientName}</div>
            </div>
            <div>
              <span className="text-slate-500 text-xs">Số điện thoại:</span>
              <div className="font-medium text-slate-900">{state.patientPhone}</div>
            </div>
            {state.patientEmail && (
              <div>
                <span className="text-slate-500 text-xs">Email:</span>
                <div className="font-medium text-slate-900">{state.patientEmail}</div>
              </div>
            )}
            {state.patientNote && (
              <div className="sm:col-span-2">
                <span className="text-slate-500 text-xs">Ghi chú gửi kèm:</span>
                <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded mt-0.5">
                  {state.patientNote}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Statement */}
      <div className="text-xs text-slate-500 leading-relaxed bg-brand-50/50 p-4 rounded border border-brand-100 flex items-start gap-2.5">
        <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <span>
          Bằng việc nhấn &ldquo;Xác nhận gửi yêu cầu&rdquo;, bạn đồng ý để Wellora Healthcare liên hệ qua số điện thoại trên nhằm mục đích điều phối và xác nhận lịch hẹn của bạn. Bạn không cần thanh toán bất kỳ khoản phí nào trước khi thăm khám.
        </span>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-border-default flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-border-default rounded bg-white disabled:opacity-50"
        >
          &larr; Sửa thông tin liên hệ
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-brand-700 hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded text-sm transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 flex items-center gap-2"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Đang xác nhận lịch hẹn...
            </>
          ) : (
            'Xác nhận gửi yêu cầu đặt lịch'
          )}
        </button>
      </div>
    </div>
  );
};
