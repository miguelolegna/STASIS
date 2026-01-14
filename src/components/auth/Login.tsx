import { useState } from 'react';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth!, email, pass);
    } catch (err) {
      setError("Credenciais Inválidas.");
    }
  };

  return (
    <div className="min-h-screen bg-[#021729] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-black tracking-[0.3em] text-white mb-2">STASIS</h1>
      <p className="text-primary-blue text-[10px] mb-12 uppercase font-bold">Audit Protocol Active</p>
      
        <form onSubmit={handleAdmin} className="w-full max-w-xs space-y-3 mb-8">
        <input 
            type="email" 
            placeholder="ADMIN_EMAIL" 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-primary-blue text-white placeholder:text-white/40 transition-all"
            onChange={e => setEmail(e.target.value)}
        />
        <input 
            type="password" 
            placeholder="PASSWORD" 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-primary-blue text-white placeholder:text-white/40 transition-all"
            onChange={e => setPass(e.target.value)}
        />
        <button className="w-full py-4 bg-primary-blue rounded-xl font-bold text-white active:scale-95 transition-all">
            ENTRAR
        </button>
        </form>

      <div className="w-full max-w-xs border-t border-white/5 pt-8">
        <button 
          onClick={() => signInAnonymously(auth!)}
          className="w-full py-4 border border-white/10 rounded-xl font-bold text-slate-400 hover:text-white transition-all"
        >
          ACEDER COMO CONVIDADO
        </button>
        {error && <p className="mt-4 text-red-500 text-[10px] font-bold">{error}</p>}
      </div>
    </div>
  );
};