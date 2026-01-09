
import React, { useState, useMemo } from 'react';
import { Wallet, Package, Heart, Users, AlertTriangle, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, X, Calendar, ChevronDown } from 'lucide-react';
import { useAppStore } from '../store';
import { formatCurrency } from '../utils';
import { DashboardCharts } from '../components/DashboardCharts';

const KPICard = ({ label, value, trend, icon: Icon, color, subtext }: any) => (
  <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between group hover:border-[#EAB308] transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 ${trend.type === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend.type === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend.value}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</h3>
      <p className="text-2xl font-black text-[#001A33]">{value}</p>
      {subtext && <p className="text-xs text-slate-400 mt-2 italic font-medium">{subtext}</p>}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { movements, getStock, items, institutions, individuals } = useAppStore();
  const [showCriticalModal, setShowCriticalModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<'HOJE' | '7DIAS' | 'MES' | 'TUDO' | 'PERSONALIZADO'>('TUDO');
  
  // Custom Date States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredMovements = useMemo(() => {
    if (dateFilter === 'TUDO') return movements;
    const now = new Date();
    
    if (dateFilter === 'PERSONALIZADO') {
      if (!startDate && !endDate) return movements;
      return movements.filter(m => {
        const movDate = new Date(m.date);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        // Set end to end of day
        if (endDate) end.setHours(23, 59, 59, 999);
        return movDate >= start && movDate <= end;
      });
    }

    const filterDate = new Date();
    if (dateFilter === 'HOJE') filterDate.setHours(0,0,0,0);
    if (dateFilter === '7DIAS') filterDate.setDate(now.getDate() - 7);
    if (dateFilter === 'MES') filterDate.setDate(1);

    return movements.filter(m => new Date(m.date) >= filterDate);
  }, [movements, dateFilter, startDate, endDate]);

  const stats = useMemo(() => {
    const moneyIn = filteredMovements.filter(m => m.type === 'ENTRADA' && m.category === 'DINHEIRO').reduce((a, c) => a + (Number(c.valueMoney) || 0), 0);
    const moneyOut = filteredMovements.filter(m => m.type === 'SAÍDA' && m.category === 'DINHEIRO').reduce((a, c) => a + (Number(c.valueMoney) || 0), 0);
    const itemsInVal = filteredMovements.filter(m => m.type === 'ENTRADA' && m.category === 'ITEM').reduce((a, c) => a + (Number(c.totalValue) || 0), 0);
    const itemsOutVal = filteredMovements.filter(m => m.type === 'SAÍDA' && m.category === 'ITEM').reduce((a, c) => a + (Number(c.totalValue) || 0), 0);
    const itemsOutQty = filteredMovements.filter(m => m.type === 'SAÍDA' && m.category === 'ITEM').reduce((a, c) => a + (Number(c.quantity) || 0), 0);
    
    const stock = getStock();
    
    return {
      totalMoneyIn: moneyIn + itemsInVal,
      totalMoneyOut: moneyOut + itemsOutVal,
      cashBalance: moneyIn - moneyOut,
      totalItemsOut: itemsOutQty,
      estimatedStockValue: stock.reduce((a, c) => a + c.estimatedValue, 0),
      institutionsServed: institutions.length,
      individualsServed: individuals.length
    };
  }, [filteredMovements, getStock, institutions, individuals]);

  const stock = getStock();
  const criticalItems = stock.filter(s => s.lowStockAlert).map(s => ({
    ...s,
    item: items.find(i => i.id === s.itemId)
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#001A33] uppercase">Olá, Gestor We Care</h2>
          <p className="text-slate-500 text-sm">Monitoramento em tempo real do impacto social.</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex bg-white p-1 rounded-xl border shadow-sm self-end">
            {(['HOJE', '7DIAS', 'MES', 'TUDO', 'PERSONALIZADO'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setDateFilter(f)}
                className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                  dateFilter === f ? 'bg-[#001A33] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                {f === '7DIAS' ? '7 DIAS' : f === 'MES' ? 'MÊS' : f}
              </button>
            ))}
          </div>
          
          {dateFilter === 'PERSONALIZADO' && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300 self-end">
              <div className="flex flex-col gap-1">
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1 text-[10px] font-bold border rounded-lg bg-white outline-none focus:ring-1 focus:ring-[#001A33]"
                />
              </div>
              <span className="text-[10px] font-black text-slate-400">ATÉ</span>
              <div className="flex flex-col gap-1">
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1 text-[10px] font-bold border rounded-lg bg-white outline-none focus:ring-1 focus:ring-[#001A33]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard label="Saldo em Caixa" value={formatCurrency(stats.cashBalance)} icon={Wallet} color="bg-blue-600" />
        <KPICard label="Valor Total Arrecadado" value={formatCurrency(stats.totalMoneyIn)} icon={ArrowUpCircle} color="bg-emerald-600" />
        <KPICard label="Valor Total Doado" value={formatCurrency(stats.totalMoneyOut)} icon={ArrowDownCircle} color="bg-rose-600" />
        
        <KPICard label="Estoque Estimado" value={formatCurrency(stats.estimatedStockValue)} icon={Package} color="bg-yellow-600" />
        <KPICard label="Itens Doados no Período" value={stats.totalItemsOut.toLocaleString()} icon={Heart} color="bg-red-600" />
        <KPICard 
          label="Beneficiários Cadastrados" 
          value={(stats.institutionsServed + stats.individualsServed).toString()} 
          icon={Users} 
          color="bg-indigo-600" 
          subtext={`${stats.institutionsServed} Instituições e ${stats.individualsServed} Pessoas`} 
        />
      </div>

      {criticalItems.length > 0 && (
        <button 
          onClick={() => setShowCriticalModal(true)}
          className="w-full bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between group hover:bg-amber-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-amber-500 shrink-0" />
            <p className="text-amber-800 text-sm font-bold text-left">
              Atenção: {criticalItems.length} itens precisam de reposição imediata no estoque.
            </p>
          </div>
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm border border-amber-200">Ver Itens</span>
        </button>
      )}

      {showCriticalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowCriticalModal(false)}>
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="bg-[#001A33] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-[#EAB308]" />
                <h3 className="font-black text-lg uppercase">Reposição Crítica</h3>
              </div>
              <button onClick={() => setShowCriticalModal(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                {criticalItems.map((s) => (
                  <div key={s.itemId} className="flex items-center justify-between p-4 rounded-2xl border bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center text-[#001A33]">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{s.item?.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Mínimo: {s.minStock} {s.item?.unit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-amber-600">{s.quantity}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Saldo</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <DashboardCharts movements={filteredMovements} stock={stock} items={items} />
    </div>
  );
};

export default Dashboard;
