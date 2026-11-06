'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { api, ApiError } from '@/lib/api/client';
import { formatDateTime, getStatusBadgeInfo } from '@/lib/format/formatters';
import { Filter, Calendar, Eye, Check, X, AlertCircle } from 'lucide-react';

export default function AdminAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Auth guard check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('wellora_admin_token');
      if (!token) {
        router.push('/admin/dang-nhap');
        return;
      }
    }
    loadAppointments();
  }, [page, statusFilter, dateFilter]);

  const loadAppointments = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.getAdminAppointments({
        page,
        pageSize: 15,
        status: statusFilter || undefined,
        from: dateFilter || undefined,
        to: dateFilter || undefined,
      });
      setAppointments(res.data);
      setTotalPages(res.pagination.totalPages || 1);
      setTotalCount(res.pagination.total);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.statusCode === 401) {
        router.push('/admin/dang-nhap');
      } else {
        setErrorMsg(apiErr.message || 'Không thể tải danh sách lịch hẹn.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateAppointmentStatus(id, newStatus);
      loadAppointments();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      alert(`Lỗi cập nhật: ${apiErr.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-default gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Quản lý lịch hẹn khám bệnh
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Tổng số {totalCount} lịch hẹn trong cơ sở dữ liệu.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 bg-white border border-border-default rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xác nhận (Pending)</option>
                <option value="CONFIRMED">Đã xác nhận (Confirmed)</option>
                <option value="COMPLETED">Đã khám (Completed)</option>
                <option value="CANCELLED">Đã hủy (Cancelled)</option>
                <option value="NO_SHOW">Vắng mặt (No-show)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 bg-white border border-border-default rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {dateFilter && (
                <button
                  type="button"
                  onClick={() => setDateFilter('')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                  title="Xóa lọc ngày"
                >
                  Xóa ngày
                </button>
              )}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Appointments Table */}
        <div className="bg-white border border-border-default rounded shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-2 text-slate-500">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-brand-700 border-t-transparent" />
              <span className="text-xs">Đang tải lịch hẹn...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              Không tìm thấy lịch hẹn nào theo bộ lọc đã chọn.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-border-default text-slate-600 uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-3 px-4">Mã tham chiếu</th>
                    <th className="py-3 px-4">Thời gian khám</th>
                    <th className="py-3 px-4">Người khám & SĐT</th>
                    <th className="py-3 px-4">Dịch vụ</th>
                    <th className="py-3 px-4">Bác sĩ</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {appointments.map((appt) => {
                    const statusInfo = getStatusBadgeInfo(appt.status);
                    return (
                      <tr
                        key={appt.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                          <Link
                            href={`/admin/lich-hen/${appt.id}`}
                            className="hover:text-brand-700 hover:underline"
                          >
                            {appt.reference}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-medium">
                          {formatDateTime(appt.startsAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">
                            {appt.patient?.fullName}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {appt.patient?.phone}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-800">
                          {appt.service?.name}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {appt.practitioner?.displayName || 'Chưa phân công'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusInfo.badgeClass}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {appt.status === 'PENDING' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleQuickStatusChange(appt.id, 'CONFIRMED')
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-medium transition-colors"
                              title="Xác nhận lịch hẹn"
                            >
                              <Check className="w-3 h-3" />
                              Xác nhận
                            </button>
                          )}
                          <Link
                            href={`/admin/lich-hen/${appt.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 border border-border-default hover:bg-slate-100 text-slate-700 rounded text-[11px] font-medium transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            Chi tiết
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="py-3 px-4 border-t border-border-default flex items-center justify-between text-xs text-slate-500">
              <div>
                Trang {page} / {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 bg-white border border-border-default rounded disabled:opacity-50 hover:bg-slate-50"
                >
                  &larr; Trang trước
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 bg-white border border-border-default rounded disabled:opacity-50 hover:bg-slate-50"
                >
                  Trang sau &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

