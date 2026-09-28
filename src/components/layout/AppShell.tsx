import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavigation } from './TopNavigation';
import { MobileNav } from './MobileNav';

export interface AppShellProps {
  children?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isFullBleed = location.pathname.startsWith('/messages');

  return (
    <div className="min-h-screen h-screen w-full bg-[var(--bg-base)] text-[var(--text-main)] flex flex-col md:flex-row selection:bg-indigo-500/25 selection:text-white overflow-hidden">
      {/* 230px Fixed Minimal Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Viewport Content Area (Expands to 100% remaining width) */}
      <div className="flex-1 flex flex-col min-w-0 w-full h-full overflow-hidden">
        {/* Clean 64px Top Navigation */}
        <TopNavigation onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Dynamic Page Container */}
        {isFullBleed ? (
          <main className="flex-1 w-full h-[calc(100vh-68px)] overflow-hidden p-0 sm:p-4 md:p-6 flex flex-col">
            {children}
          </main>
        ) : (
          <main className="flex-1 w-full overflow-y-auto">
            <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-8 sm:py-10 md:py-12 pb-24 md:pb-16">
              {children}
            </div>
          </main>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
};
