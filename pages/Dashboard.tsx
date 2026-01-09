
import React from 'react';
import { Wallet, Package, Heart, Users, AlertTriangle, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
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
  const { getDashboardStats, movements, getStock, items } = useAppStore();
  const stats = getDashboardStats();
  const stock = getStock();
  const lowStockCount = stock.filter(s => s.lowStockAlert).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#001A33] uppercase">Olá, Gestor We Care</h2>
          <p className="text-slate-500 text-sm">Monitoramento em tempo real do impacto social.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard label="Saldo em Caixa" value={formatCurrency(stats.cashBalance)} icon={Wallet} color="bg-blue-600" />
        <KPICard label="Valor Total Arrecadado" value={formatCurrency(stats.totalMoneyIn)} icon={ArrowUpCircle} color="bg-emerald-600" />
        <KPICard label="Valor Total Doado" value={formatCurrency(stats.totalMoneyOut)} icon={ArrowDownCircle} color="bg-rose-600" />
        
        <KPICard label="Estoque Estimado" value={formatCurrency(stats.estimatedStockValue)} icon={Package} color="bg-yellow-600" />
        <KPICard label="Itens Doados" value={stats.totalItemsOut.toLocaleString()} icon={Heart} color="bg-red-600" />
        <KPICard 
          label="Beneficiários" 
          value={(stats.institutionsServed + stats.individualsServed).toString()} 
          icon={Users} 
          color="bg-indigo-600" 
          subtext={`${stats.institutionsServed} Instituições (PJ) e ${stats.individualsServed} Pessoas (PF)`} 
        />
      </div>

      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 animate-pulse">
          <AlertTriangle className="text-amber-500 shrink-0" />
          <p className="text-amber-800 text-sm font-bold">Atenção: {lowStockCount} itens precisam de reposição imediata no estoque.</p>
        </div>
      )}

      <DashboardCharts movements={movements} stock={stock} items={items} />
    </div>
  );
};

export default Dashboard;
