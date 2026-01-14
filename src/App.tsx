import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useFinance } from './hooks/useFinance';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { BalanceCard } from './components/dashboard/BalanceCard';
import { TransactionHistory } from './components/dashboard/TransactionHistory';
import { TransactionForm } from './components/forms/TransactionForm';
import { DebtStats } from './components/dashboard/DebtStats';
import { BurnDownChart } from './components/analytics/BurnDownChart'; // Novo componente
import { Login } from './components/auth/Login';
import { Settings2, RefreshCcw } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<'dashboard' | 'analytics'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { transactions, debtStatus, stats, loading, updateStartBalance, addTransaction } = useFinance(user);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth!, (u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) return <Login />;
  if (loading) return <div className="min-h-screen bg-[#021729] flex items-center justify-center text-primary-blue"><RefreshCcw className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#021729] text-slate-100 pb-32">
      <Header isCritical={stats.isCritical} onLogout={() => signOut(auth!)} />
      
      <main className="max-w-md mx-auto p-4 space-y-6">
        {view === 'dashboard' ? (
          <div className="animate-slide-up space-y-6">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-black text-slate-600 uppercase">STASIS_{user.isAnonymous ? 'GUEST' : 'ADMIN'}</span>
              <button onClick={() => {
                const val = prompt("Ajuste manual:", stats.balance.toString());
                if (val) updateStartBalance(parseFloat(val));
              }} className="text-[10px] font-black uppercase text-slate-500"><Settings2 size={12} className="inline mr-1"/>Ajuste</button>
            </div>
            <BalanceCard stats={stats} onAdd={() => setIsFormOpen(true)} />
            <DebtStats debt={debtStatus} extra={stats.totalExtra} />
            <TransactionHistory transactions={transactions} />
          </div>
        ) : (
          <div className="animate-slide-up space-y-6">
            <h2 className="text-xl font-black uppercase tracking-widest px-2">Relatórios de Auditoria</h2>
            <BurnDownChart lines={stats.burnLines} />
            {/* Próximos gráficos entram aqui */}
          </div>
        )}
      </main>

      <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={(data: any) => { addTransaction(data); setIsFormOpen(false); }} />
      <BottomNav currentView={view} setView={(v: any) => v === 'add' ? setIsFormOpen(true) : setView(v)} />
    </div>
  );
}