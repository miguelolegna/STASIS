// src/types/finance.ts
export type TransactionType = 'expense' | 'income';
export type Category = 'daily' | 'unexpected' | 'biscate' | 'debt_repayment';

export interface Transaction {
  id: string;
  desc: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
  userId: string;
}

export interface DebtStatus {
  remaining: number;
}

export interface AuditStats {
  balance: number;
  dailyAllowance: number;
  remainingDays: number;
  survivalRate: number;
  totalExtra: number;
  isCritical: boolean;
}