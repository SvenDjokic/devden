'use client';

import { useEffect, useRef } from 'react';
import {
  getToolsByCategory,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  isToolAvailable,
  type Tool,
  type ToolCategory,
} from '@/lib/toolRegistry';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentToolId?: string;
}

function ToolLink({
  tool,
  isActive,
  onClose,
}: {
  tool: Tool;
  isActive: boolean;
  onClose: () => void;
}) {
  const available = isToolAvailable(tool.id);

  const content = (
    <span className="flex items-center gap-2.5">
      <span className="w-6 text-center text-sm">{tool.icon}</span>
      <span>{tool.name}</span>
      {tool.tier === 'pro' && (
        <span className="ml-auto text-[10px] text-primary-400">PRO</span>
      )}
      {!available && (
        <span className="ml-auto text-[10px] text-muted-foreground">Soon</span>
      )}
    </span>
  );

  if (!available) {
    return (
      <span
        className="block px-4 py-2.5 text-sm text-muted-foreground/40 cursor-not-allowed"
        title="Coming soon"
      >
        {content}
      </span>
    );
  }

  return (
    <a
      href={tool.href}
      onClick={onClose}
      className={`block px-4 py-2.5 text-sm transition-colors ${
        isActive
          ? 'bg-primary-500/10 text-primary-400 border-l-2 border-primary-500'
          : 'text-foreground hover:bg-muted/50'
      }`}
    >
      {content}
    </a>
  );
}

function CategorySection({
  category,
  categoryTools,
  currentToolId,
  onClose,
}: {
  category: ToolCategory;
  categoryTools: Tool[];
  currentToolId: string;
  onClose: () => void;
}) {
  return (
    <div className="mb-2">
      <h3 className="px-4 py-1.5 text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">
        {CATEGORY_LABELS[category]}
      </h3>
      <ul>
        {categoryTools.map((tool) => (
          <li key={tool.id}>
            <ToolLink
              tool={tool}
              isActive={tool.id === currentToolId}
              onClose={onClose}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MobileSidebar({ isOpen, onClose, currentToolId = 'url-encode' }: MobileSidebarProps) {
  const toolsByCategory = getToolsByCategory();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap - focus the sidebar when it opens
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        tabIndex={-1}
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-xl transform transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigation menu"
        aria-hidden={!isOpen}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-border">
            <a href="https://devden.dev" className="flex items-center gap-2" onClick={onClose}>
              <div className="w-6 h-6 rounded bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">{'{ }'}</span>
              </div>
              <span className="font-semibold text-sm text-foreground">
                DevDen
              </span>
            </a>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close navigation menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tool Categories */}
          <nav className="flex-1 py-4">
            {CATEGORY_ORDER.map((category) => {
              const categoryTools = toolsByCategory.get(category);
              if (!categoryTools || categoryTools.length === 0) return null;

              return (
                <CategorySection
                  key={category}
                  category={category}
                  categoryTools={categoryTools}
                  currentToolId={currentToolId}
                  onClose={onClose}
                />
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground/40 text-center">
              100% client-side. Your data never leaves.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
