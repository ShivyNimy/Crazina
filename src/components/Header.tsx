import {
  BookOpen,
  Code2,
  Compass,
  Flame,
  GraduationCap,
  Moon,
  Sun,
  Terminal,
  Trophy,
} from 'lucide-react';
import type { ViewRoute } from '../types';
import type { RankInfo } from '../store/progress';

interface HeaderProps {
  route: ViewRoute;
  onNavigate: (route: ViewRoute) => void;
  totalXp: number;
  rank: RankInfo;
  streakDays: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  completedCount: number;
  totalLessons: number;
}

export function Header({
  route,
  onNavigate,
  totalXp,
  rank,
  streakDays,
  theme,
  onToggleTheme,
  completedCount,
  totalLessons,
}: HeaderProps) {
  const navItems: { id: ViewRoute; label: string; icon: typeof Compass }[] = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'practice', label: 'Practice Arena', icon: Trophy },
    { id: 'playground', label: 'Playground', icon: Terminal },
    { id: 'guide', label: 'Pro Guide', icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <Code2 className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight text-[var(--ink-primary)]">
              Crazina
            </span>
            <span className="hidden text-[11px] font-medium text-[var(--ink-muted)] sm:block">
              Zero to Pro Coding Academy
            </span>
          </div>
        </button>

        {/* Primary Nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              route === item.id || (route === 'lesson' && item.id === 'curriculum');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300'
                    : 'text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-primary)]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Stats & Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="hidden items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 lg:flex"
            title="Daily coding streak"
          >
            <Flame className="h-3.5 w-3.5 fill-current" />
            <span>{streakDays}d</span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('guide')}
            className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-1.5 text-xs font-semibold transition-colors hover:border-emerald-500/50"
            title={`${completedCount}/${totalLessons} lessons completed`}
          >
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-[var(--ink-primary)]">{totalXp} XP</span>
            <span className="hidden text-[var(--ink-muted)] sm:inline">· {rank.title}</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-primary)]"
            aria-label="Toggle color theme"
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Strip */}
      <div className="flex items-center justify-around border-t border-[var(--border-subtle)] px-2 py-1.5 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            route === item.id || (route === 'lesson' && item.id === 'curriculum');
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[11px] font-semibold ${
                active
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-[var(--ink-muted)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
