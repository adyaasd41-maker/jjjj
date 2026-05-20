'use client';
import { AppShell } from '@/components/AppShell';
import { useEffect, useState } from 'react';
import { toast } from '@/components/Toast';

export default function Loans() {
  const [loans, setLoans] = useState<any[]>([]);
  const [f, setF] = useState({
    name: 'Ипотекийн зээл',
    amount: '',
    interestRate: '',
    monthlyPayment: '',
    remainingBalance: '',
    dueDay: '1',
  });

  const load = () => {
    fetch('/api/loans')
      .then(r => r.json())
      .then(x => setLoans(Array.isArray(x) ? x : []));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: any) => {
    e.preventDefault();
    await fetch('/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: f.name,
        amount: +f.amount,
        interestRate: +f.interestRate,
        monthlyPayment: +f.monthlyPayment,
        remainingBalance: +f.remainingBalance,
        dueDay: +f.dueDay,
      }),
    });
    toast('Зээл нэмэгдлээ ✅');
    load();
  };

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={submit} className="card space-y-3">
          <h1 className="text-2xl font-black">🏦 Зээл нэмэх</h1>
          {Object.entries(f).map(([k, v]) => (
            <input
              key={k}
              className="input"
              placeholder={k}
              value={v}
              type={k === 'name' ? 'text' : 'number'}
              onChange={e => setF({ ...f, [k]: e.target.value })}
            />
          ))}
          <button className="btn w-full bg-indigo-600 text-white">Хадгалах</button>
        </form>

        <div className="card lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold">⏰ Төлөлтийн хуваарь</h2>
          <div className="grid gap-3">
            {loans.map(l => (
              <div key={l.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <div className="flex justify-between">
                  <b>{l.name}</b>
                  <span>Сар бүрийн {l.dueDay}</span>
                </div>
                <p className="text-slate-500">
                  Үлдэгдэл: {Number(l.remainingBalance).toLocaleString('mn-MN')} ₮ •{' '}
                  Сарын төлөлт: {Number(l.monthlyPayment).toLocaleString('mn-MN')} ₮ •{' '}
                  Хүү: {l.interestRate}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
