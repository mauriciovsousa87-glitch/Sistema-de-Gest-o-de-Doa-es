
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
  LabelList
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

  const COLORS = ['#3b82f6', '#10b981', '#EAB308', '#ef4444', '#8b5cf6'];

  // Prep Horizontal Bar Chart: Top Items in Stock
  const topItemsStock = stock
    .map(s => ({
      name: items.find(i => i.id === s.itemId)?.name || 'Desconhecido',
      quantity: s.quantity
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Prep Chart: Most Donated Items (Exits)
  const mostDonated = items.map(item => {
    const totalOut = movements
      .filter(m => m.type === 'SAÍDA' && m.category === 'ITEM' && m.itemId === item.id)
      .reduce((acc, curr) => acc + (curr.quantity || 0), 0);
    return { name: item.name, quantity: totalOut };
  })
  .filter(i => i.quantity > 0)
  .sort((a, b) => b.quantity - a.quantity)
  .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 pb-10">
      {/* Entries vs Exits Area Chart */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Fluxo Financeiro Mensal</h3>
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
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}/>
              <Area 
                name="Entradas" 
                type="monotone" 
                dataKey="ent" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorEnt)" 
                strokeWidth={3}
              />
              <Area 
                name="Saídas" 
                type="monotone" 
                dataKey="sai" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorSai)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock Category Distribution Pie */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Estoque por Categoria</h3>
        <div className="h-[300px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Items Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Top Itens em Estoque</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={topItemsStock} margin={{ left: 40, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'black', fill: '#64748b' }} width={100} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="quantity" fill="#001A33" radius={[0, 6, 6, 0]} barSize={24} name="Quantidade">
                <LabelList dataKey="quantity" position="right" style={{ fontSize: '11px', fontWeight: '900', fill: '#001A33' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Most Donated Items Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Itens Mais Doados (Ranking)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={mostDonated} margin={{ left: 40, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'black', fill: '#64748b' }} width={100} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="quantity" fill="#ef4444" radius={[0, 6, 6, 0]} barSize={24} name="Qtd. Doadas">
                <LabelList dataKey="quantity" position="right" style={{ fontSize: '11px', fontWeight: '900', fill: '#ef4444' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
