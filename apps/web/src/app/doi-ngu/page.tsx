import React from 'react';
import Link from 'next/link';
import { UserCheck, Calendar, ShieldCheck } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-border-default pb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> Chuyên môn y khoa
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Đội ngũ chuyên môn
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
          Đội ngũ bác sĩ và nhân sự y tế tại Wellora được đào tạo chuẩn mực, luôn tận tâm đồng hành
          và theo dõi sát sao sức khỏe của bạn và gia đình.
        </p>
      </div>

      {practitioners.length === 0 ? (
        <div className="p-8 text-center bg-white border border-border-default rounded text-slate-500 text-sm">
          Thông tin đội ngũ chuyên môn đang được hoàn thiện hồ sơ công bố.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practitioners.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-border-default rounded p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-semibold text-xl">
                  <UserCheck className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {doc.displayName}
                  </h2>
                  <p className="text-xs text-brand-700 font-medium mt-0.5">
                    Bác sĩ chuyên khoa y học gia đình
                  </p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {doc.bio || 'Chuyên viên y tế tận tâm tại Wellora Healthcare.'}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border-default">
                <Link
                  href={`/dat-lich?practitionerId=${doc.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-medium py-2 px-3 rounded text-xs transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Đặt lịch với bác sĩ
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
