'use client';

import React, { useState, useEffect } from 'react';
import { BookingState } from '../types/booking';
import { AvailableSlotItem, api } from '@/lib/api/client';
import { Clock, Calendar as CalendarIcon, AlertCircle, Sun, Moon } from 'lucide-react';

interface DateTimeStepProps {
  state: BookingState;
  updateState: (updates: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DateTimeStep: React.FC<DateTimeStepProps> = ({
  state,
  updateState,
  onNext,
  onBack,
}) => {
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<AvailableSlotItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generate selectable dates for the next 14 days
  const availableDates: { dateStr: string; label: string; weekday: string }[] = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const weekday = d.toLocaleDateString('vi-VN', { weekday: 'short' });
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    availableDates.push({ dateStr, label, weekday });
  }

  // Ensure default date is set
  useEffect(() => {
    if (!state.selectedDate && availableDates.length > 0) {
      updateState({ selectedDate: availableDates[0].dateStr });
    }
  }, [state.selectedDate]);

  // Fetch slots whenever selectedDate, serviceId, or practitionerId changes
  useEffect(() => {
    if (!state.selectedDate || !state.serviceId) return;

    let isMounted = true;
    setLoadingSlots(true);
    setErrorMsg(null);

    api
      .getAvailability({
        serviceId: state.serviceId,
        locationId: state.locationId || undefined,
        practitionerId: state.practitionerId || undefined,
        from: state.selectedDate,
        to: state.selectedDate,
      })
      .then((res) => {
        if (isMounted) {
          setSlots(res.slots || []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMsg(err.message || 'Không thể tải khung giờ. Vui lòng thử lại.');
          setSlots([]);
        }
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [state.selectedDate, state.serviceId, state.practitionerId]);

  const morningSlots = slots.filter((s) => {
    const hour = parseInt(s.localTime.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(s.localTime.split(':')[0], 10);
    return hour >= 12;
  });

  const canProceed = Boolean(state.selectedSlot);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          2. Chọn ngày & khung giờ khám
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Các khung giờ hiển thị theo thời gian thực tại phòng khám (Múi giờ Việt Nam GMT+7).
        </p>
      </div>

      {/* Date Horizontal Picker */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-800">
          Chọn ngày khám:
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {availableDates.map((item) => {
            const isSelected = state.selectedDate === item.dateStr;
            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => {
                  updateState({ selectedDate: item.dateStr, selectedSlot: null });
                }}
                className={`flex-shrink-0 px-3.5 py-2.5 rounded border text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                  isSelected
                    ? 'border-brand-600 bg-brand-700 text-white font-semibold'
                    : 'border-border-default bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className={`text-[11px] uppercase ${isSelected ? 'text-brand-200' : 'text-slate-500'}`}>
                  {item.weekday}
                </div>
                <div className="text-sm font-medium mt-0.5">{item.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slots Section */}
      <div className="space-y-6 pt-4 border-t border-border-default">
        {loadingSlots ? (
          <div className="py-12 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-brand-600 border-t-transparent" />
            <span>Đang tra cứu các khung giờ trống...</span>
          </div>
        ) : errorMsg ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-800 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : slots.length === 0 ? (
          <div className="py-10 text-center bg-white border border-border-default rounded p-6 space-y-2">
            <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-sm font-semibold text-slate-800">
              Không có khung giờ trống trong ngày này
            </div>
            <div className="text-xs text-slate-500 max-w-sm mx-auto">
              Phòng khám đã kín lịch hoặc ngày nghỉ theo quy định. Vui lòng chọn một ngày khác trong thanh điều hướng phía trên.
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Morning */}
            {morningSlots.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <Sun className="w-4 h-4 text-amber-500" /> Buổi sáng
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {morningSlots.map((slot) => {
                    const isSelected = state.selectedSlot?.startsAt === slot.startsAt;
                    return (
                      <button
                        key={slot.startsAt}
                        type="button"
                        onClick={() => updateState({ selectedSlot: slot })}
                        className={`py-2 px-3 rounded border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                          isSelected
                            ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                            : 'bg-white border-border-default text-slate-800 hover:border-brand-400 hover:bg-brand-50/50'
                        }`}
                        aria-pressed={isSelected}
                      >
                        {slot.localTime}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {afternoonSlots.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <Moon className="w-4 h-4 text-brand-600" /> Buổi chiều
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {afternoonSlots.map((slot) => {
                    const isSelected = state.selectedSlot?.startsAt === slot.startsAt;
                    return (
                      <button
                        key={slot.startsAt}
                        type="button"
                        onClick={() => updateState({ selectedSlot: slot })}
                        className={`py-2 px-3 rounded border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                          isSelected
                            ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                            : 'bg-white border-border-default text-slate-800 hover:border-brand-400 hover:bg-brand-50/50'
                        }`}
                        aria-pressed={isSelected}
                      >
                        {slot.localTime}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-border-default flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-border-default rounded bg-white"
        >
          &larr; Quay lại chọn dịch vụ
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={onNext}
          className="bg-brand-700 hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          Tiếp tục: Thông tin người khám &rarr;
        </button>
      </div>
    </div>
  );
};
