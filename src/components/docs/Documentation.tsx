import React from 'react';
import { motion } from 'framer-motion';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'python', title }) => {
  return (
    <div className="rounded-xl border border-hairline bg-base overflow-hidden">
      {title && (
        <div className="px-4 py-2.5 border-b border-hairline bg-elevated/40 flex items-center justify-between">
          <span className="text-xs font-semibold text-text-primary">{title}</span>
          <span className="text-[10px] font-mono text-text-secondary px-2 py-0.5 rounded bg-elevated border border-hairline">
            {language}
          </span>
        </div>
      )}
      <div className="overflow-x-auto">
        <pre className="p-4 text-xs font-mono leading-relaxed text-text-primary">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export const TryItSection: React.FC<{
  description: string;
  code: string;
  language?: string;
}> = ({ description, code, language = 'python' }) => {
  return (
    <div className="rounded-xl border border-accent/20 bg-accent-subtle/30 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-accent/20 bg-accent/5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="text-xs font-semibold text-accent">Try It Yourself</span>
      </div>
      <div className="p-4">
        <p className="text-xs text-text-secondary mb-3 leading-relaxed">{description}</p>
        <div className="rounded-lg border border-hairline bg-base overflow-hidden">
          <div className="px-3 py-1.5 bg-elevated/60 border-b border-hairline flex items-center justify-between">
            <span className="text-[10px] font-mono text-text-secondary uppercase">{language}</span>
            <span className="text-[10px] font-mono text-text-secondary/50">editor</span>
          </div>
          <pre className="p-3 text-xs font-mono text-text-primary overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

interface DocHeadingProps {
  level: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const DocHeading: React.FC<DocHeadingProps> = ({ level, children, id, className = '' }) => {
  const sizes = { 1: 'text-2xl', 2: 'text-xl', 3: 'text-base', 4: 'text-sm' };
  const margs = { 1: 'mt-8 mb-3', 2: 'mt-6 mb-2', 3: 'mt-4 mb-2', 4: 'mt-3 mb-1.5' };
  return (
    <motion.h2
      id={id}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={`font-display font-bold text-text-primary ${sizes[level]} ${margs[level]} ${className}`}
    >
      {children}
    </motion.h2>
  );
};

export const DocParagraph: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-sm text-text-secondary leading-relaxed mb-3 ${className}`}>
    {children}
  </p>
);

export const DocList: React.FC<{ items: string[]; type?: 'ul' | 'ol'; className?: string }> = ({ items, type = 'ul', className = '' }) => {
  const ListTag = type === 'ul' ? 'ul' : 'ol';
  return (
    <ListTag className={`space-y-1.5 mb-3 ${type === 'ol' ? 'list-decimal list-inside' : 'list-disc list-inside'} ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="text-sm text-text-secondary leading-relaxed">{item}</li>
      ))}
    </ListTag>
  );
};

export const DocNote: React.FC<{ type: 'info' | 'warning' | 'tip' | 'danger'; title: string; children: React.ReactNode }> = ({ type, title, children }) => {
  const colors = {
    info: { bg: 'bg-info/5', border: 'border-info/20', text: 'text-info', icon: 'ℹ' },
    warning: { bg: 'bg-warning/5', border: 'border-warning/20', text: 'text-warning', icon: '⚠' },
    tip: { bg: 'bg-success/5', border: 'border-success/20', text: 'text-success', icon: '💡' },
    danger: { bg: 'bg-danger/5', border: 'border-danger/20', text: 'text-danger', icon: '✕' },
  };
  const c = colors[type];
  return (
    <div className={`rounded-lg border ${c.border} ${c.bg} p-3 mb-3`}>
      <div className={`text-xs font-semibold ${c.text} mb-1 flex items-center gap-1.5`}>
        <span>{c.icon}</span>
        <span>{title}</span>
      </div>
      <div className="text-xs text-text-secondary leading-relaxed">{children}</div>
    </div>
  );
};
