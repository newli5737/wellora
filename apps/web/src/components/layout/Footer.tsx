import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { CLINIC_CONFIG } from '@/lib/config/clinic';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-950 text-slate-300 border-t border-brand-900 mt-20">
      {/* Notice bar */}
      <div className="bg-brand-900/50 border-b border-brand-900/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-400 flex items-center justify-center gap-2 text-center">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{CLINIC_CONFIG.emergencyNotice}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="relative h-12 w-44">
              <Image
                src="/images/brand/wellora-logo.png"
                alt="Wellora Healthcare"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {CLINIC_CONFIG.tagline}
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-2">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Chăm sóc sức khỏe y học gia đình & phòng ngừa</span>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>{CLINIC_CONFIG.locations[0].address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>Hotline: <strong className="text-white">{CLINIC_CONFIG.hotline}</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>{CLINIC_CONFIG.email}</span>
              </li>
            </ul>
          </div>

          {/* Working hours */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Giờ khám & Làm việc
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white">{CLINIC_CONFIG.locations[0].workingHours}</div>
                  <div className="text-xs text-slate-400 mt-1">{CLINIC_CONFIG.locations[0].sunday}</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick links & Policies */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Chính sách & Quy định
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/chinh-sach-quyen-rieng-tu"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Chính sách quyền riêng tư
                </Link>
              </li>
              <li>
                <Link
                  href="/dieu-khoan"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Điều khoản dịch vụ & Đặt lịch
                </Link>
              </li>
              <li>
                <Link
                  href="/dat-lich/xac-nhan"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Tra cứu trạng thái lịch hẹn
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/dang-nhap"
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cổng nhân viên & Quản trị
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-brand-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Wellora Healthcare. Bản quyền thuộc về Wellora.
          </div>
          <div className="text-slate-400">
            Hệ thống đặt lịch khám bệnh trực tuyến chuẩn mực & bảo mật.
          </div>
        </div>
      </div>
    </footer>
  );
};

