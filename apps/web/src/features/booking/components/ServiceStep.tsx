'use client';

import React from 'react';
import { BookingState } from '../types/booking';
import { Clock, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/format/formatters';

interface ServiceStepProps {
  state: BookingState;
  updateState: (updates: Partial<BookingState>) => void;
  onNext: () => void;
}

export const ServiceStep: React.FC<ServiceStepProps> = ({
  state,
  updateState,
  onNext,
}) => {
  const selectedService = state.services.find((s) => s.id === state.serviceId);

  const handleSelectService = (id: string) => {
    // When changing service, clear selected slot since duration could differ
    updateState({ serviceId: id, selectedSlot: null });
  };

  const handleSelectPractitioner = (id: string) => {
    updateState({ practitionerId: id, selectedSlot: null });
  };

  const canProceed = Boolean(state.serviceId);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          1. Lựa chọn dịch vụ thăm khám
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Chọn dịch vụ phù hợp với nhu cầu kiểm tra sức khỏe của bạn.
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {state.services.map((service) => {
          const isSelected = service.id === state.serviceId;
          return (
            <div
              key={service.id}
              onClick={() => handleSelectService(service.id)}
              className={`p-4 rounded border transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-600'
                  : 'border-border-default bg-white hover:border-slate-300'
              }`}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleSelectService(service.id);
                }
              }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-semibold text-slate-900 text-base">
                    {service.name}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pl-6 line-clamp-2">
                  {service.description}
                </p>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center pl-6 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <span className="font-semibold text-brand-700 text-sm">
                  {formatCurrency(service.priceMinor, service.currency)}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {service.durationMinutes} phút
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Doctor Selection (Optional) */}
      {selectedService && (
        <div className="pt-6 border-t border-border-default space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Bác sĩ thăm khám (Tùy chọn)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Bạn có thể chọn bác sĩ mong muốn hoặc để phòng khám phân công bác sĩ phù hợp nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => handleSelectPractitioner('')}
              className={`p-3.5 rounded border cursor-pointer transition-colors ${
                state.practitionerId === ''
                  ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-600'
                  : 'border-border-default bg-white hover:border-slate-300'
              }`}
              role="radio"
              aria-checked={state.practitionerId === ''}
            >
              <div className="font-medium text-sm text-slate-900">
                Bác sĩ phù hợp nhất
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Phòng khám tự động sắp xếp bác sĩ sẵn sàng theo giờ bạn chọn.
              </div>
            </div>

            {state.practitioners.map((p) => {
              const isSelected = state.practitionerId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPractitioner(p.id)}
                  className={`p-3.5 rounded border cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-600'
                      : 'border-border-default bg-white hover:border-slate-300'
                  }`}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div className="font-medium text-sm text-slate-900">
                    {p.displayName}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {p.bio || 'Bác sĩ chuyên khoa y học gia đình'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action button */}
      <div className="pt-6 border-t border-border-default flex justify-end">
        <button
          type="button"
          disabled={!canProceed}
          onClick={onNext}
          className="bg-brand-700 hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          Tiếp tục: Chọn ngày & giờ &rarr;
        </button>
      </div>
    </div>
  );
};
