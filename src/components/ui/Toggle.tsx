import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, size = 'md', className = '' }) => {
  const sizeMap = {
    sm: { w: 32, h: 18, dot: 12 },
    md: { w: 44, h: 24, dot: 18 },
    lg: { w: 56, h: 30, dot: 24 },
  };
  const s = sizeMap[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative rounded-full transition-colors duration-standard focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        style={{ width: s.w, height: s.h, backgroundColor: checked ? 'var(--accent)' : 'var(--bg-elevated)' }}
      >
        <motion.div
          className="absolute top-0.5 rounded-full bg-white shadow-sm"
          style={{ width: s.dot, height: s.dot }}
          animate={{ left: checked ? s.w - s.dot - 2 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      {label && <span className="text-xs text-text-secondary">{label}</span>}
    </div>
  );
};

export const CollapsibleSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
}> = ({ title, children, defaultOpen = false, icon, badge, className = '' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-xl border border-hairline bg-surface overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-elevated/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-accent">{icon}</span>}
          <span className="text-sm font-semibold text-text-primary">{title}</span>
          {badge && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-text-secondary"
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
