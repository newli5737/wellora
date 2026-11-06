'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { api, ApiError } from '@/lib/api/client';
import { formatDateTime, formatCurrency, getStatusBadgeInfo } from '@/lib/format/formatters';
import { ArrowLeft, Clock, Calendar, User, Phone, Mail, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminAppointmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Transition form
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('wellora_admin_token');
      if (!token) {
        router.push('/admin/dang-nhap');
        return;
      }
    }
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await api.getAdminAppointmentById(id);
      setAppointment(data);
      setSelectedStatus('');
      setReason('');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.statusCode === 401) {
        router.push('/admin/dang-nhap');
      } else {
        setErrorMsg(apiErr.message || 'Không thể tải chi tiết lịch hẹn.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;

    setUpdating(true);
    setUpdateSuccess(null);
    setErrorMsg(null);

    try {
      await api.updateAppointmentStatus(id, selectedStatus, reason);
      setUpdateSuccess(`Đã cập nhật trạng thái lịch hẹn sang "${selectedStatus}" thành công.`);
      await loadDetail();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMsg(apiErr.message || 'Lỗi khi cập nhật trạng thái.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/admin/lich-hen"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách lịch hẹn
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-2 text-slate-500">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-brand-700 border-t-transparent" />
            <span className="text-xs">Đang tải thông tin chi tiết...</span>
          </div>
        ) : errorMsg && !appointment ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : appointment ? (
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-white border border-border-default rounded p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500">Mã tham chiếu:</span>
                <h1 className="text-2xl font-bold font-mono text-brand-900">
                  {appointment.reference}
                </h1>
                <div className="text-xs text-slate-500 mt-1">
                  Được tạo lúc: {formatDateTime(appointment.createdAt)}
                </div>
              </div>

              <div>
                {(() => {
                  const statusInfo = getStatusBadgeInfo(appointment.status);
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.badgeClass}`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {statusInfo.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient info */}
              <div className="bg-white border border-border-default rounded p-5 space-y-4 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-border-default pb-2">
                  Thông tin bệnh nhân
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-600" />
                    <span className="font-semibold text-slate-900">
                      {appointment.patient?.fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-600" />
                    <span className="text-slate-800 font-mono">
                      {appointment.patient?.phone}
                    </span>
                  </div>
                  {appointment.patient?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-600" />
                      <span className="text-slate-800">
                        {appointment.patient.email}
                      </span>
                    </div>
                  )}
                  {appointment.patientNote && (
                    <div className="pt-2">
                      <span className="text-xs text-slate-500">Ghi chú của bệnh nhân:</span>
                      <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 mt-1">
                        {appointment.patientNote}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Service & Time Info */}
              <div className="bg-white border border-border-default rounded p-5 space-y-4 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-border-default pb-2">
                  Dịch vụ & Lịch trình
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-slate-500">Dịch vụ đăng ký:</span>
                    <div className="font-semibold text-slate-900">
                      {appointment.service?.name}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center justify-between mt-0.5">
                      <span>Thời lượng: {appointment.service?.durationMinutes} phút</span>
                      <span className="font-semibold text-brand-700">
                        {formatCurrency(appointment.service?.priceMinor, appointment.service?.currency)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500">Khung giờ hẹn khám:</span>
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-4 h-4 text-brand-600" />
                      {formatDateTime(appointment.startsAt)}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500">Bác sĩ phụ trách:</span>
                    <div className="font-medium text-slate-900">
                      {appointment.practitioner?.displayName || 'Chưa chỉ định bác sĩ'}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500">Cơ sở khám:</span>
                    <div className="text-xs text-slate-800 flex items-start gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span>{appointment.location?.name} — {appointment.location?.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation reason if cancelled */}
            {appointment.status === 'CANCELLED' && appointment.cancellationReason && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-900 space-y-1">
                <div className="font-semibold">Lý do hủy lịch:</div>
                <p>{appointment.cancellationReason}</p>
              </div>
            )}

            {/* Status Change Form */}
            <div className="bg-white border border-border-default rounded p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-border-default pb-3">
                Cập nhật trạng thái lịch hẹn
              </h2>

              {updateSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{updateSuccess}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(appointment.status) ? (
                <div className="p-3.5 bg-slate-100 border border-slate-200 rounded text-xs text-slate-600">
                  Lịch hẹn này đang ở trạng thái kết thúc (<strong>{appointment.status}</strong>) và không thể chuyển trạng thái tiếp.
                </div>
              ) : (
                <form onSubmit={handleStatusUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Chuyển sang trạng thái mới:
                      </label>
                      <select
                        required
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-border-default rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="">-- Chọn trạng thái --</option>
                        {appointment.status === 'PENDING' && (
                          <>
                            <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
                            <option value="CANCELLED">Hủy lịch (CANCELLED)</option>
                          </>
                        )}
                        {appointment.status === 'CONFIRMED' && (
                          <>
                            <option value="COMPLETED">Đã khám hoàn tất (COMPLETED)</option>
                            <option value="NO_SHOW">Khách không đến (NO_SHOW)</option>
                            <option value="CANCELLED">Hủy lịch (CANCELLED)</option>
                          </>
                        )}
                      </select>
                    </div>

                    {selectedStatus === 'CANCELLED' && (
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Lý do hủy lịch:
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nhập lý do khách báo bận / từ chối..."
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-border-default rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={updating || !selectedStatus}
                      className="px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      {updating ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                      ) : (
                        'Lưu thay đổi trạng thái'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
