'use client';

import Link from 'next/link';
import { useMemo, useState, type FormEvent } from 'react';
import type { FinanceAreaSnapshot } from '@/lib/finance-system';
import { financeAreaMeta, financeAreaOrder } from '@/lib/finance-meta';
import type { FinancialCategory } from '@/lib/financial-schema';
import type { FinancialItem } from '@/lib/financial-items';
import type { FinancialMovement } from '@/lib/financial-workspace';
import type { ReserveGoal } from '@/lib/reserve-goals';

type FinanceiroAreaClientProps = {
  snapshot: FinanceAreaSnapshot;
};

type View = 'overview' | 'cash' | 'recurring' | 'reserves';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(`${value}T00:00:00`));
}

function parseAmountInput(value: string) {
  const normalized = value.replace(/\s+/g, '').replace(/\./g, '').replace(',', '.');
  return Number(normalized);
}

function isMonthlyRecurringCategory(category: FinancialCategory) {
  return category === 'Entrada fixa' || category === 'Gasto fixo';
}

function buildMonthDate(monthValue: string, day: number) {
  const [year, month] = monthValue.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0).getDate();
  date.setDate(Math.min(Math.max(day, 1), lastDay));
  return date.toISOString().slice(0, 10);
}

function isInMonth(value: string | null, monthValue: string) {
  return Boolean(value && value.slice(0, 7) === monthValue);
}

