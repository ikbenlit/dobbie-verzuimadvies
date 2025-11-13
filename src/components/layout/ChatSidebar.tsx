'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  MessageSquarePlus,
  FileText,
  Scale,
  Mail,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  account_type?: 'individual' | 'organization_member';
  organization_id?: string;
  subscription_status?: 'inactive' | 'active' | 'expired' | 'blocked';
  role: string;
}

interface ChatSidebarProps {
  user?: User;
}

export function ChatSidebar({ user: currentUser }: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks: NavLink[] = [
    {
      label: 'Nieuwe Chat',
      href: '/chat',
      icon: <MessageSquarePlus className="h-5 w-5" />,
    },
    {
      label: 'Verzuimbeleid',
      href: '/beleid',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: 'Wet Poortwachter',
      href: '/wetgeving',
      icon: <Scale className="h-5 w-5" />,
    },
    {
      label: 'Contact',
      href: '/contact',
      icon: <Mail className="h-5 w-5" />,
    },
  ];

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      // Use window.location for full page reload to clear all state
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      // Redirect anyway to ensure user is logged out
      window.location.href = '/login';
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex h-full bg-white border-r border-[#D1D5DB] flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-12 flex items-center justify-center mb-6 mt-4">
          <div
            className={`logo bg-[#771138] rounded-full flex items-center justify-center font-bold text-white text-lg shadow-md transition-all duration-300 ${
              isOpen ? 'w-full max-w-[200px] h-10 mx-auto' : 'w-10 h-10'
            }`}
          >
            DOBbie
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4">
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 p-3 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#771138] text-white'
                      : 'text-[#3D3D3D] hover:bg-[#F5F2EB]'
                  } ${link.href === '/chat' ? 'bg-[#E9B046] text-black hover:bg-[#771138] hover:text-white' : ''}`}
                >
                  {link.icon}
                  {isOpen && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {link.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Toggle Button */}
        <div className="py-2 border-t border-[#D1D5DB] px-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-[#3D3D3D] hover:bg-[#F5F2EB] transition-colors"
            aria-label={isOpen ? 'Sidebar inklappen' : 'Sidebar uitklappen'}
          >
            {isOpen ? (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-2 text-sm">Inklappen</span>
              </>
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* User Menu */}
        {currentUser && (
          <div className="pt-2 border-t border-[#D1D5DB] px-4 pb-4">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center p-2 rounded-lg hover:bg-[#F5F2EB] transition-colors w-full ${
                  !isOpen ? 'justify-center' : 'space-x-3'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#771138] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {currentUser.full_name?.[0] || currentUser.email[0].toUpperCase()}
                </div>
                {isOpen && (
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="font-medium truncate text-sm">
                      {currentUser.full_name || currentUser.email}
                    </div>
                    {currentUser.full_name && (
                      <div className="text-xs text-[#707070] truncate">
                        {currentUser.email}
                      </div>
                    )}
                  </div>
                )}
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && isOpen && (
                <div className="absolute bottom-full mb-2 w-full bg-white rounded-lg shadow-lg border border-[#D1D5DB] overflow-hidden">
                  <div className="p-3 border-b border-[#D1D5DB]">
                    <div className="font-medium text-sm">
                      {currentUser.full_name || currentUser.email}
                    </div>
                    {currentUser.full_name && (
                      <div className="text-xs text-[#707070]">
                        {currentUser.email}
                      </div>
                    )}
                  </div>
                  <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-[#F5F2EB]">
                      <Settings className="h-4 w-4 mr-3 text-[#707070]" />
                      Instellingen
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-[#F5F2EB]"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Uitloggen
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white p-4 z-40 flex flex-col md:hidden">
            {/* Mobile menu content - same as desktop but always open */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-[#3D3D3D] hover:text-[#771138]"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="flex-1 overflow-y-auto mt-12">
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-md text-[#3D3D3D] hover:bg-[#F5F2EB] transition-colors"
                  >
                    {link.icon}
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {currentUser && (
              <div className="mt-auto pt-4 border-t border-[#D1D5DB]">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#771138] flex items-center justify-center text-white font-semibold">
                    {currentUser.full_name?.[0] || currentUser.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-medium text-sm truncate">
                      {currentUser.full_name || currentUser.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-[#F5F2EB] rounded-md"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Uitloggen
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
