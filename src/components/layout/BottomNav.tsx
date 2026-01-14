import { LayoutGrid, Plus, BarChart3 } from 'lucide-react';

export const BottomNav = ({ currentView, setView }: { currentView: string, setView: (v: string) => void }) => (
  <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
    <div className="flex items-center gap-4 bg-[#04233D]/90 backdrop-blur-xl p-3 rounded-[2.5rem] border border-white/10 shadow-2xl">
      <button 
        onClick={() => setView('dashboard')}
        className={`p-4 rounded-2xl transition-all ${currentView === 'dashboard' ? 'bg-primary-blue text-white' : 'text-slate-500'}`}
      >
        <LayoutGrid size={24} />
      </button>

      <button 
        onClick={() => setView('add')}
        className="p-5 bg-primary-blue text-white rounded-3xl shadow-lg shadow-blue-500/40 active:scale-90 transition-all"
      >
        <Plus size={28} />
      </button>

      <button 
        onClick={() => setView('analytics')}
        className={`p-4 rounded-2xl transition-all ${currentView === 'analytics' ? 'bg-primary-blue text-white' : 'text-slate-500'}`}
      >
        <BarChart3 size={24} />
      </button>
    </div>
  </nav>
);