export function FinanceiroAreaClient({ snapshot }: FinanceiroAreaClientProps) {
  const [view, setView] = useState<View>('overview');
  const [balance, setBalance] = useState(snapshot.balance);
  const [movements, setMovements] = useState(snapshot.movements);
  const [items, setItems] = useState(snapshot.items);
  const [reserves, setReserves] = useState(snapshot.reserves);

  const [balanceInput, setBalanceInput] = useState(snapshot.balance.currentBalance.toFixed(2).replace('.', ','));
  const [adjustmentLabel, setAdjustmentLabel] = useState('');
  const [movementLabel, setMovementLabel] = useState('');
  const [movementKind, setMovementKind] = useState<'entrada' | 'gasto'>('entrada');
  const [movementAmount, setMovementAmount] = useState('');
  const [movementDate, setMovementDate] = useState(new Date().toISOString().slice(0, 10));
  const [movementNotes, setMovementNotes] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<FinancialCategory>('Entrada fixa');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [editingCategory, setEditingCategory] = useState<FinancialCategory>('Entrada fixa');
  const [editingAmount, setEditingAmount] = useState('');
  const [editingDueDate, setEditingDueDate] = useState('');
  const [editingDueDay, setEditingDueDay] = useState('');
  const [editingPaid, setEditingPaid] = useState(false);
  const [goalLabel, setGoalLabel] = useState('');
  const [goalTargetAmount, setGoalTargetAmount] = useState('');
  const [goalCurrentAmount, setGoalCurrentAmount] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const columns = useMemo(() => {
    return (['Entrada fixa', 'Conta a pagar', 'Gasto fixo'] as const).map((currentCategory) => {
      const columnItems = items
        .filter((item) => item.category === currentCategory)
        .filter((item) => (item.recurring ? true : isInMonth(item.dueDate, selectedMonth)))
        .map((item) => ({
          ...item,
          dueDate: item.recurring && item.recurrenceDay ? buildMonthDate(selectedMonth, item.recurrenceDay) : item.dueDate,
          scheduleLabel: item.recurring && item.recurrenceDay ? `Todo dia ${String(item.recurrenceDay).padStart(2, '0')}` : item.scheduleLabel
        }))
        .sort((left, right) => {
          const paidOrder = Number(left.paid) - Number(right.paid);
          return paidOrder !== 0 ? paidOrder : (left.dueDate ?? '').localeCompare(right.dueDate ?? '');
        });

      return {
        category: currentCategory,
        items: columnItems,
        total: columnItems.reduce((sum, item) => sum + item.amount, 0)
      };
    });
  }, [items, selectedMonth]);

  const overview = useMemo(() => {
    const incomeTotal = items.filter((item) => item.category === 'Entrada fixa').reduce((sum, item) => sum + item.amount, 0);
    const fixedCostTotal = items.filter((item) => item.category === 'Gasto fixo').reduce((sum, item) => sum + item.amount, 0);
    const payablePendingTotal = items.filter((item) => item.category === 'Conta a pagar' && !item.paid).reduce((sum, item) => sum + item.amount, 0);

    return {
      incomeTotal,
      fixedCostTotal,
      payablePendingTotal,
      monthlyBalance: incomeTotal - fixedCostTotal - payablePendingTotal,
      pendingCount: items.filter((item) => item.category !== 'Entrada fixa' && !item.paid).length,
      recurringCount: items.filter((item) => item.recurring).length,
      movementCount: movements.length,
      reserveCount: reserves.length
    };
  }, [items, movements.length, reserves.length]);

  async function handleBalanceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedAmount = parseAmountInput(balanceInput);

    if (!Number.isFinite(parsedAmount)) {
      setFeedback({ type: 'error', message: 'Informe um saldo atual valido.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/account-balance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: snapshot.area,
          amount: parsedAmount,
          label: adjustmentLabel || null
        })
      });

      if (!response.ok) {
        setFeedback({ type: 'error', message: 'Nao foi possivel atualizar o saldo.' });
        return;
      }

      const result = (await response.json()) as { balance: typeof balance; movement: FinancialMovement | null };
      setBalance(result.balance);
      setBalanceInput(result.balance.currentBalance.toFixed(2).replace('.', ','));
      setAdjustmentLabel('');
      if (result.movement) {
        setMovements((current) => [result.movement!, ...current].slice(0, 20));
      }
      setFeedback({ type: 'success', message: 'Saldo atual atualizado.' });
    } catch {
      setFeedback({ type: 'error', message: 'Falha de conexao ao atualizar o saldo.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMovementSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedAmount = parseAmountInput(movementAmount);

    if (!movementLabel.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0 || !movementDate) {
      setFeedback({ type: 'error', message: 'Preencha descricao, valor e data da movimentacao.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/financial-movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: snapshot.area,
          label: movementLabel.trim(),
          kind: movementKind,
          amount: parsedAmount,
          movementDate,
          notes: movementNotes || null
        })
      });

      if (!response.ok) {
        setFeedback({ type: 'error', message: 'Nao foi possivel registrar a movimentacao.' });
        return;
      }

      const result = (await response.json()) as { movement: FinancialMovement; balance: typeof balance };
      setMovements((current) => [result.movement, ...current].slice(0, 20));
      setBalance(result.balance);
      setBalanceInput(result.balance.currentBalance.toFixed(2).replace('.', ','));
      setMovementLabel('');
      setMovementAmount('');
      setMovementNotes('');
      setFeedback({ type: 'success', message: 'Movimentacao registrada.' });
    } catch {
      setFeedback({ type: 'error', message: 'Falha de conexao ao registrar a movimentacao.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleImportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!importFile) {
      setFeedback({ type: 'error', message: 'Selecione um arquivo para importar.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append('area', snapshot.area);
      formData.append('file', importFile);

      const response = await fetch('/api/financial-imports', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setFeedback({ type: 'error', message: payload?.error || 'Nao foi possivel importar o extrato.' });
        return;
      }

      const result = (await response.json()) as { movements: FinancialMovement[]; balance: typeof balance; skipped: number };
      setMovements((current) => [...result.movements, ...current].slice(0, 20));
      setBalance(result.balance);
      setBalanceInput(result.balance.currentBalance.toFixed(2).replace('.', ','));
      setImportFile(null);
      setFeedback({ type: 'success', message: `${result.movements.length} importado(s) • ${result.skipped} duplicado(s).` });
    } catch {
      setFeedback({ type: 'error', message: 'Falha de conexao ao importar o arquivo.' });
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item: FinancialItem) {
    setEditingId(item.id);
    setEditingLabel(item.label);
    setEditingCategory(item.category);
    setEditingAmount(String(item.amount));
    setEditingDueDate(item.dueDate ?? '');
    setEditingDueDay(item.recurrenceDay ? String(item.recurrenceDay) : '');
    setEditingPaid(item.paid);
    setView('recurring');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingLabel('');
    setEditingCategory('Entrada fixa');
    setEditingAmount('');
    setEditingDueDate('');
    setEditingDueDay('');
    setEditingPaid(false);
  }

  async function handleItemSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedAmount = parseAmountInput(amount);

    if (!label.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFeedback({ type: 'error', message: 'Preencha nome e valor com um numero valido maior que zero.' });
      return;
    }

    if (isMonthlyRecurringCategory(category) && !dueDay.trim()) {
      setFeedback({ type: 'error', message: 'Itens mensais precisam de um dia do mes entre 1 e 31.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/financial-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: snapshot.area,
          label: label.trim(),
          category,
          amount: parsedAmount,
          dueDate: isMonthlyRecurringCategory(category) ? dueDay || null : dueDate || null
        })
      });

      if (!response.ok) {
        setFeedback({ type: 'error', message: 'Nao foi possivel adicionar o item agora.' });
        return;
      }

      const item = (await response.json()) as FinancialItem;
      setItems((current) => [item, ...current]);
      setLabel('');
      setAmount('');
      setCategory('Entrada fixa');
      setDueDate('');
      setDueDay('');
      setFeedback({ type: 'success', message: 'Item adicionado com sucesso.' });
    } catch {
      setFeedback({ type: 'error', message: 'Falha de conexao ao salvar o item.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleItemSave(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const parsedAmount = parseAmountInput(editingAmount);

    if (!editingLabel.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFeedback({ type: 'error', message: 'Revise os campos da edicao antes de salvar.' });
      return;
    }

    if (isMonthlyRecurringCategory(editingCategory) && !editingDueDay.trim()) {
      setFeedback({ type: 'error', message: 'Itens mensais precisam de um dia do mes entre 1 e 31.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/financial-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: editingLabel.trim(),
          category: editingCategory,
          amount: parsedAmount,
          dueDate: isMonthlyRecurringCategory(editingCategory) ? editingDueDay || null : editingDueDate || null,
          paid: editingCategory === 'Entrada fixa' ? true : editingPaid
        })
      });

      if (!response.ok) {
        setFeedback({ type: 'error', message: 'Nao foi possivel salvar as alteracoes.' });
        return;
      }

      const updated = (await response.json()) as FinancialItem;
      setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      cancelEdit();
      setFeedback({ type: 'success', message: 'Item atualizado com sucesso.' });
    } catch {
      setFeedback({ type: 'error', message: 'Falha de conexao ao atualizar o item.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function togglePaid(id: string) {
    setFeedback(null);

    try {
      const response = await fetch(`/api/financial-items/${id}/toggle`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        setFeedback({ type: 'error', message: 'Nao foi possivel atualizar o status do item.' });
        return;
      }

      const updated = (await response.json()) as FinancialItem;
      setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch {
      setFeedback({ type: 'error', message: 'Falha de conexao ao atualizar o item.' });
    }
  }

  async function deleteItem(id: string) {
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/financial-items/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setItems((current) => current.filter((item) => item.id !== id));
        setFeedback({ type: 'success', message: 'Item removido com sucesso.' });
      } else {
        setFeedback({ type: 'error', message: 'Nao foi possivel remover o item.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Falha de conexao ao remover o item.' });
    } finally {
      setSubmitting(false);
      if (editingId === id) {
        cancelEdit();
      }
    }
  }

  async function handleReserveSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedTarget = parseAmountInput(goalTargetAmount);
    const parsedCurrent = goalCurrentAmount ? parseAmountInput(goalCurrentAmount) : 0;

    if (!goalLabel.trim() || !Number.isFinite(parsedTarget) || parsedTarget <= 0 || !Number.isFinite(parsedCurrent) || parsedCurrent < 0) {
      setFeedback({ type: 'error', message: 'Revise os valores da reserva.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/reserve-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: snapshot.area,
          label: goalLabel.trim(),
          targetAmount: parsedTarget,
          currentAmount: parsedCurrent
        })
      });

      if (!response.ok) {
        setFeedback({ type: 'error', message: 'Falha ao criar meta.' });
        return;
      }

      const goal = (await response.json()) as ReserveGoal;
      setReserves((current) => [goal, ...current]);
      setGoalLabel('');
      setGoalTargetAmount('');
      setGoalCurrentAmount('');
      setFeedback({ type: 'success', message: 'Meta adicionada com sucesso.' });
    } catch {
      setFeedback({ type: 'error', message: 'Falha ao criar meta.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center gap-2">
        {(['overview', 'cash', 'recurring', 'reserves'] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${
              view === item ? 'border-white/20 bg-white text-slate-950' : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
            }`}
            onClick={() => setView(item)}
          >
            {item === 'overview' ? 'Visao geral' : item === 'cash' ? 'Caixa' : item === 'recurring' ? 'Recorrencias' : 'Reservas'}
          </button>
        ))}
      </section>

      {feedback ? (
        <div
          className={`rounded-[1.25rem] border px-4 py-3 text-sm ${
            feedback.type === 'error' ? 'border-rose-400/30 bg-rose-400/10 text-rose-100' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
          }`}
          role="status"
          aria-live="polite"
        >
          {feedback.message}
        </div>
      ) : null}

      {snapshot.isDemo ? (
        <div className="rounded-[1.25rem] border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Área em modo de exemplo. Quando o banco tiver registros reais, este painel passa a usar os dados persistidos.
        </div>
      ) : null}

      {view === 'overview' ? (
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Saldo atual" value={formatCurrency(balance.currentBalance)} tone="finance" />
          <MetricCard label="Recorrencias" value={String(overview.recurringCount)} />
          <MetricCard label="Historico" value={String(overview.movementCount)} />
        </section>
      ) : null}

      {view === 'cash' ? (
        <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <form className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl space-y-4" onSubmit={handleBalanceSubmit}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Caixa</p>
              <h2 className="mt-2 font-mono text-2xl font-black tracking-[-0.04em]">Saldo atual</h2>
            </div>
            <label className="grid gap-2 text-sm text-slate-200">
              <span>Saldo</span>
              <input
                className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60"
                inputMode="decimal"
                value={balanceInput}
                onChange={(event) => setBalanceInput(event.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-200">
              <span>Motivo</span>
              <input
                className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60"
                value={adjustmentLabel}
                onChange={(event) => setAdjustmentLabel(event.target.value)}
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-950 transition hover:bg-slate-200 disabled:opacity-60"
            >
              {submitting ? 'Salvando...' : 'Atualizar saldo'}
            </button>
          </form>

          <form className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl space-y-4" onSubmit={handleMovementSubmit}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Movimento</p>
              <h2 className="mt-2 font-mono text-2xl font-black tracking-[-0.04em]">Registrar</h2>
            </div>
            <label className="grid gap-2 text-sm text-slate-200">
              <span>Descricao</span>
              <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60" value={movementLabel} onChange={(event) => setMovementLabel(event.target.value)} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-200">
                <span>Tipo</span>
                <select className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60" value={movementKind} onChange={(event) => setMovementKind(event.target.value as 'entrada' | 'gasto')}>
                  <option value="entrada">Entrada</option>
                  <option value="gasto">Gasto</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm text-slate-200">
                <span>Valor</span>
                <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60" inputMode="decimal" value={movementAmount} onChange={(event) => setMovementAmount(event.target.value)} />
              </label>
            </div>
            <label className="grid gap-2 text-sm text-slate-200">
              <span>Data</span>
              <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60" type="date" value={movementDate} onChange={(event) => setMovementDate(event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm text-slate-200">
              <span>Observacao</span>
              <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60" value={movementNotes} onChange={(event) => setMovementNotes(event.target.value)} />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-950 transition hover:bg-slate-200 disabled:opacity-60"
            >
              {submitting ? 'Registrando...' : 'Registrar movimento'}
            </button>
          </form>

          <form className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl space-y-4 xl:col-span-2" onSubmit={handleImportSubmit}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Importacao</p>
              <h2 className="mt-2 font-mono text-2xl font-black tracking-[-0.04em]">Extrato</h2>
            </div>
            <input
              type="file"
              accept=".ofx,.csv,.txt"
              className="block w-full rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.24em] file:text-slate-950"
              onChange={(event) => setImportFile(event.target.files?.[0] ?? null)}
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-950 transition hover:bg-slate-200 disabled:opacity-60"
            >
              {submitting ? 'Importando...' : 'Importar'}
            </button>
            <div className="grid gap-3">
              {movements.map((movement) => (
                <article key={`${movement.area}-${movement.id}`} className="rounded-[1.25rem] border border-white/10 bg-slate-950/40 px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500">{financeAreaMeta[movement.area].title}</p>
                      <h3 className="mt-2 font-semibold text-slate-50">{movement.label}</h3>
                      <p className="mt-1 text-sm text-slate-400">{formatDate(movement.movementDate)}</p>
                    </div>
                    <span className={`text-sm font-semibold ${movement.amount >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {movement.amount >= 0 ? '+' : '-'}
                      {formatCurrency(Math.abs(movement.amount))}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </form>
        </section>
      ) : null}

      {view === 'recurring' ? (
        <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
          <form className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl space-y-4" onSubmit={handleItemSubmit}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Recorrencias</p>
              <h2 className="mt-2 font-mono text-2xl font-black tracking-[-0.04em]">Novo item</h2>
            </div>
            <label className="grid gap-2 text-sm text-slate-200">
              <span>Nome</span>
              <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60" value={label} onChange={(event) => setLabel(event.target.value)} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-200">
                <span>Tipo</span>
                <select className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60" value={category} onChange={(event) => setCategory(event.target.value as FinancialCategory)}>
                  {(['Entrada fixa', 'Conta a pagar', 'Gasto fixo'] as const).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-slate-200">
                <span>Valor</span>
                <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
              </label>
            </div>
            <label className="grid gap-2 text-sm text-slate-200">
              <span>{isMonthlyRecurringCategory(category) ? 'Dia do mes' : 'Vencimento'}</span>
              {isMonthlyRecurringCategory(category) ? (
                <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60" inputMode="numeric" value={dueDay} onChange={(event) => setDueDay(event.target.value)} />
              ) : (
                <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
              )}
            </label>
            <button type="submit" disabled={submitting} className="rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-950 transition hover:bg-slate-200 disabled:opacity-60">
              {submitting ? 'Salvando...' : 'Adicionar'}
            </button>
          </form>

          <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Itens</p>
                <h2 className="mt-2 font-mono text-2xl font-black tracking-[-0.04em]">Meses e categorias</h2>
              </div>
              <input
                type="month"
                className="rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              />
            </div>

            <div className="grid gap-3">
              {columns.map((column) => (
                <section key={column.category} className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                  <header className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-50">{column.category}</h3>
                    <span className="text-sm text-slate-400">{formatCurrency(column.total)}</span>
                  </header>

                  <div className="mt-4 space-y-3">
                    {column.items.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">Nenhum item cadastrado.</div>
                    ) : (
                      column.items.map((item) => (
                        <article key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                          {editingId === item.id ? (
                            <form className="space-y-3" onSubmit={(event) => handleItemSave(event, item.id)}>
                              <label className="grid gap-2 text-sm text-slate-200">
                                <span>Nome</span>
                                <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none" value={editingLabel} onChange={(event) => setEditingLabel(event.target.value)} />
                              </label>
                              <div className="grid gap-3 md:grid-cols-2">
                                <label className="grid gap-2 text-sm text-slate-200">
                                  <span>Tipo</span>
                                  <select className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none" value={editingCategory} onChange={(event) => setEditingCategory(event.target.value as FinancialCategory)}>
                                    {(['Entrada fixa', 'Conta a pagar', 'Gasto fixo'] as const).map((option) => <option key={option} value={option}>{option}</option>)}
                                  </select>
                                </label>
                                <label className="grid gap-2 text-sm text-slate-200">
                                  <span>Valor</span>
                                  <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none" inputMode="decimal" value={editingAmount} onChange={(event) => setEditingAmount(event.target.value)} />
                                </label>
                              </div>
                              <div className="grid gap-3 md:grid-cols-2">
                                <label className="grid gap-2 text-sm text-slate-200">
                                  <span>{isMonthlyRecurringCategory(editingCategory) ? 'Dia do mes' : 'Vencimento'}</span>
                                  {isMonthlyRecurringCategory(editingCategory) ? (
                                    <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none" inputMode="numeric" value={editingDueDay} onChange={(event) => setEditingDueDay(event.target.value)} />
                                  ) : (
                                    <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none" type="date" value={editingDueDate} onChange={(event) => setEditingDueDate(event.target.value)} />
                                  )}
                                </label>
                                <label className="grid gap-2 text-sm text-slate-200">
                                  <span>Status</span>
                                  {editingCategory !== 'Entrada fixa' ? (
                                    <select className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none" value={editingPaid ? 'pago' : 'pendente'} onChange={(event) => setEditingPaid(event.target.value === 'pago')}>
                                      <option value="pendente">Pendente</option>
                                      <option value="pago">Pago</option>
                                    </select>
                                  ) : (
                                    <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none" value="Fixo" readOnly />
                                  )}
                                </label>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                <button type="submit" className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-950">Salvar</button>
                                <button type="button" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200" onClick={cancelEdit}>Cancelar</button>
                              </div>
                            </form>
                          ) : (
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div>
                                <strong className="block text-slate-50">{item.label}</strong>
                                <span className="mt-1 block text-sm text-slate-400">{item.scheduleLabel}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${item.paid ? 'bg-emerald-400/10 text-emerald-200' : 'bg-amber-400/10 text-amber-200'}`}>
                                  {item.paid ? 'Pago' : 'Pendente'}
                                </span>
                                <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200" onClick={() => togglePaid(item.id)}>
                                  Toggle
                                </button>
                                <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200" onClick={() => startEdit(item)}>
                                  Editar
                                </button>
                                <button type="button" className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-100" onClick={() => deleteItem(item.id)}>
                                  Excluir
                                </button>
                              </div>
                            </div>
                          )}
                        </article>
                      ))
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {view === 'reserves' ? (
        <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
          <form className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl space-y-4" onSubmit={handleReserveSubmit}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Reservas</p>
              <h2 className="mt-2 font-mono text-2xl font-black tracking-[-0.04em]">Nova meta</h2>
            </div>
            <label className="grid gap-2 text-sm text-slate-200">
              <span>Nome</span>
              <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60" value={goalLabel} onChange={(event) => setGoalLabel(event.target.value)} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-200">
                <span>Meta</span>
                <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60" inputMode="decimal" value={goalTargetAmount} onChange={(event) => setGoalTargetAmount(event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm text-slate-200">
                <span>Atual</span>
                <input className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/60" inputMode="decimal" value={goalCurrentAmount} onChange={(event) => setGoalCurrentAmount(event.target.value)} />
              </label>
            </div>
            <button type="submit" disabled={submitting} className="rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-950 transition hover:bg-slate-200 disabled:opacity-60">
              {submitting ? 'Salvando...' : 'Adicionar'}
            </button>
          </form>

          <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Reservas</p>
              <h2 className="mt-2 font-mono text-2xl font-black tracking-[-0.04em]">Metas cadastradas</h2>
            </div>
            <div className="grid gap-3">
              {reserves.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">Nenhuma meta.</div>
              ) : (
                reserves.map((goal) => {
                  const progress = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
                  return (
                    <article key={goal.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <strong className="block text-slate-50">{goal.label}</strong>
                          <span className="mt-1 block text-sm text-slate-400">
                            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-slate-200">{Math.round(progress)}%</span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300" style={{ width: `${progress}%` }} />
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link href="/financeiro" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
          Hub
        </Link>
        {financeAreaOrder.map((area) => (
          <Link key={area} href={`/financeiro/${area}`} className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${area === snapshot.area ? 'border-white/20 bg-white text-slate-950' : 'border-white/10 bg-white/5 text-slate-200'}`}>
            {financeAreaMeta[area].title}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone?: 'finance' | 'default' }) {
  return (
    <article className={`rounded-[2rem] border p-6 backdrop-blur-xl ${tone === 'finance' ? 'border-white/10 bg-white/5' : 'border-white/10 bg-white/5'}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <strong className="mt-4 block font-mono text-3xl tracking-[-0.05em] text-white">{value}</strong>
    </article>
  );
}
