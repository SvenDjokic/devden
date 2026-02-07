'use client';

import {
  getToolsByCategory,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  isToolAvailable,
  type Tool,
  type ToolCategory,
} from '@/lib/toolRegistry';

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  currentToolId?: string;
}

function ToolLink({
  tool,
  isActive,
  isCollapsed,
}: {
  tool: Tool;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  const available = isToolAvailable(tool.id);

  // Collapsed: icon only with tooltip
  if (isCollapsed) {
    const iconContent = (
      <span
        className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
          isActive
            ? 'bg-primary-500/10 text-primary-400'
            : available
            ? 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            : 'text-muted-foreground/40 cursor-not-allowed'
        }`}
        title={tool.name + (available ? '' : ' (Soon)')}
      >
        <span className="text-xs">{tool.icon}</span>
      </span>
    );

    if (!available) {
      return iconContent;
    }

    return <a href={tool.href}>{iconContent}</a>;
  }

  // Expanded: compact content
  if (!available) {
    return (
      <span
        className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground/40 cursor-not-allowed"
        title="Coming soon"
      >
        <span className="w-5 text-center text-[10px]">{tool.icon}</span>
        <span>{tool.name}</span>
        <span className="ml-auto text-[9px]">Soon</span>
      </span>
    );
  }

  return (
    <a
      href={tool.href}
      className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors ${
        isActive
          ? 'bg-primary-500/10 text-primary-400'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
    >
      <span className="w-5 text-center text-[10px] opacity-60">{tool.icon}</span>
      <span>{tool.name}</span>
      {tool.tier === 'pro' && (
        <span className="ml-auto text-[9px] text-primary-400">PRO</span>
      )}
    </a>
  );
}

function CategorySection({
  category,
  categoryTools,
  currentToolId,
  isCollapsed,
}: {
  category: ToolCategory;
  categoryTools: Tool[];
  currentToolId: string;
  isCollapsed: boolean;
}) {
  return (
    <div className={isCollapsed ? 'mb-1' : 'mb-3'}>
      {!isCollapsed && (
        <h3 className="px-2 mb-0.5 text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">
          {CATEGORY_LABELS[category]}
        </h3>
      )}
      <ul className={isCollapsed ? 'flex flex-col items-center gap-0.5' : ''}>
        {categoryTools.map((tool) => (
          <li key={tool.id}>
            <ToolLink
              tool={tool}
              isActive={tool.id === currentToolId}
              isCollapsed={isCollapsed}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sidebar({
  className = '',
  isCollapsed = false,
  onToggleCollapse,
  currentToolId = 'json-formatter',
}: SidebarProps) {
  const toolsByCategory = getToolsByCategory();

  return (
    <aside
      className={`shrink-0 border-r border-border bg-card/30 transition-all duration-200 ${
        isCollapsed ? 'w-14' : 'w-40'
      } ${className}`}
    >
      <div className="sticky top-0 h-screen overflow-y-auto py-3 flex flex-col">
        {/* Logo / Brand */}
        <div className={`mb-4 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          <a
            href="https://devden.dev"
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-1.5'}`}
          >
            <div className="w-6 h-6 rounded bg-primary-500 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-[10px]">{'{ }'}</span>
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-xs text-foreground">
                DevDen
              </span>
            )}
          </a>
        </div>

        {/* Tool Categories */}
        <nav className={isCollapsed ? 'px-1.5' : 'px-1'}>
          {CATEGORY_ORDER.map((category) => {
            const categoryTools = toolsByCategory.get(category);
            if (!categoryTools || categoryTools.length === 0) return null;

            return (
              <CategorySection
                key={category}
                category={category}
                categoryTools={categoryTools}
                currentToolId={currentToolId}
                isCollapsed={isCollapsed}
              />
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Collapse Toggle */}
        <div className="border-t border-border bg-card/50 p-1.5">
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isCollapsed ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
