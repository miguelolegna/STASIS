// src/hooks/useFinance.ts
import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, getDoc, setDoc, updateDoc, increment, addDoc } from 'firebase/firestore';
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

    const unsubT = onSnapshot(
      collection(db, 'artifacts', APP_ID, 'public', 'data', 'transactions'),
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setTransactions(data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    );

    const initMonthlyMetadata = async () => {
      const currentMonthRef = doc(db!, `artifacts/${APP_ID}/public/data/metadata/monthly/history/${monthId}`);
      const snap = await getDoc(currentMonthRef);

      if (snap.exists()) {
        setMetadata(prev => ({ ...prev, startBalance: snap.data().startBalance }));
      } else {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevId = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
        const prevSnap = await getDoc(doc(db!, `artifacts/${APP_ID}/public/data/metadata/monthly/history/${prevId}`));
        
        const carryOver = prevSnap.exists() ? prevSnap.data().startBalance : 0;
        await setDoc(currentMonthRef, { startBalance: carryOver, createdAt: new Date().toISOString() });
        setMetadata(prev => ({ ...prev, startBalance: carryOver }));
      }
    };

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

    const currentBalance = metadata.startBalance + incomes - expenses - savings;
    
    // A. BURN RATE (Últimos 7 dias de gastos reais)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const recentSpend = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) > sevenDaysAgo)
      .reduce((a, b) => a + b.amount, 0);
    const burnRate = recentSpend / 7;
    const daysUntilBroke = burnRate > 0 ? Math.floor(currentBalance / burnRate) : 999;

    // B. SPARKLINE (Normalização 0-100 para SVG)
    const chartPoints = monthlyTrans.slice(0, 10).reverse().map((t, i) => {
      const x = i * (140 / 9);
      const y = 50 - (Math.min(t.amount, 100) / 2); // Simulação visual de impacto
      return `${x},${y}`;
    }).join(' ');

    return {
      balance: currentBalance,
      dailyAllowance: currentBalance / remainingDays,
      remainingDays,
      daysUntilBroke,
      chartPoints: chartPoints || "0,25 140,25",
      survivalRate: ((currentBalance / remainingDays) / CONFIG.DAILY_GOAL) * 100,
      totalExtra: monthlyTrans.filter(t => t.category === 'biscate').reduce((a, c) => a + c.amount, 0),
      isCritical: (currentBalance / remainingDays) < CONFIG.DAILY_GOAL
    };
  }, [transactions, metadata, monthId]);

  const addTransaction = async (data: any) => {
    if (!db || !user) return;
    const amount = parseFloat(data.amount);
    await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'transactions'), {
      ...data, amount, date: new Date().toISOString(), userId: user.uid
    });

    if (data.category === 'debt_repayment') {
      await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'metadata', 'finances'), {
        debtRemaining: increment(-amount)
      });
    }
  };

  return { transactions, debtStatus: { remaining: metadata.debtRemaining }, stats, loading, updateStartBalance: (val: number) => updateDoc(doc(db!, `artifacts/${APP_ID}/public/data/metadata/monthly/history/${monthId}`), { startBalance: val }), addTransaction };
}