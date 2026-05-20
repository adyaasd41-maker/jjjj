'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Plus, Download } from 'lucide-react';
import { toast } from './Toast';

const cats = [
  '🍔 Food', '🏠 Rent', '🚗 Transport', '👶 Kids',
  '🎉 Entertainment', '📦 Others', '☕ Inventory', '👥 Salary', '💡 Utilities',
];

const money = (n: number) =>
  new Intl.NumberFormat('mn-MN', { maximumFractionDigits: 0 }).format(n) + ' ₮';

async function api(path: string, body?: any, method = 'POST') {
  const r = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error('API error');
  return r.json();
}

export function FinanceDashboard() {
  const [tx, setTx] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    type: 'expense',
    source: 'family',
    category: '🍔 Food',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    note: '',
  });

  const load = async () => {
    setLoading(true);
    const [a, b, c, d] = await Promise.all([
      fetch('/api/transactions').then(r => r.json()),
      fetch('/api/goals').then(r => r.json()),
      fetch('/api/loans').then(r => r.json()),
      fetch('/api/sales').then(r => r.json()),
    ]);
    setTx(Array.isArray(a) ? a : []);
    setGoals(Array.isArray(b) ? b : []);
    setLoans(Array.isArray(c) ? c : []);
    setSales(Array.isArray(d) ? d : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const totals = useMemo(() => {
    const by = (s: string) =>
      tx.filter(x => x.source === s).reduce((n, x) => n + (x.type === 'income' ? Number(x.amount) : -Number(x.amount)), 0);
    return { family: by('family'), cafe: by('cafe'), all: by('family') + by('cafe') };
  }, [tx]);

  const monthly = useMemo(() => {
    const m: Record<string, any> = {};
    tx.forEach(x => {
      const k = new Date(x.date).toLocaleString('mn-MN', { month: 'short' });
      m[k] ??= { month: k, income: 0, expense: 0, family: 0, cafe: 0 };
      m[k][x.type] += Number(x.amount);
      m[k][x.source] += Number(x.amount);
    });
    return Object.values(m).slice(-6);
  }, [tx]);

  const pie = useMemo(
    () =>
      cats
        .map(c => ({
          name: c,
          value: tx.filter(x => x.type === 'expense' && x.category === c).reduce((a, b) => a + Number(b.amount), 0),
        }))
        .filter(x => x.value > 0),
    [tx],
  );

  const addTx = async (e: any) => {
    e.preventDefault();
    await api('/api/transactions', { ...form, amount: Number(form.amount) });
    toast('Гүйлгээ нэмэгдлээ ✅');
    setForm({ ...form, amount: '', note: '' });
    load();
  };

  const exportExcel = () => {
    window.location.href = '/api/export';
  };

  if (loading)
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="card h-36 animate-pulse bg-slate-100 dark:bg-slate-900" />
        ))}
      </div>
    );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Stat t="💰 Нийт үлдэгдэл" v={money(totals.all)} />
        <Stat t="👨‍👩‍👧‍👦 Family" v={money(totals.family)} />
        <Stat t="☕ Cafe" v={money(totals.cafe)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <h2 className="mb-4 text-xl font-bold">📊 Орлого vs зарлага</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" radius={[10, 10, 0, 0]} />
              <Bar dataKey="expense" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="mb-4 text-xl font-bold">⚠️ Анхааруулга</h2>
          <p className="rounded-2xl bg-amber-100 p-3 text-amber-900">
            ⚠️ Food ангилал өмнөх сараас өндөр байна.
          </p>
          <p className="mt-3 rounded-2xl bg-indigo-100 p-3 text-indigo-900">
            ⏰ {loans[0] ? `${loans[0].name} төлөлт ${loans[0].dueDay}-нд` : 'Зээл нэмээгүй байна'}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <form onSubmit={addTx} className="card space-y-3">
          <h2 className="text-xl font-bold">➕ Гүйлгээ нэмэх</h2>
          <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="expense">Зарлага</option>
            <option value="income">Орлого</option>
          </select>
          <select className="input" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
            <option value="family">👨‍👩‍👧‍👦 Family</option>
            <option value="cafe">☕ Cafe</option>
          </select>
          <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            className="input"
            placeholder="Дүн"
            type="number"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />
          <input
            className="input"
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />
          <button className="btn w-full bg-indigo-600 text-white">Хадгалах</button>
        </form>

        <div className="card xl:col-span-2">
          <div className="mb-4 flex justify-between">
            <h2 className="text-xl font-bold">🧾 Сүүлийн гүйлгээ</h2>
            <button onClick={exportExcel} className="btn bg-slate-900 text-white">
              <Download size={16} /> Excel
            </button>
          </div>
          <div className="space-y-2">
            {tx.slice(0, 8).map(x => (
              <div key={x.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                <div>
                  <b>{x.category}</b>
                  <p className="text-sm text-slate-500">
                    {x.source} • {new Date(x.date).toLocaleDateString('mn-MN')}
                  </p>
                </div>
                <b className={x.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}>
                  {x.type === 'income' ? '+' : '-'}{money(Number(x.amount))}
                </b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="card">
          <h2 className="mb-4 text-xl font-bold">🎯 Хадгаламж</h2>
          {goals.length
            ? goals.map(g => <Progress key={g.id} name={g.name} cur={Number(g.currentAmount)} target={Number(g.targetAmount)} />)
            : <Empty text="Зорилго нэмээгүй байна" />}
        </div>
        <div className="card">
          <h2 className="mb-4 text-xl font-bold">📈 Зардлын бүтэц</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pie} dataKey="value" nameKey="name" outerRadius={90} label>
                {pie.map((_, i) => <Cell key={i} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="mb-4 text-xl font-bold">☕ Кафе борлуулалт</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={sales.map(s => ({
                date: new Date(s.date).toLocaleDateString('mn-MN'),
                total: Number(s.cash) + Number(s.card) + Number(s.qpay),
              }))}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <button
        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 rounded-full bg-indigo-600 p-5 text-white shadow-soft"
      >
        <Plus />
      </button>
    </div>
  );
}

function Stat({ t, v }: { t: string; v: string }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{t}</p>
      <h1 className="mt-2 text-3xl font-black">{v}</h1>
    </div>
  );
}

function Progress({ name, cur, target }: { name: string; cur: number; target: number }) {
  const p = Math.min(100, Math.round((cur / target) * 100));
  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <b>{name}</b>
        <span>{p}%</span>
      </div>
      <div className="mt-2 h-3 rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-3 rounded-full bg-indigo-600" style={{ width: p + '%' }} />
      </div>
      <p className="mt-1 text-sm text-slate-500">Үлдсэн: {money(target - cur)}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed p-8 text-center text-slate-500">
      📭 {text}
    </div>
  );
}
