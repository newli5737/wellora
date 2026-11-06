'use client';

import React, { useState } from 'react';
import { BookingState } from '../types/booking';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, Info } from 'lucide-react';
import Link from 'next/link';

interface ContactStepProps {
  state: BookingState;
  updateState: (updates: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ContactStep: React.FC<ContactStepProps> = ({
  state,
  updateState,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!state.patientName.trim()) {
      errs.patientName = 'Vui lòng nhập họ và tên';
    } else if (state.patientName.trim().length < 2) {
      errs.patientName = 'Họ tên phải có ít nhất 2 ký tự';
    }

    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!state.patientPhone.trim()) {
      errs.patientPhone = 'Vui lòng nhập số điện thoại để phòng khám liên hệ xác nhận';
    } else if (!phoneRegex.test(state.patientPhone.trim())) {
      errs.patientPhone = 'Số điện thoại không đúng định dạng (ví dụ: 0901234567)';
    }

    if (state.patientEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(state.patientEmail.trim())) {
        errs.patientEmail = 'Email không đúng định dạng';
      }
    }

    if (!state.consent) {
      errs.consent = 'Vui lòng xác nhận đồng ý với quy định điều phối lịch hẹn';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          3. Thông tin người thăm khám
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Chúng tôi chỉ thu thập thông tin tối thiểu cần thiết để xác nhận và đón tiếp bạn chu đáo.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          id="patientName"
          label="Họ và tên người khám"
          required
          placeholder="Ví dụ: Nguyễn Văn A"
          value={state.patientName}
          error={errors.patientName}
          onChange={(e) => updateState({ patientName: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="patientPhone"
            label="Số điện thoại liên hệ"
            type="tel"
            required
            placeholder="Ví dụ: 0901234567"
            helperText="Dùng để nhận cuộc gọi xác nhận lịch hẹn"
            value={state.patientPhone}
            error={errors.patientPhone}
            onChange={(e) => updateState({ patientPhone: e.target.value })}
          />

          <Input
            id="patientEmail"
            label="Địa chỉ email (Tùy chọn)"
            type="email"
            placeholder="email@example.com"
            helperText="Nhận thông tin xác nhận qua hòm thư điện tử"
            value={state.patientEmail}
            error={errors.patientEmail}
            onChange={(e) => updateState({ patientEmail: e.target.value })}
          />
        </div>

        <div>
          <label
            htmlFor="patientNote"
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Ghi chú thêm cho phòng khám (Tùy chọn)
          </label>
          <textarea
            id="patientNote"
            rows={3}
            maxLength={500}
            placeholder="Ví dụ: Cần tư vấn thêm về chế độ ăn uống, hoặc yêu cầu hỗ trợ người lớn tuổi..."
            value={state.patientNote}
            onChange={(e) => updateState({ patientNote: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-border-default rounded text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm"
          />
          <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Không nhập thông tin bệnh lý khẩn cấp hoặc nhạy cảm tại đây.
            </span>
            <span>{state.patientNote.length}/500</span>
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="pt-4 border-t border-border-default">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="consent"
              checked={state.consent}
              onChange={(e) => updateState({ consent: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Tôi xác nhận thông tin cung cấp là chính xác và đồng ý với{' '}
              <Link
                href="/chinh-sach-quyen-rieng-tu"
                target="_blank"
                className="text-brand-700 underline font-medium"
              >
                Chính sách quyền riêng tư
              </Link>{' '}
              cũng như{' '}
              <Link
                href="/dieu-khoan"
                target="_blank"
                className="text-brand-700 underline font-medium"
              >
                Quy định điều phối lịch hẹn
              </Link>{' '}
              của Wellora Healthcare.
            </span>
          </label>
          {errors.consent && (
            <p className="mt-1 text-xs text-status-danger pl-7">
              {errors.consent}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-border-default flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-border-default rounded bg-white"
        >
          &larr; Quay lại chọn giờ
        </button>
        <button
          type="submit"
          className="bg-brand-700 hover:bg-brand-800 text-white font-medium px-6 py-2.5 rounded text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          Tiếp tục: Rà soát & Gửi &rarr;
        </button>
      </div>
    </form>
  );
};

