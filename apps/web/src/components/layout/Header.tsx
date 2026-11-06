'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar, Phone } from 'lucide-react';
import { CLINIC_CONFIG } from '@/lib/config/clinic';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/dich-vu', label: 'Dịch vụ' },
    { href: '/doi-ngu', label: 'Đội ngũ chuyên môn' },
    { href: '/gioi-thieu', label: 'Giới thiệu' },
    { href: '/lien-he', label: 'Liên hệ' },
  ];

  return (
    <header className="bg-brand-950 text-white border-b border-brand-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded p-1"
            aria-label="Wellora Healthcare - Về trang chủ"
          >
            <div className="relative h-12 w-44 sm:w-52">
              <Image
                src="/images/brand/wellora-logo.png"
                alt="Wellora Healthcare"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                    isActive
                      ? 'text-brand-300 bg-brand-900/60'
                      : 'text-slate-300 hover:text-white hover:bg-brand-900/40'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/dat-lich/xac-nhan"
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 transition-colors"
            >
              Tra cứu lịch
            </Link>
            <Link
              href="/dat-lich"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold px-4 py-2.5 rounded transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <Calendar className="w-4 h-4" />
              Đặt lịch hẹn
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/dat-lich"
              className="bg-brand-600 text-white text-xs font-semibold px-3 py-2 rounded inline-flex items-center gap-1"
            >
              Đặt lịch
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded text-slate-300 hover:text-white hover:bg-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              aria-expanded={isOpen}
              aria-label="Mở menu điều hướng"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden bg-brand-950 border-t border-brand-900 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded text-base font-medium ${
                  isActive
                    ? 'text-brand-300 bg-brand-900'
                    : 'text-slate-300 hover:text-white hover:bg-brand-900/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-brand-900 flex flex-col gap-3">
            <Link
              href="/dat-lich/xac-nhan"
              className="text-sm text-slate-400 hover:text-slate-200 px-3 py-1"
            >
              Tra cứu trạng thái lịch hẹn
            </Link>
            <div className="text-xs text-slate-400 px-3 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              Hotline: <span className="text-white font-medium">{CLINIC_CONFIG.hotline}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

