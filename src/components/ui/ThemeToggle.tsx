'use client';

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { handleFocusTrapKeyDown } from '@/lib/focus-trap';
import { durations, easings, useGsapPresence } from '@/lib/motion';
import { gsap, useGSAP } from '@/lib/gsap';

export type ThemeProfile = 'daylight' | 'night' | 'contrast' | 'system';
export const THEME_STORAGE_KEY = 'focuslab:theme';

interface ThemeOption {
  id: ThemeProfile;
  label: string;
  icon: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  { id: 'system', label: 'System', icon: '◐' },
  { id: 'night', label: 'Night', icon: '☾' },
  { id: 'daylight', label: 'Daylight', icon: '☀' },
  { id: 'contrast', label: 'Contrast', icon: '◧' },
];

export function resolveSystemTheme(): 'night' | 'daylight' | 'contrast' {
  if (typeof window === 'undefined') return 'daylight';
  if (window.matchMedia('(forced-colors: active)').matches) return 'contrast';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'daylight';
}

export function updateThemeColorMeta(): void {
  if (typeof document === 'undefined') return;
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  if (bg) meta.setAttribute('content', bg);
}

export function applyTheme(mode: ThemeProfile): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const resolved = mode === 'system' ? resolveSystemTheme() : mode;
  root.setAttribute('data-theme', resolved);
  if (resolved === 'night') {
    root.classList.add('night', 'dark');
  } else {
    root.classList.remove('night', 'dark');
  }
  root.style.colorScheme = resolved === 'daylight' ? 'light' : 'dark';
  updateThemeColorMeta();
}

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<ThemeProfile>('system');
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { isRendered, onExitComplete } = useGsapPresence(menuOpen);

  useGSAP(
    () => {
      if (!isRendered || !menuRef.current) return;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (menuOpen) {
          gsap.fromTo(
            menuRef.current,
            { opacity: 0, scale: 0.96 },
            {
              opacity: 1,
              scale: 1,
              duration: durations.quick,
              ease: easings.out,
              overwrite: 'auto',
            }
          );
        } else {
          gsap.to(menuRef.current, {
            opacity: 0,
            scale: 0.96,
            duration: 0.14,
            ease: easings.out,
            overwrite: 'auto',
            onComplete: onExitComplete,
          });
        }
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (menuOpen) {
          gsap.fromTo(
            menuRef.current,
            { opacity: 0 },
            {
              opacity: 1,
              duration: durations.instant,
              ease: easings.out,
              overwrite: 'auto',
            }
          );
        } else {
          gsap.to(menuRef.current, {
            opacity: 0,
            duration: durations.instant,
            ease: easings.out,
            overwrite: 'auto',
            onComplete: onExitComplete,
          });
        }
      });
    },
    { scope: containerRef, dependencies: [menuOpen, isRendered] }
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeProfile | null;
      const effective = (saved === 'daylight' || saved === 'night' || saved === 'contrast' || saved === 'system') ? saved : 'system';
      setTheme(effective);
      applyTheme(effective);
    } catch {
      applyTheme('system');
    }
  }, []);

  useEffect(() => {
    if (theme !== 'system') return;
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const forcedQuery = window.matchMedia('(forced-colors: active)');
    const onChange = () => applyTheme('system');
    darkQuery.addEventListener('change', onChange);
    forcedQuery.addEventListener('change', onChange);
    return () => {
      darkQuery.removeEventListener('change', onChange);
      forcedQuery.removeEventListener('change', onChange);
    };
  }, [theme]);

  const handleSelect = (mode: ThemeProfile) => {
    setTheme(mode);
    try { localStorage.setItem(THEME_STORAGE_KEY, mode); } catch {}
    import('@/lib/theme-transition').then(({ runThemeTransition }) => {
      runThemeTransition(mode, triggerRef.current);
    });
    setMenuOpen(false);
    triggerRef.current?.focus();
  };

  const closeMenu = () => { setMenuOpen(false); triggerRef.current?.focus(); };

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen && menuRef.current) {
      const btn =
        menuRef.current.querySelector<HTMLButtonElement>(`button[data-theme-id="${theme}"]`) ||
        menuRef.current.querySelector<HTMLButtonElement>('button');
      btn?.focus();
    }
  }, [menuOpen, theme]);

  const currentOption = THEME_OPTIONS.find((opt) => opt.id === theme) || THEME_OPTIONS[0];

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !menuOpen) {
            e.preventDefault();
            setMenuOpen(true);
          }
        }}
        className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 text-sm font-semibold rounded-sm border border-border-strong bg-surface-2 text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring inline-flex items-center justify-center transition-colors select-none active:scale-[0.98] motion-reduce:active:scale-100"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label={`Theme: ${currentOption.label}. Select to change theme.`}
      >
        <span aria-hidden="true" className="font-mono text-base leading-none">
          {currentOption.icon}
        </span>
      </button>

      {isRendered && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Theme options"
          onKeyDown={(e) => handleFocusTrapKeyDown(e, menuRef.current, closeMenu)}
          className="absolute right-0 top-full mt-1.5 z-50 min-w-[150px] rounded-sm border border-border-strong bg-surface-2 shadow-elevation p-1 space-y-0.5 origin-top-right"
        >
          {THEME_OPTIONS.map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                data-theme-id={opt.id}
                role="menuitemradio"
                aria-checked={isSelected}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className={clsx(
                  'min-h-[44px] w-full px-3 py-2 text-sm font-semibold rounded-xs text-left flex items-center justify-between transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  isSelected
                    ? 'bg-surface text-text font-bold border border-border'
                    : 'text-muted hover:text-text hover:bg-surface'
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="font-mono text-sm">
                    {opt.icon}
                  </span>
                  <span>{opt.label}</span>
                </span>
                {isSelected && <span aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
