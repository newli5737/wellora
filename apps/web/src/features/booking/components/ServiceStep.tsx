'use client';

import React from 'react';
import Image from 'next/image';
import { BookingState } from '../types/booking';
import { Clock, Check } from 'lucide-react';
import { formatCurrency, getServiceImage } from '@/lib/format/formatters';

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

      {/* Services List with Thumbnails */}
      <div className="space-y-3">
        {state.services.map((service) => {
          const isSelected = service.id === state.serviceId;
          return (
            <div
              key={service.id}
              onClick={() => handleSelectService(service.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-600 shadow-xs'
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
              <div className="flex items-start sm:items-center gap-3.5 flex-1">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                  <Image
                    src={service.imageUrl || getServiceImage(service.slug)}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
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
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center pl-6 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                <span className="font-bold text-brand-700 text-base">
                  {formatCurrency(service.priceMinor, service.currency)}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-600" /> {service.durationMinutes} phút
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Doctor Selection with Photos */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div
              onClick={() => handleSelectPractitioner('')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                state.practitionerId === ''
                  ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-600 shadow-xs'
                  : 'border-border-default bg-white hover:border-slate-300'
              }`}
              role="radio"
              aria-checked={state.practitionerId === ''}
            >
              <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                W
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-900">
                  Bác sĩ phù hợp nhất theo lịch
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Phòng khám tự động sắp xếp bác sĩ sẵn sàng theo giờ bạn chọn.
                </div>
              </div>
            </div>

            {state.practitioners.map((p) => {
              const isSelected = state.practitionerId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPractitioner(p.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-600 shadow-xs'
                      : 'border-border-default bg-white hover:border-slate-300'
                  }`}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    <Image
                      src={p.photoUrl || '/images/clinic/doctor-ha.jpg'}
                      alt={p.displayName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900">
                      {p.displayName}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {p.bio || 'Chuyên khoa Y học Gia đình'}
                    </div>
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
          className="bg-brand-700 hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 shadow-sm"
        >
          Tiếp tục: Chọn ngày & giờ &rarr;
        </button>
      </div>
    </div>
  );
};

