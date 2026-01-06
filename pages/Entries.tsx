
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { MovType, MovCategory, PaymentMethod } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { AlertCircle, CheckCircle2, Package, Coins } from 'lucide-react';

const Entries: React.FC = () => {
  const { items, addMovement, movements } = useAppStore();
  const [activeTab, setActiveTab] = useState<MovCategory>('ITEM');
  
  // Form State
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 0,
    unitValue: 0,
    valueMoney: 0,
    paymentMethod: 'PIX' as PaymentMethod,
    donor: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        type: 'ENTRADA' as MovType,
        category: activeTab,
        date: new Date(formData.date).toISOString(),
        donor: formData.donor,
        notes: formData.notes,
        totalValue: activeTab === 'ITEM' ? (formData.quantity * formData.unitValue) : formData.valueMoney,
        ...(activeTab === 'ITEM' ? {
          itemId: formData.itemId,
          quantity: formData.quantity,
          unitValue: formData.unitValue,
        } : {
          valueMoney: formData.valueMoney,
          paymentMethod: formData.paymentMethod,
        })
      };

      addMovement(payload);
      setMessage({ type: 'success', text: 'Entrada registrada com sucesso!' });
      // Reset form
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

  const recentEntries = movements.filter(m => m.type === 'ENTRADA').slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Registrar Entrada</h2>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('ITEM')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-colors ${
              activeTab === 'ITEM' ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Package size={20} />
            Entrada de Itens
          </button>
          <button 
            onClick={() => setActiveTab('DINHEIRO')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-colors ${
              activeTab === 'DINHEIRO' ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Coins size={20} />
            Entrada de Dinheiro
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === 'ITEM' ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Item</label>
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
                    {items.filter(i => i.active).map(i => (
                      <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Quantidade</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="p-2.5 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Valor Unitário (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={formData.unitValue}
                    onChange={(e) => setFormData({ ...formData, unitValue: Number(e.target.value) })}
                    className="p-2.5 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 font-bold">Total Calculado</label>
                  <div className="p-2.5 rounded-lg border bg-blue-50 text-blue-800 font-bold">
                    {formatCurrency(formData.quantity * formData.unitValue)}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Valor (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={formData.valueMoney}
                    onChange={(e) => setFormData({ ...formData, valueMoney: Number(e.target.value) })}
                    className="p-2.5 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0,00"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Forma de Pagamento</label>
                  <select 
                    required
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                    className="p-2.5 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="PIX">PIX</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Transferência">Transferência</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Doador (Opcional)</label>
              <input 
                type="text" 
                value={formData.donor}
                onChange={(e) => setFormData({ ...formData, donor: e.target.value })}
                className="p-2.5 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nome da pessoa ou empresa"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Data</label>
              <input 
                type="date" 
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="p-2.5 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Observações</label>
            <textarea 
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="p-2.5 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Algum detalhe importante..."
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Confirmar Entrada
            </button>
          </div>
        </form>
      </div>

      {/* Recentes */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Entradas Recentes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentEntries.map((mov) => (
            <div key={mov.id} className="bg-white p-4 rounded-xl border shadow-sm flex items-start gap-4">
              <div className={`p-2 rounded-lg ${mov.category === 'ITEM' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {mov.category === 'ITEM' ? <Package size={20} /> : <Coins size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-800">
                    {mov.category === 'ITEM' ? items.find(i => i.id === mov.itemId)?.name : 'Doação em Dinheiro'}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(mov.date)}</span>
                </div>
                <div className="text-sm text-slate-500 mt-1 flex justify-between">
                  <span>{mov.category === 'ITEM' ? `${mov.quantity} unidades` : mov.paymentMethod}</span>
                  <span className="font-semibold text-slate-700">{formatCurrency(mov.totalValue)}</span>
                </div>
                {mov.donor && <p className="text-xs text-slate-400 mt-2">Doador: {mov.donor}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Entries;
