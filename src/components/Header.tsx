// src/components/Header.tsx - NO DARKMODE
import React, { useEffect, useRef, useState } from 'react';
import { 
  Building2, 
  Users, 
  MapPin, 
  FileText, 
  ShieldAlert, 
  Megaphone, 
  Award,
  Home,
  Menu,
  X,
  Activity,
} from 'lucide-react';
import { BarangayInfo } from '../types';
import { RoleSwitcher } from './UserRoles';
import { Notifications } from './Notifications';

interface Props {
  info: BarangayInfo;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  residentCount: number;
  householdCount: number;
  onOpenGuide?: () => void;
  onOpenActivityLog?: () => void;
}

export const Header: React.FC<Props> = ({
  info,
  activeTab,
  setActiveTab,
  residentCount,
  householdCount,
  onOpenActivityLog
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const newsItems = [
    "📍 Barangay SF II • Nestor Nabaunag, Limay, Bataan",
    "📞 " + info.contact_number,
    "🏛️ Barangay Captain: " + info.barangay_captain,
    "📋 Barangay Information Management System",
    "🏥 Free Medical Mission every 1st Saturday of the month",
    "📢 Barangay Assembly every 2nd Friday",
    "⚠️ For emergencies: Call 911 or Barangay Hotline",
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'puroks', label: 'Puroks', icon: MapPin, badge: null },
    { id: 'residents', label: 'Residents', icon: Users, badge: residentCount },
    { id: 'households', label: 'Households', icon: Building2, badge: householdCount },
    { id: 'officials', label: 'Officials', icon: Award, badge: null },
    { id: 'certificates', label: 'Certificates', icon: FileText, badge: null },
    { id: 'blotter', label: 'Blotter', icon: ShieldAlert, badge: null },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, badge: null },
  ];

  const navColors = {
    'dashboard': { bg: 'bg-blue-500', hover: 'hover:bg-blue-50', hoverText: 'hover:text-blue-500', text: 'text-blue-500', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-500' },
    'puroks': { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-50', hoverText: 'hover:text-emerald-500', text: 'text-emerald-500', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-500' },
    'residents': { bg: 'bg-purple-500', hover: 'hover:bg-purple-50', hoverText: 'hover:text-purple-500', text: 'text-purple-500', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-500' },
    'households': { bg: 'bg-orange-500', hover: 'hover:bg-orange-50', hoverText: 'hover:text-orange-500', text: 'text-orange-500', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-500' },
    'officials': { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-50', hoverText: 'hover:text-indigo-500', text: 'text-indigo-500', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-500' },
    'certificates': { bg: 'bg-pink-500', hover: 'hover:bg-pink-50', hoverText: 'hover:text-pink-500', text: 'text-pink-500', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-500' },
    'blotter': { bg: 'bg-red-500', hover: 'hover:bg-red-50', hoverText: 'hover:text-red-500', text: 'text-red-500', border: 'border-red-200', badge: 'bg-red-100 text-red-500' },
    'announcements': { bg: 'bg-cyan-500', hover: 'hover:bg-cyan-50', hoverText: 'hover:text-cyan-500', text: 'text-cyan-500', border: 'border-cyan-200', badge: 'bg-cyan-100 text-cyan-500' },
  };

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let animationId: number;
    let startTime: number | null = null;
    const duration = 25000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;
      
      const contentWidth = marquee.scrollWidth / 2;
      const scrollAmount = (progress * contentWidth) % (contentWidth + window.innerWidth);
      marquee.style.transform = `translateX(-${scrollAmount}px)`;
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <header className="text-black sticky top-0 z-20">
      {/* News Ticker */}
      <div className="bg-black text-[12px] py-1.5 overflow-hidden">
        <div className="relative overflow-hidden">
          <div
            ref={marqueeRef}
            className="whitespace-nowrap inline-block"
            style={{ willChange: 'transform' }}
          >
            {newsItems.map((item, index) => (
              <span key={index} className="mx-8 text-gray-300">
                {item}
              </span>
            ))}
            {newsItems.map((item, index) => (
              <span key={`dup-${index}`} className="mx-8 text-gray-300">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-3">
        <div className="w-[90%] mx-auto bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/30 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* LOGO */}
              <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-md flex-shrink-0">
                <img 
                  src="/barangay-logo.png" 
                  alt="Barangay SF II Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-xl font-black text-black tracking-tight">
                    {info.barangay_name}
                  </h1>
                  <span className="bg-gray-100 text-black border border-black/20 text-[9px] px-2 py-0.5 rounded-full font-semibold">
                    LIMAY, BATAAN
                  </span>
                </div>
                <p className="text-[11px] md:text-xs text-black font-bold flex items-center gap-2 mt-0.5">
                  <span>Barangay Information Management System</span>
                  <span className="text-gray-400">•</span>
                  <span>Captain: {info.barangay_captain}</span>
                </p>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-1">
              {/* Activity Log */}
              <button
                onClick={onOpenActivityLog}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Activity Log"
                title="View activity log of all actions"
              >
                <Activity className="w-5 h-5 text-gray-700" />
              </button>

              {/* Notifications */}
              <Notifications />

              {/* Role Switcher */}
              <RoleSwitcher />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-200 lg:hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:block mt-3">
            <div 
              className="flex items-center justify-center gap-7 overflow-x-auto py-1.5 px-2"
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
              }}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const colors = navColors[item.id as keyof typeof navColors];
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                      isActive
                        ? `${colors.bg} text-white shadow-md border ${colors.border}`
                        : `text-gray-700 ${colors.hover} ${colors.hoverText}`
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${
                      isActive ? 'text-white' : colors.text
                    }`} />
                    <span>{item.label}</span>
                    {item.badge !== null && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : colors.badge
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-2 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-3 space-y-1 shadow-xl">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const colors = navColors[item.id as keyof typeof navColors];
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? `${colors.bg} text-white`
                        : `text-gray-700 ${colors.hover}`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${
                        isActive 
                          ? 'text-white' 
                          : colors.text
                      }`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : colors.badge
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};