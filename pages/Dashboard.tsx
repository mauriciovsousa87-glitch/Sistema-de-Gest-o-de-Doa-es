
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Package, 
  Heart, 
  Building2, 
  AlertTriangle 
} from 'lucide-react';
import { useAppStore } from '../store';
import { formatCurrency } from '../utils';
import { DashboardCharts } from '../components/DashboardCharts';

const KPICard = ({ 
  label, 
  value, 
  trend, 
  icon: Icon, 
  color,
  subtext
}: { 
  label: string; 
  value: string | number; 
  trend?: { type: 'up' | 'down', value: string }; 
  icon: any; 
  color: string;
  subtext?: string;
}) => (
  <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
          trend.type === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {trend.type === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend.value}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{label}</h3>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  // Fixed: Added 'institutions' to destructured store values
  const { getDashboardStats, movements, getStock, items, institutions } = useAppStore();
  const stats = getDashboardStats();
  const stock = getStock();

  const lowStockCount = stock.filter(s => s.lowStockAlert).length;

  return (
    <div className="space-y-6">
      {/* Welcome & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Olá, Administrador</h2>
          <p className="text-slate-500 text-sm">Bem-vindo ao painel de controle de doações.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
          <button className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-md">Este Mês</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-md">Último Trimestre</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-md">Personalizado</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          label="Saldo em Caixa" 
          value={formatCurrency(stats.cashBalance)} 
          icon={Wallet} 
          color="bg-blue-600"
          trend={{ type: 'up', value: '12%' }}
          subtext="Entradas líquidas este mês"
        />
        <KPICard 
          label="Estoque Estimado" 
          value={formatCurrency(stats.estimatedStockValue)} 
          icon={Package} 
          color="bg-purple-600"
          subtext={`${stock.reduce((a, b) => a + b.quantity, 0)} itens totais`}
        />
        <KPICard 
          label="Itens Doados" 
          value={stats.totalItemsOut.toLocaleString()} 
          icon={Heart} 
          color="bg-pink-600"
          trend={{ type: 'up', value: '5%' }}
          subtext="Unidades totais"
        />
        <KPICard 
          label="Instituições Atendidas" 
          value={stats.institutionsServed} 
          icon={Building2} 
          color="bg-emerald-600"
          subtext="Parcerias ativas"
        />
      </div>

      {/* Warnings & Quick Actions */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="text-amber-500 shrink-0" />
          <p className="text-amber-800 text-sm font-medium">
            Existem {lowStockCount} itens com estoque abaixo do mínimo. <button className="underline hover:text-amber-900">Ver Itens</button>
          </p>
        </div>
      )}

      {/* Charts Section */}
      <DashboardCharts movements={movements} stock={stock} items={items} />

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Atividades Recentes</h3>
          <button className="text-sm text-blue-600 font-medium hover:underline">Ver todas</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Item / Valor</th>
                <th className="px-6 py-3">Doador / Destino</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {movements.slice(0, 5).map((mov) => (
                <tr key={mov.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      mov.type === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {mov.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {mov.category === 'ITEM' ? (
                      `${items.find(i => i.id === mov.itemId)?.name} (${mov.quantity} un)`
                    ) : (
                      formatCurrency(mov.valueMoney || 0)
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {/* Fixed: Replaced SEED_INSTITUTIONS with 'institutions' from store */}
                    {mov.type === 'ENTRADA' ? mov.donor : 'Para ' + (institutions.find(i => i.id === mov.destinationId)?.name || '...') }
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Intl.DateTimeFormat('pt-BR').format(new Date(mov.date))}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      Processado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
