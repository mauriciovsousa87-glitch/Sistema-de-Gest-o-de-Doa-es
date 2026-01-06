
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { formatCurrency, formatDate } from '../utils';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Search, 
  Package, 
  Coins, 
  Building2,
  Calendar,
  Wallet,
  Trash2,
  AlertCircle,
  Loader2,
  User
} from 'lucide-react';

const Financial: React.FC = () => {
  const { movements, items, institutions, individuals, getDashboardStats, deleteMovement } = useAppStore();
  const stats = getDashboardStats();
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'TODOS' | 'ENTRADA' | 'SAÍDA'>('TODOS');

  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      const matchType = typeFilter === 'TODOS' || m.type === typeFilter;
      const item = m.itemId ? items.find(i => i.id === m.itemId) : null;
      const itemName = item?.name || '';
      const donorName = m.donor || '';
      const instName = m.destinationId ? institutions.find(i => i.id === m.destinationId)?.name || '' : '';
      const indName = m.recipientId ? individuals.find(i => i.id === m.recipientId)?.name || '' : '';
      
      const matchSearch = 
        itemName.toLowerCase().includes(search.toLowerCase()) ||
        donorName.toLowerCase().includes(search.toLowerCase()) ||
        instName.toLowerCase().includes(search.toLowerCase()) ||
        indName.toLowerCase().includes(search.toLowerCase()) ||
        (m.notes || '').toLowerCase().includes(search.toLowerCase());
      
      return matchType && matchSearch;
    });
  }, [movements, typeFilter, search, items, institutions, individuals]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Histórico Financeiro</h2>
          <p className="text-slate-500 text-sm">Registro completo de fluxos de caixa e valor de mercadorias.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Saldo em Caixa" value={stats.cashBalance} icon={Wallet} color="blue" />
        <StatCard label="Total Entradas" value={stats.totalMoneyIn} icon={ArrowUpCircle} color="green" />
        <StatCard label="Total Saídas" value={stats.totalMoneyOut} icon={ArrowDownCircle} color="red" />
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por item, doador, destino ou nota..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-slate-50 outline-none text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          {(['TODOS', 'ENTRADA', 'SAÍDA'] as const).map(f => (
            <button 
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-md transition-all ${typeFilter === f ? 'bg-white text-[#001A33] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {f === 'TODOS' ? 'Todos' : f + 'S'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Origem / Destino</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredMovements.map((mov) => (
                <MovementRow 
                  key={mov.id} 
                  mov={mov} 
                  items={items} 
                  institutions={institutions} 
                  individuals={individuals}
                  onDelete={deleteMovement} 
                />
              ))}
              {filteredMovements.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MovementRow = ({ mov, items, institutions, individuals, onDelete }: any) => {
  const [deleteStage, setDeleteStage] = useState<'idle' | 'armed' | 'processing'>('idle');

  const item = mov.itemId ? items.find((i: any) => i.id === mov.itemId) : null;
  const inst = mov.destinationId ? institutions.find((i: any) => i.id === mov.destinationId) : null;
  const ind = mov.recipientId ? individuals.find((i: any) => i.id === mov.recipientId) : null;

  const handleDelete = async () => {
    if (deleteStage === 'idle') {
      setDeleteStage('armed');
      setTimeout(() => setDeleteStage('idle'), 4000);
      return;
    }
    if (deleteStage === 'armed') {
      setDeleteStage('processing');
      try {
        await onDelete(mov.id);
      } catch (error) {
        setDeleteStage('idle');
        alert("Erro ao excluir transação.");
      }
    }
  };

  return (
    <tr className={`hover:bg-slate-50 transition-colors ${deleteStage === 'armed' ? 'bg-red-50' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">
        {formatDate(mov.date)}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
          mov.type === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {mov.type}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">
            {mov.category === 'ITEM' ? (item?.name || 'Item Removido') : 'Doação em Dinheiro'}
          </span>
          {mov.category === 'ITEM' && (
            <span className="text-[10px] text-slate-400 font-bold uppercase">{mov.quantity} {item?.unit} x {formatCurrency(mov.unitValue || 0)}</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600">
        <div className="flex items-center gap-2 text-xs font-medium">
          {mov.type === 'ENTRADA' ? (
            <><div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] border font-bold">D</div> {mov.donor || 'Anônimo'}</>
          ) : (
            <>{inst ? <Building2 size={14} className="text-slate-400" /> : <User size={14} className="text-slate-400" />} {inst?.name || ind?.name || 'Não identificado'}</>
          )}
        </div>
      </td>
      <td className={`px-6 py-4 text-right font-black ${mov.type === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
        {mov.type === 'ENTRADA' ? '+' : '-'}{formatCurrency(mov.totalValue)}
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center">
          <button 
            onClick={handleDelete}
            disabled={deleteStage === 'processing'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
              deleteStage === 'idle' ? 'text-slate-300 hover:text-red-500' : 
              deleteStage === 'armed' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {deleteStage === 'idle' && <Trash2 size={16} />}
            {deleteStage === 'armed' && <><AlertCircle size={14} /> CONFIRMA?</>}
            {deleteStage === 'processing' && <Loader2 className="animate-spin" size={14} />}
          </button>
        </div>
      </td>
    </tr>
  );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => {
  const colorMap = {
    blue: 'border-l-blue-600 text-blue-600',
    green: 'border-l-green-600 text-green-600',
    red: 'border-l-red-600 text-red-600'
  };
  return (
    <div className={`bg-white p-5 rounded-xl border shadow-sm border-l-4 ${colorMap[color as keyof typeof colorMap]}`}>
      <div className="flex items-center gap-3 mb-2 opacity-80">
        <Icon size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <h3 className="text-2xl font-black text-slate-800">{formatCurrency(value)}</h3>
    </div>
  );
};

export default Financial;
