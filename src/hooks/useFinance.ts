import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, APP_ID } from '../lib/firebase';
import { CONFIG } from '../constants/audit';

export function useFinance(user: any) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [metadata, setMetadata] = useState({ startBalance: 0, debtRemaining: CONFIG.INITIAL_DEBT });
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const monthId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    if (!user || !db) return;

    // 1. Sincronização de Transações (Geral para histórico)
    const unsubT = onSnapshot(
      collection(db, 'artifacts', APP_ID, 'public', 'data', 'transactions'),
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setTransactions(data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    );

    // 2. Lógica de Inicialização de Mês e Carry-over
    const initMonthlyMetadata = async () => {
  const currentMonthPath = `artifacts/${APP_ID}/public/data/metadata/monthly/history/${monthId}`;
  const currentMonthRef = doc(db!, currentMonthPath);
  const snap = await getDoc(currentMonthRef);

  if (snap.exists()) {
    setMetadata(prev => ({ ...prev, startBalance: snap.data().startBalance }));
  } else {
    // LÓGICA DE TRANSIÇÃO (CARRY-OVER)
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthId = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;
    const prevMonthPath = `artifacts/${APP_ID}/public/data/metadata/monthly/history/${prevMonthId}`;
    
    const prevSnap = await getDoc(doc(db!, prevMonthPath));
    
    let carryOverBalance = 0;

    if (prevSnap.exists()) {
      // Cálculo do saldo real com que terminaste o mês passado
      const prevStart = prevSnap.data().startBalance;
      const prevTrans = transactions.filter(t => t.date.startsWith(prevMonthId));
      
      const incomes = prevTrans.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
      const expenses = prevTrans.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
      const savings = prevTrans.filter(t => t.type === 'savings').reduce((a, b) => a + b.amount, 0);
      
      carryOverBalance = prevStart + incomes - expenses - savings;
    } else {
      // Se for o primeiro mês absoluto (Jan 2026) e não houver anterior
      carryOverBalance = 0; 
    }

    await setDoc(currentMonthRef, { 
      startBalance: carryOverBalance,
      createdAt: new Date().toISOString()
    });
    
    setMetadata(prev => ({ ...prev, startBalance: carryOverBalance }));
  }
};

    // 3. Sincronização da Dívida (Global)
    const unsubD = onSnapshot(
      doc(db, 'artifacts', APP_ID, 'public', 'data', 'metadata', 'finances'),
      (snap) => {
        if (snap.exists()) setMetadata(prev => ({ ...prev, debtRemaining: snap.data().debtRemaining }));
      }
    );

    initMonthlyMetadata().then(() => setLoading(false));
    return () => { unsubT(); unsubD(); };
  }, [user, monthId]);

  const stats = useMemo(() => {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const remainingDays = Math.max(1, daysInMonth - now.getDate() + 1);

    const monthlyTrans = transactions.filter((t: any) => t.date.startsWith(monthId));

    const incomes = monthlyTrans.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
    const expenses = monthlyTrans.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
    const savings = monthlyTrans.filter(t => t.type === 'savings').reduce((a, c) => a + c.amount, 0);

    // Equação de Auditoria:
    // $$Balance_{current} = Balance_{start} + \sum Incomes - \sum Expenses - \sum Savings$$
    const currentBalance = metadata.startBalance + incomes - expenses - savings;
    const dailyAllowance = currentBalance / remainingDays;

    return {
      balance: currentBalance,
      dailyAllowance,
      remainingDays,
      totalSavings: savings,
      survivalRate: (dailyAllowance / CONFIG.DAILY_GOAL) * 100,
      totalExtra: monthlyTrans.filter(t => t.category === 'biscate').reduce((a, c) => a + c.amount, 0),
      isCritical: dailyAllowance < CONFIG.DAILY_GOAL
    };
  }, [transactions, metadata, monthId]);

  const updateStartBalance = async (newAmount: number) => {
    if (!db) return;
    const currentMonthRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'metadata', 'monthly', monthId);
    await updateDoc(currentMonthRef, { startBalance: newAmount });
    setMetadata(prev => ({ ...prev, startBalance: newAmount }));
  };

  return { transactions, debtStatus: { remaining: metadata.debtRemaining }, stats, loading, updateStartBalance };
}