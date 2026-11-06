import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ShieldCheck, Stethoscope, User } from 'lucide-react';
import { api, PractitionerItem } from '@/lib/api/client';

export const metadata = {
  title: 'Đội ngũ chuyên môn — Wellora Healthcare',
  description: 'Đội ngũ bác sĩ và chuyên viên y tế tại Wellora Healthcare.',
};

async function getPractitioners(): Promise<PractitionerItem[]> {
  try {
    return await api.getPractitioners();
  } catch {
    return [];
  }
}

export default async function TeamPage() {
  const practitioners = await getPractitioners();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header with Ambient Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-brand-950 text-white p-8 sm:p-12 border border-brand-900 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-300 bg-brand-900/80 px-2.5 py-1 rounded">
            <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn mực y đức & Chuyên môn
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Đội ngũ bác sĩ & Chuyên viên y tế
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Đội ngũ chuyên gia tại Wellora được đào tạo chuẩn mực, giàu kinh nghiệm thực tiễn và luôn tận tụy đồng hành cùng sức khỏe của bạn và gia đình.
          </p>
        </div>
      </div>

      {/* Doctors Grid loaded directly from Database via API */}
      {practitioners.length === 0 ? (
        <div className="p-12 text-center border border-border-default rounded-2xl bg-white text-slate-500">
          <User className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <p className="text-base font-medium text-slate-700">Đang cập nhật danh sách bác sĩ chuyên môn</p>
          <p className="text-xs text-slate-500 mt-1">Vui lòng quay lại sau hoặc liên hệ tổng đài để được tư vấn trực tiếp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {practitioners.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-border-default rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row"
            >
              <div className="relative sm:w-56 aspect-[4/5] sm:aspect-auto bg-slate-100 flex-shrink-0">
                {doc.photoUrl ? (
                  <Image
                    src={doc.photoUrl}
                    alt={doc.displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                    <User className="w-16 h-16" />
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-brand-700 font-semibold uppercase tracking-wider">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Bác sĩ chuyên khoa</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {doc.displayName}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    {doc.bio || 'Chuyên gia y tế tận tâm tại Wellora Healthcare.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={`/dat-lich?practitionerId=${doc.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-medium py-2.5 px-4 rounded-lg text-xs transition-colors shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Đặt lịch với {doc.displayName}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
