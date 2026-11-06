import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Heart, Clock, Award, Calendar, CheckCircle2 } from 'lucide-react';
import { CLINIC_CONFIG } from '@/lib/config/clinic';

export const metadata = {
  title: 'Giới thiệu — Wellora Healthcare',
  description: 'Tìm hiểu về sứ mệnh, giá trị cốt lõi và tiêu chuẩn chăm sóc tại Wellora Healthcare.',
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded">
          <ShieldCheck className="w-3.5 h-3.5" /> Về Wellora Healthcare
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight leading-tight">
          Nơi việc chăm sóc sức khỏe trở về đúng bản chất: Tận tâm, Điềm tĩnh & Chuẩn mực.
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Wellora ra đời từ mong muốn xây dựng một không gian y tế nơi người bệnh được lắng nghe trọn vẹn, được tư vấn rõ ràng và được tôn trọng thời gian bằng quy trình quản trị lịch hẹn minh bạch.
        </p>
      </div>

      {/* Visual Showcase: Main Clinic Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 relative aspect-[16/10] rounded-2xl overflow-hidden border border-border-default shadow-md">
          <Image
            src="/images/clinic/hero-clinic.jpg"
            alt="Phòng khám Wellora Healthcare"
            fill
            className="object-cover"
          />
        </div>
        <div className="md:col-span-5 relative aspect-[16/10] md:aspect-auto md:h-full rounded-2xl overflow-hidden border border-border-default shadow-md min-h-[260px]">
          <Image
            src="/images/clinic/clinic-reception.jpg"
            alt="Khu đón tiếp lễ tân"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Philosophy of Care */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Triết lý chăm sóc sức khỏe chủ động
          </h2>
          <p>
            Y tế hiện đại không chỉ là điều trị khi bệnh phát tác, mà là quá trình đồng hành liên tục để phát hiện sớm các nguy cơ, điều chỉnh lối sống và duy trì thể trạng khỏe mạnh dài lâu.
          </p>
          <p>
            Tại Wellora, mỗi lượt thăm khám được thiết kế với thời lượng đủ sâu (từ 30 đến 45 phút), giúp bác sĩ có đủ thời gian thăm hỏi cặn kẽ và giải thích tường tận phác đồ cho bạn.
          </p>
          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Chẩn đoán dựa trên chứng cứ khoa học y khoa rõ ràng.</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Không lạm dụng xét nghiệm hay chỉ định thuốc không cần thiết.</span>
            </div>
          </div>
        </div>

        <div className="bg-brand-950 text-white rounded-2xl p-8 sm:p-10 border border-brand-900 space-y-4 shadow-xl">
          <div className="text-brand-400 font-semibold text-xs uppercase tracking-wider">Cam kết từ Wellora</div>
          <div className="text-2xl font-bold text-white leading-snug">
            “Mỗi người bệnh là một câu chuyện riêng cần được thấu hiểu trọn vẹn.”
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Chúng tôi kiên định không tiếp nhận quá tải để đảm bảo chất lượng từng ca khám. Thời gian hẹn của bạn được tôn trọng như chính sự an tâm của bạn.
          </p>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="pt-8 border-t border-border-default space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            3 Trụ cột cốt lõi
          </h2>
          <p className="text-xs text-slate-500 mt-1">Kim chỉ nam trong mọi hoạt động y tế tại phòng khám.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-border-default bg-white space-y-3 shadow-2xs">
            <Heart className="w-7 h-7 text-brand-700" />
            <h3 className="text-base font-semibold text-slate-900">Tính nhân bản</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Đặt người bệnh làm trung tâm, giao tiếp điềm tĩnh, ấm áp và luôn sẵn lòng giải đáp mọi băn khoăn y khoa.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border-default bg-white space-y-3 shadow-2xs">
            <Clock className="w-7 h-7 text-brand-700" />
            <h3 className="text-base font-semibold text-slate-900">Tôn trọng thời gian</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hệ thống quản lý lịch hẹn chặt chẽ, buffer time khoa học giữa các lượt khám giúp loại bỏ tình trạng chờ đợi mệt mỏi.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border-default bg-white space-y-3 shadow-2xs">
            <Award className="w-7 h-7 text-brand-700" />
            <h3 className="text-base font-semibold text-slate-900">Chuẩn mực chuyên môn</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Chỉ định cận lâm sàng dựa trên chứng cứ khoa học, không lạm dụng xét nghiệm hay thuốc men không cần thiết.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="p-8 sm:p-10 rounded-2xl bg-surface-subtle border border-border-default flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Bạn có câu hỏi hoặc cần tư vấn dịch vụ phù hợp?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Đội ngũ lễ tân Wellora luôn sẵn lòng hỗ trợ bạn qua hotline <strong>{CLINIC_CONFIG.hotline}</strong>.
          </p>
        </div>
        <Link
          href="/dat-lich"
          className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-medium px-5 py-3 rounded-lg text-sm transition-colors whitespace-nowrap shadow-xs"
        >
          <Calendar className="w-4 h-4" />
          Đặt lịch khám
        </Link>
      </div>
    </div>
  );
}
