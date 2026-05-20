'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, LayoutDashboard, PieChart, Landmark } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const nav = [
    ['/', '🏠 Самбар', LayoutDashboard],
    ['/analytics', '📊 Аналитик', PieChart],
    ['/loans', '🏦 Зээл', Landmark],
  ];

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-200 bg-white/80 p-5 backdrop-blur lg:block dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mb-8 text-2xl font-black">💰 FinanceOS</div>
        <nav className="space-y-2">
          {nav.map(([href, label, Icon]: any) => (
            <Link
              key={href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-900"
              href={href}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-slate-50/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
          <b>👨‍👩‍👧‍👦 Гэр бүл + ☕ Кафе санхүү</b>
          <button
            onClick={() => setDark(!dark)}
            className="btn bg-slate-900 text-white dark:bg-white dark:text-slate-950"
          >
            {dark ? <Sun /> : <Moon />}
          </button>
        </header>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8">
          {children}
        </motion.div>
      </main>
    </div>
  );
}
