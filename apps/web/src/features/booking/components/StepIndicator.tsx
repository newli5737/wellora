import React from 'react';
import { BookingStep } from '../types/booking';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: BookingStep;
  onStepClick?: (step: BookingStep) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
}) => {
  const steps: { number: BookingStep; title: string }[] = [
    { number: 1, title: 'Dịch vụ & Bác sĩ' },
    { number: 2, title: 'Ngày & Giờ khám' },
    { number: 3, title: 'Thông tin người khám' },
    { number: 4, title: 'Rà soát & Xác nhận' },
  ];

  return (
    <nav aria-label="Tiến trình đặt lịch" className="w-full mb-8">
      <ol className="flex items-center justify-between relative">
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-border-default -z-0 hidden sm:block" />

        {steps.map((s) => {
          const isCompleted = s.number < currentStep;
          const isCurrent = s.number === currentStep;

          return (
            <li key={s.number} className="flex-1 flex flex-col items-center relative z-10">
              <button
                type="button"
                disabled={!isCompleted && !isCurrent}
                onClick={() => isCompleted && onStepClick && onStepClick(s.number)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                  isCompleted
                    ? 'bg-brand-700 text-white cursor-pointer hover:bg-brand-800'
                    : isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                    : 'bg-white border border-border-default text-slate-400 cursor-not-allowed'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : s.number}
              </button>
              <span
                className={`mt-2 text-xs text-center font-medium transition-colors ${
                  isCurrent
                    ? 'text-brand-900 font-semibold'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {s.title}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
