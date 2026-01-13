// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    
    signInAnonymously(auth).catch(console.error);
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}