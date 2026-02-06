'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';

const SIDEBAR_COLLAPSED_KEY = 'devden-sidebar-collapsed';

interface NavigationContextType {
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

interface NavigationProviderProps {
  children: ReactNode;
  currentToolId?: string;
}

export function NavigationProvider({ children, currentToolId = 'url-encode' }: NavigationProviderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (saved !== null) {
      setIsSidebarCollapsed(saved === 'true');
    }
    setIsHydrated(true);
  }, []);

  // Save collapsed state to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isSidebarCollapsed));
    }
  }, [isSidebarCollapsed, isHydrated]);

  const openMobileMenu = useCallback(() => setIsMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    []
  );
  const toggleSidebarCollapsed = useCallback(
    () => setIsSidebarCollapsed((prev) => !prev),
    []
  );

  return (
    <NavigationContext.Provider
      value={{
        isMobileMenuOpen,
        openMobileMenu,
        closeMobileMenu,
        toggleMobileMenu,
        isSidebarCollapsed,
        toggleSidebarCollapsed,
      }}
    >
      <div className="flex min-h-screen">
        {/* Desktop Sidebar - hidden on mobile */}
        <Sidebar className="hidden lg:block" isCollapsed={isSidebarCollapsed} onToggleCollapse={toggleSidebarCollapsed} currentToolId={currentToolId} />

        {/* Mobile Sidebar - slide-in overlay */}
        <MobileSidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} currentToolId={currentToolId} />

        {/* Main content area */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </NavigationContext.Provider>
  );
}
