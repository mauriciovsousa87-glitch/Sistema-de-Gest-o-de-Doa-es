
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { formatCurrency } from '../utils';
import { Search, Filter, AlertTriangle, ArrowUpRight, Download, Package } from 'lucide-react';

const Stock: React.FC = () => {
  const { items, getStock } = useAppStore();
  const stock = getStock();
  const [search, setSearch] = useState('');
  const [filterLow, setFilterLow] = useState(false);

  const filteredStock = stock
    .map(s => ({
      ...s,
      item: items.find(i => i.id === s.itemId)
    }))
    .filter(s => {
      const matchSearch = s.item?.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filterLow ? s.lowStockAlert : true;
      return matchSearch && matchFilter;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Controle de Estoque</h2>
          <p className="text-slate-500 text-sm">Gerencie o saldo atual de todos os itens cadastrados.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700">
          <Download size={18} />
          Exportar Relatório
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome do item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button 
          onClick={() => setFilterLow(!filterLow)}
          className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-all ${
            filterLow ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Filter size={20} />
          {filterLow ? 'Mostrando Apenas Alertas' : 'Filtrar Alertas'}
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-center">Saldo Atual</th>
                <th className="px-6 py-4 text-center">Estoque Mín.</th>
                <th className="px-6 py-4">Valor Estimado</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredStock.map((s) => (
                <tr key={s.itemId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                        {s.item?.imageUrl ? (
                          <img src={s.item.imageUrl} alt={s.item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="text-slate-400" size={20} />
                        )}
                      </div>
                      <span className="font-semibold text-slate-800">{s.item?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                      {s.item?.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-bold text-lg ${s.quantity <= s.minStock ? 'text-amber-600' : 'text-blue-600'}`}>
                      {s.quantity} <span className="text-xs font-normal text-slate-400">{s.item?.unit}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-500">
                    {s.minStock} {s.item?.unit}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {formatCurrency(s.estimatedValue)}
                  </td>
                  <td className="px-6 py-4">
                    {s.lowStockAlert ? (
                      <span className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-full w-fit">
                        <AlertTriangle size={14} />
                        Baixo Estoque
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full w-fit">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredStock.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    Nenhum item encontrado no estoque.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-slate-500">Valor Total em Estoque</p>
          <div className="mt-2 flex items-end justify-between">
            <h4 className="text-2xl font-bold text-slate-800">
              {formatCurrency(stock.reduce((acc, curr) => acc + curr.estimatedValue, 0))}
            </h4>
            <div className="text-green-600 flex items-center text-xs font-bold">
              <ArrowUpRight size={14} />
              +2.4%
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total de Unidades</p>
          <div className="mt-2 flex items-end justify-between">
            <h4 className="text-2xl font-bold text-slate-800">
              {stock.reduce((acc, curr) => acc + curr.quantity, 0).toLocaleString()}
            </h4>
            <div className="text-slate-400 text-xs">Itens Físicos</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-slate-500">Alertas Ativos</p>
          <div className="mt-2 flex items-end justify-between">
            <h4 className={`text-2xl font-bold ${filteredStock.filter(s => s.lowStockAlert).length > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              {filteredStock.filter(s => s.lowStockAlert).length}
            </h4>
            <div className="text-slate-400 text-xs">Reposição Sugerida</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;
