'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookingState, BookingStep } from '../types/booking';
import { api } from '@/lib/api/client';
import { StepIndicator } from './StepIndicator';
import { ServiceStep } from './ServiceStep';
import { DateTimeStep } from './DateTimeStep';
import { ContactStep } from './ContactStep';
import { ReviewStep } from './ReviewStep';
import { AlertCircle } from 'lucide-react';

export const BookingWizard: React.FC = () => {
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get('serviceId') || '';
  const initialPractitionerId = searchParams.get('practitionerId') || '';

  const [step, setStep] = useState<BookingStep>(1);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const [state, setState] = useState<BookingState>({
    serviceId: initialServiceId,
    locationId: '',
    practitionerId: initialPractitionerId,
    selectedDate: '',
    selectedSlot: null,
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientNote: '',
    consent: false,
    services: [],
    locations: [],
    practitioners: [],
  });

  const updateState = (updates: Partial<BookingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    let isMounted = true;
    setLoadingInitial(true);

    Promise.all([
      api.getServices(),
      api.getLocations(),
      api.getPractitioners(),
    ])
      .then(([services, locations, practitioners]) => {
        if (!isMounted) return;

        const defaultServiceId =
          initialServiceId && services.some((s) => s.id === initialServiceId)
            ? initialServiceId
            : services[0]?.id || '';

        const defaultLocationId = locations[0]?.id || '';

        setState((prev) => ({
          ...prev,
          services,
          locations,
          practitioners,
          serviceId: prev.serviceId || defaultServiceId,
          locationId: prev.locationId || defaultLocationId,
        }));
      })
      .catch((err) => {
        if (isMounted) {
          setInitError(err.message || 'Không thể tải danh mục dịch vụ. Vui lòng kiểm tra lại.');
        }
      })
      .finally(() => {
        if (isMounted) setLoadingInitial(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialServiceId]);

  if (loadingInitial) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-700 border-t-transparent" />
        <span className="text-sm">Đang tải biểu mẫu đặt lịch...</span>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-red-50 border border-red-200 rounded text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
        <div className="text-base font-semibold text-red-900">Không thể kết nối máy chủ</div>
        <p className="text-xs text-red-700">{initError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-semibold"
        >
          Thử tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border-default rounded p-6 sm:p-8 shadow-sm">
      <StepIndicator currentStep={step} onStepClick={(s) => setStep(s)} />

      {step === 1 && (
        <ServiceStep
          state={state}
          updateState={updateState}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <DateTimeStep
          state={state}
          updateState={updateState}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <ContactStep
          state={state}
          updateState={updateState}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <ReviewStep
          state={state}
          onBack={() => setStep(3)}
          onBackToSlotSelection={() => setStep(2)}
        />
      )}
    </div>
  );
};
