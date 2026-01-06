
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Movement, StockInfo, Item } from '../types';

interface ChartsProps {
  movements: Movement[];
  stock: StockInfo[];
  items: Item[];
}

export const DashboardCharts: React.FC<ChartsProps> = ({ movements, stock, items }) => {
  // Prep Area Chart: Entries vs Exits over time
  const areaData = [
    { name: 'Jan', ent: 400, sai: 240 },
    { name: 'Fev', ent: 300, sai: 139 },
    { name: 'Mar', ent: 200, sai: 980 },
    { name: 'Abr', ent: 278, sai: 390 },
    { name: 'Mai', ent: 189, sai: 480 },
    { name: 'Jun', ent: 239, sai: 380 },
  ];

  // Prep Pie Chart: Distribution by category
  const categoryData = items.reduce((acc: any[], item) => {
    const s = stock.find(st => st.itemId === item.id);
    if (!s) return acc;
    const existing = acc.find(a => a.name === item.category);
    if (existing) {
      existing.value += s.quantity;
    } else {
      acc.push({ name: item.category, value: s.quantity });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Prep Horizontal Bar Chart: Top Items
  const topItems = stock
    .map(s => ({
      name: items.find(i => i.id === s.itemId)?.name || 'Desconhecido',
      quantity: s.quantity
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Entries vs Exits Area Chart */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Entradas vs Saídas (Financeiro)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorEnt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSai" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" height={36}/>
              <Area 
                name="Entradas" 
                type="monotone" 
                dataKey="ent" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorEnt)" 
                strokeWidth={2}
              />
              <Area 
                name="Saídas" 
                type="monotone" 
                dataKey="sai" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorSai)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock Category Distribution Pie */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Estoque por Categoria</h3>
        <div className="h-[300px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Items Bar Chart */}
      <div className="bg-white p-6 rounded-xl border shadow-sm lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Top Itens em Estoque</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={topItems} margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="quantity" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
