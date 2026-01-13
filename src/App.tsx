// src/App.tsx
import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { useFinance } from './hooks/useFinance';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { BalanceCard } from './components/dashboard/BalanceCard';
import { TransactionHistory } from './components/dashboard/TransactionHistory';
import { TransactionForm } from './components/forms/TransactionForm';
import { DebtStats } from './components/dashboard/DebtStats';
import { Settings2, RefreshCcw } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { transactions, debtStatus, stats, loading, updateStartBalance, addTransaction } = useFinance(user);

  // D. SISTEMA DE NOTIFICAÇÕES (BROWSER)
  useEffect(() => {
    if (stats.isCritical && Notification.permission === 'granted') {
      new Notification("STASIS: DÉFICE CRÍTICO", {
        body: `Quota diária abaixo do limite: ${stats.dailyAllowance.toFixed(2)}€`,
        icon: "/pwa-192x192.png"
      });
    }
  }, [stats.isCritical]);

  useEffect(() => {
    if (!auth) return;
    signInAnonymously(auth).catch(console.error);
    if (Notification.permission === 'default') Notification.requestPermission();
    return onAuthStateChanged(auth, setUser);
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500"><RefreshCcw className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32">
      <Header isCritical={stats.isCritical} />
      <main className="max-w-md mx-auto p-4 space-y-6">
        <div className="flex justify-end px-2">
          <button onClick={() => {
            const val = prompt("Saldo real atual:", stats.balance.toString());
            if (val) updateStartBalance(parseFloat(val));
          }} className="text-[10px] font-black uppercase text-slate-500">
            <Settings2 size={12} className="inline mr-1" /> Ajuste Manual
          </button>
        </div>
        <BalanceCard stats={stats} onAdd={() => setIsFormOpen(true)} />
        <DebtStats debt={debtStatus} extra={stats.totalExtra} />
        <TransactionHistory transactions={transactions} />
      </main>
      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={(data: any) => { addTransaction(data); setIsFormOpen(false); }}
      />
      <BottomNav currentView={isFormOpen ? 'add' : 'dashboard'} setView={(v: string) => setIsFormOpen(v === 'add')} />
    </div>
  );
}