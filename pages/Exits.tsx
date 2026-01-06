
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { MovType, MovCategory, PaymentMethod } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { AlertCircle, CheckCircle2, Package, Coins, Building2, Trash2 } from 'lucide-react';

const Exits: React.FC = () => {
  const { items, institutions, addMovement, movements, getStock, getDashboardStats } = useAppStore();
  const [activeTab, setActiveTab] = useState<MovCategory>('ITEM');
  
  const stats = getDashboardStats();
  const stock = getStock();

  // Form State
  const [formData, setFormData] = useState({
    destinationId: '',
    itemId: '',
    quantity: 0,
    unitValue: 0,
    valueMoney: 0,
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.destinationId) throw new Error('Selecione uma instituição de destino.');

      const payload = {
        type: 'SAÍDA' as MovType,
        category: activeTab,
        date: new Date(formData.date).toISOString(),
        destinationId: formData.destinationId,
        notes: formData.notes,
        totalValue: activeTab === 'ITEM' ? (formData.quantity * formData.unitValue) : formData.valueMoney,
        ...(activeTab === 'ITEM' ? {
          itemId: formData.itemId,
          quantity: formData.quantity,
          unitValue: formData.unitValue,
        } : {
          valueMoney: formData.valueMoney,
        })
      };

      addMovement(payload);
      setMessage({ type: 'success', text: 'Doação registrada com sucesso!' });
      
      // Reset
      setFormData({
        ...formData,
        itemId: '',
        quantity: 0,
        unitValue: 0,
        valueMoney: 0,
        notes: ''
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const recentExits = movements.filter(m => m.type === 'SAÍDA').slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Doar para Instituição</h2>
          <p className="text-slate-500 text-sm">Distribua recursos do estoque para as organizações parceiras.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('ITEM')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-colors ${
              activeTab === 'ITEM' ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Package size={20} /> Doação de Itens
          </button>
          <button 
            onClick={() => setActiveTab('DINHEIRO')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-colors ${
              activeTab === 'DINHEIRO' ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Coins size={20} /> Doação em Dinheiro
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Instituição Destino</label>
              <select 
                required
                value={formData.destinationId}
                onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
                className="p-2.5 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Selecione uma instituição...</option>
                {institutions.filter(i => i.active).map(i => (
                  <option key={i.id} value={i.id}>{i.name} ({i.cnpj})</option>
                ))}
              </select>
            </div>

            {activeTab === 'ITEM' ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Item em Estoque</label>
                  <select 
                    required
                    value={formData.itemId}
                    onChange={(e) => {
                      const item = items.find(i => i.id === e.target.value);
                      setFormData({ ...formData, itemId: e.target.value, unitValue: item?.referenceValue || 0 });
                    }}
                    className="p-2.5 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Selecione um item...</option>
                    {stock.map(s => {
                      const item = items.find(i => i.id === s.itemId);
                      return (
                        <option key={s.itemId} value={s.itemId} disabled={s.quantity <= 0}>
                          {item?.name} - Disponível: {s.quantity} {item?.unit}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Quantidade a Doar</label>
                  <input 
                    type="number" required min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="p-2.5 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {formData.itemId && (
                    <p className="text-[10px] text-blue-600 font-bold">
                      Saldo restante após doação: { (stock.find(s => s.itemId === formData.itemId)?.quantity || 0) - formData.quantity }
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Valor em Dinheiro (R$)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                  <input 
                    type="number" step="0.01" required
                    value={formData.valueMoney}
                    onChange={(e) => setFormData({ ...formData, valueMoney: Number(e.target.value) })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0,00"
                  />
                </div>
                <p className="text-xs text-slate-500">Saldo atual em caixa: <span className="font-bold text-slate-800">{formatCurrency(stats.cashBalance)}</span></p>
              </div>
            )}

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Data da Saída</label>
              <input 
                type="date" required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="p-2.5 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Finalidade/Observações</label>
              <textarea 
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="p-2.5 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Ex: Apoio emergencial para famílias da Vila X"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200">
            Confirmar Saída
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Saídas Recentes</h3>
        <div className="space-y-3">
          {recentExits.map((mov) => (
            <div key={mov.id} className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${mov.category === 'ITEM' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                  {mov.category === 'ITEM' ? <Package size={20} /> : <Coins size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">
                    {mov.category === 'ITEM' ? `${items.find(i => i.id === mov.itemId)?.name} (${mov.quantity} un)` : formatCurrency(mov.totalValue)}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Building2 size={12} /> {institutions.find(i => i.id === mov.destinationId)?.name} • {formatDate(mov.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">SAÍDA</span>
              </div>
            </div>
          ))}
          {recentExits.length === 0 && (
            <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
              Nenhuma doação registrada ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exits;
