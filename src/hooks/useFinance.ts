import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, getDoc, setDoc, updateDoc, increment, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CONFIG } from '../constants/audit';

export function useFinance(user: any) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [metadata, setMetadata] = useState({ startBalance: 0, debtRemaining: CONFIG.INITIAL_DEBT });
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const monthId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const APP_ID = user?.isAnonymous ? 'stasis-sandbox' : 'auditor-financeiro-pro';
  const BASE_PATH = `artifacts/${APP_ID}/public/data`;

  useEffect(() => {
    if (!user || !db) return;
    const unsubT = onSnapshot(collection(db, `${BASE_PATH}/transactions`), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTransactions(data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });

    const initMonthlyMetadata = async () => {
      const currentMonthRef = doc(db!, `${BASE_PATH}/metadata/monthly/history/${monthId}`);
      const snap = await getDoc(currentMonthRef);
      if (snap.exists()) {
        setMetadata(prev => ({ ...prev, startBalance: snap.data().startBalance }));
      } else {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevId = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
        const prevSnap = await getDoc(doc(db!, `${BASE_PATH}/metadata/monthly/history/${prevId}`));
        const carryOver = prevSnap.exists() ? prevSnap.data().startBalance : 0;
        await setDoc(currentMonthRef, { startBalance: carryOver, createdAt: new Date().toISOString() });
        setMetadata(prev => ({ ...prev, startBalance: carryOver }));
      }
    };

    const unsubD = onSnapshot(doc(db, `${BASE_PATH}/metadata/finances`), (snap) => {
      if (snap.exists()) setMetadata(prev => ({ ...prev, debtRemaining: snap.data().debtRemaining }));
    });

    initMonthlyMetadata().then(() => setLoading(false));
    return () => { unsubT(); unsubD(); };
  }, [user, monthId, BASE_PATH]);

  const stats = useMemo(() => {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const monthlyTrans = transactions.filter((t: any) => t.date.startsWith(monthId));

    const incomes = monthlyTrans.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
    const bankExpenses = monthlyTrans.filter(t => t.type === 'expense' && t.source === 'bank' && t.category !== 'withdrawal').reduce((a, c) => a + c.amount, 0);
    const cashExpenses = monthlyTrans.filter(t => t.type === 'expense' && t.source === 'cash' && t.category !== 'deposit').reduce((a, c) => a + c.amount, 0);
    
    const withdrawals = monthlyTrans.filter(t => t.category === 'withdrawal').reduce((a, c) => a + c.amount, 0);
    const deposits = monthlyTrans.filter(t => t.category === 'deposit').reduce((a, c) => a + c.amount, 0);
    const savings = monthlyTrans.filter(t => t.category === 'savings').reduce((a, c) => a + c.amount, 0);
    const investments = monthlyTrans.filter(t => t.category === 'investment').reduce((a, c) => a + c.amount, 0);

    const bankBalance = (metadata.startBalance + incomes + deposits) - (bankExpenses + withdrawals + savings + investments);
    const cashBalance = (withdrawals + (monthlyTrans.filter(t => t.type === 'income' && t.source === 'cash').reduce((a,c)=>a+c.amount,0))) - (cashExpenses + deposits);
    const totalLiquidity = bankBalance + cashBalance;

    // LÓGICA BURN-DOWN
    const initialCap = metadata.startBalance + incomes;
    const burnData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const ideal = Math.max(0, initialCap - ((initialCap / daysInMonth) * day));
      const realSpend = monthlyTrans.filter(t => t.type === 'expense' && new Date(t.date).getDate() <= day).reduce((a, b) => a + b.amount, 0);
      const real = day <= currentDay ? Math.max(0, initialCap - realSpend) : null;
      return { day, ideal, real };
    });

    const getCoords = (key: 'ideal' | 'real') => burnData.filter(d => d[key] !== null).map(d => `${(d.day / daysInMonth) * 100},${100 - (d[key]! / (initialCap || 1)) * 100}`).join(' ');

    return {
      balance: bankBalance,
      cashBalance,
      investmentBalance: investments,
      totalLiquidity,
      dailyAllowance: totalLiquidity / Math.max(1, (daysInMonth - currentDay) + 1),
      remainingDays: (daysInMonth - currentDay) + 1,
      burnLines: { ideal: getCoords('ideal'), real: getCoords('real') },
      isCritical: (totalLiquidity / (daysInMonth - currentDay + 1)) < CONFIG.DAILY_GOAL,
      totalExtra: monthlyTrans.filter(t => t.category === 'extra').reduce((a, c) => a + c.amount, 0)
    };
  }, [transactions, metadata, monthId]);

  const addTransaction = async (data: any) => {
    if (!db || !user) return;
    await addDoc(collection(db, `${BASE_PATH}/transactions`), { ...data, amount: parseFloat(data.amount), date: new Date().toISOString(), userId: user.uid });
    if (data.category === 'debt_repayment') await updateDoc(doc(db, `${BASE_PATH}/metadata/finances`), { debtRemaining: increment(-parseFloat(data.amount)) });
  };

  return { transactions, debtStatus: { remaining: metadata.debtRemaining }, stats, loading, updateStartBalance: (val: number) => updateDoc(doc(db!, `${BASE_PATH}/metadata/monthly/history/${monthId}`), { startBalance: val }), addTransaction };
}