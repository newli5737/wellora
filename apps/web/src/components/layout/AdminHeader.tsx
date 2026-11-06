'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut, User, Calendar, Shield } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('wellora_admin_email');
      const role = localStorage.getItem('wellora_admin_role');
      setUserEmail(email);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wellora_admin_token');
      localStorage.removeItem('wellora_admin_email');
      localStorage.removeItem('wellora_admin_role');
    }
    router.push('/admin/dang-nhap');
  };

  return (
    <header className="bg-brand-950 text-white border-b border-brand-900 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/admin/lich-hen" className="flex items-center gap-3">
              <div className="relative h-9 w-32">
                <Image
                  src="/images/brand/wellora-logo.png"
                  alt="Wellora"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <span className="text-xs bg-brand-900 text-brand-300 px-2 py-0.5 rounded border border-brand-800 font-semibold tracking-wider uppercase">
                Quản trị nội bộ
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-300">
              <Link
                href="/admin/lich-hen"
                className="hover:text-white flex items-center gap-1.5 px-2 py-1 rounded hover:bg-brand-900/60 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-brand-400" />
                Lịch hẹn khám
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {userEmail && (
              <div className="hidden sm:flex items-center gap-2 text-slate-300">
                <User className="w-3.5 h-3.5 text-brand-400" />
                <span>{userEmail}</span>
                <span className="bg-brand-900 text-brand-300 px-1.5 py-0.5 rounded text-[10px]">
                  {userRole}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white bg-brand-900 hover:bg-brand-800 px-3 py-1.5 rounded transition-colors"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
