import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDownIcon } from '@/components/common/icons';

interface NavDropdownProps {
  label: string;
  children: ReactNode;
  /** Highlight the trigger when one of its routes is active. */
  active?: boolean;
}

/**
 * Desktop-only dropdown used for the "Teams" and "More" menus.
 * Closes on outside click, on Escape, and whenever the route changes.
 */
export function NavDropdown({ label, children, active }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-1 px-3 py-2 text-[13px] font-bold uppercase tracking-wide transition-colors ${
          active || open ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {label}
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 min-w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
        >
          {children}
        </div>
      )}
    </div>
  );
}
