
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { formatCurrency, formatDate } from '../utils';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Search, 
  Filter, 
  Download, 
  Package, 
  Coins, 
  Building2,
  Calendar,
  Wallet
} from 'lucide-react';

const Financial: React.FC = () => {
  const { movements, items, institutions, getDashboardStats } = useAppStore();
  const stats = getDashboardStats();
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'TODOS' | 'ENTRADA' | 'SAÍDA'>('TODOS');

  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      const matchType = typeFilter === 'TODOS' || m.type === typeFilter;
      const itemName = m.itemId ? items.find(i => i.id === m.itemId)?.name || '' : '';
      const donorOrInst = m.type === 'ENTRADA' ? (m.donor || '') : (institutions.find(i => i.id === m.destinationId)?.name || '');
      
      const matchSearch = 
        itemName.toLowerCase().includes(search.toLowerCase()) ||
        donorOrInst.toLowerCase().includes(search.toLowerCase()) ||
        (m.notes || '').toLowerCase().includes(search.toLowerCase());
      
      return matchType && matchSearch;
    });
  }, [movements, typeFilter, search, items, institutions]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Resumo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Histórico Financeiro</h2>
          <p className="text-slate-500 text-sm">Registro completo de fluxos de caixa e valor de mercadorias.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700">
          <Download size={18} />
          Exportar Extrato
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm border-l-4 border-l-blue-600">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <Wallet size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">Saldo em Caixa</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats.cashBalance)}</h3>
          <p className="text-xs text-slate-400 mt-1">Disponível para doações financeiras</p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm border-l-4 border-l-green-600">
          <div className="flex items-center gap-3 text-green-600 mb-2">
            <ArrowUpCircle size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">Total Entradas</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats.totalMoneyIn)}</h3>
          <p className="text-xs text-slate-400 mt-1">Acumulado de doações recebidas</p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm border-l-4 border-l-red-600">
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <ArrowDownCircle size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">Total Saídas</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats.totalMoneyOut)}</h3>
          <p className="text-xs text-slate-400 mt-1">Repasses para instituições</p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por item, doador, destino ou nota..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setTypeFilter('TODOS')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${typeFilter === 'TODOS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setTypeFilter('ENTRADA')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${typeFilter === 'ENTRADA' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Entradas
          </button>
          <button 
            onClick={() => setTypeFilter('SAÍDA')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${typeFilter === 'SAÍDA' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Saídas
          </button>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Origem / Destino</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredMovements.map((mov) => {
                const item = mov.itemId ? items.find(i => i.id === mov.itemId) : null;
                const inst = mov.destinationId ? institutions.find(i => i.id === mov.destinationId) : null;
                
                return (
                  <tr key={mov.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {formatDate(mov.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        mov.type === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {mov.type === 'ENTRADA' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                        {mov.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">
                          {mov.category === 'ITEM' ? (item?.name || 'Item Removido') : 'Doação Financeira'}
                        </span>
                        {mov.category === 'ITEM' && (
                          <span className="text-xs text-slate-400">{mov.quantity} {item?.unit} x {formatCurrency(mov.unitValue || 0)}</span>
                        )}
                        {mov.notes && <span className="text-[10px] text-slate-400 italic truncate max-w-[200px]">{mov.notes}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        {mov.type === 'ENTRADA' ? (
                          <><UserAvatar name={mov.donor || 'Anônimo'} /> {mov.donor || 'Doador Anônimo'}</>
                        ) : (
                          <><Building2 size={14} className="text-slate-400" /> {inst?.name || 'Inst. Removida'}</>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {mov.category === 'ITEM' ? (
                          <><Package size={14} className="text-blue-500" /> <span className="text-blue-600 font-medium">Produto</span></>
                        ) : (
                          <><Coins size={14} className="text-emerald-500" /> <span className="text-emerald-600 font-medium">Dinheiro</span></>
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold text-lg ${mov.type === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                      {mov.type === 'ENTRADA' ? '+' : '-'}{formatCurrency(mov.totalValue)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        Confirmado
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredMovements.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                    Nenhuma transação encontrada para os filtros aplicados.
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

const UserAvatar = ({ name }: { name: string }) => (
  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border">
    {name.charAt(0).toUpperCase()}
  </div>
);

export default Financial;
