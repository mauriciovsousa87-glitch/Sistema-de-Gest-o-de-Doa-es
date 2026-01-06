
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { MovType, MovCategory } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { AlertCircle, CheckCircle2, Package, Coins, Building2, User } from 'lucide-react';

const Exits: React.FC = () => {
  const { items, institutions, individuals, addMovement, movements, getStock, getDashboardStats } = useAppStore();
  const [activeTab, setActiveTab] = useState<MovCategory>('ITEM');
  const [recipientType, setRecipientType] = useState<'PJ' | 'PF'>('PJ');
  
  const stats = getDashboardStats();
  const stock = getStock();

  const [formData, setFormData] = useState({
    recipientId: '',
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
      if (!formData.recipientId) throw new Error('Selecione um destinatário.');

      const payload = {
        type: 'SAÍDA' as MovType,
        category: activeTab,
        date: new Date(formData.date).toISOString(),
        notes: formData.notes,
        totalValue: activeTab === 'ITEM' ? (formData.quantity * formData.unitValue) : formData.valueMoney,
        ...(recipientType === 'PJ' ? { destinationId: formData.recipientId } : { recipientId: formData.recipientId }),
        ...(activeTab === 'ITEM' ? {
          itemId: formData.itemId,
          quantity: formData.quantity,
          unitValue: formData.unitValue,
        } : {
          valueMoney: formData.valueMoney,
        })
      };

      addMovement(payload);
      setMessage({ type: 'success', text: 'Saída registrada com sucesso!' });
      setFormData({ ...formData, itemId: '', quantity: 0, unitValue: 0, valueMoney: 0, notes: '' });
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
          <h2 className="text-2xl font-bold text-[#001A33]">Registrar Doação (Saída)</h2>
          <p className="text-slate-500 text-sm">Encaminhe recursos para quem precisa.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button onClick={() => setActiveTab('ITEM')} className={`flex-1 py-4 font-bold ${activeTab === 'ITEM' ? 'text-[#001A33] border-b-4 border-[#EAB308] bg-yellow-50/30' : 'text-slate-400'}`}>ITENS</button>
          <button onClick={() => setActiveTab('DINHEIRO')} className={`flex-1 py-4 font-bold ${activeTab === 'DINHEIRO' ? 'text-[#001A33] border-b-4 border-[#EAB308] bg-yellow-50/30' : 'text-slate-400'}`}>DINHEIRO</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
              <span className="text-sm font-bold">{message.text}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex gap-4">
               <button type="button" onClick={() => { setRecipientType('PJ'); setFormData({...formData, recipientId: ''})}} className={`flex-1 p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${recipientType === 'PJ' ? 'border-[#001A33] bg-[#001A33]/5' : 'border-slate-100 opacity-50'}`}>
                 <Building2 size={24} /> <span className="text-xs font-bold">PARA INSTITUIÇÃO</span>
               </button>
               <button type="button" onClick={() => { setRecipientType('PF'); setFormData({...formData, recipientId: ''})}} className={`flex-1 p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${recipientType === 'PF' ? 'border-[#001A33] bg-[#001A33]/5' : 'border-slate-100 opacity-50'}`}>
                 <User size={24} /> <span className="text-xs font-bold">PARA PESSOA FÍSICA</span>
               </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Selecione o Destinatário</label>
              <select required value={formData.recipientId} onChange={e => setFormData({...formData, recipientId: e.target.value})} className="p-3 rounded-xl border bg-slate-50 outline-none focus:ring-2 focus:ring-[#001A33]">
                <option value="">Escolha um {recipientType === 'PJ' ? 'Cadastro PJ' : 'CPF Cadastrado'}...</option>
                {recipientType === 'PJ' ? institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>) : individuals.map(i => <option key={i.id} value={i.id}>{i.name} ({i.cpf})</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === 'ITEM' ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">Item</label>
                  <select required value={formData.itemId} onChange={e => { const i = items.find(it => it.id === e.target.value); setFormData({...formData, itemId: e.target.value, unitValue: i?.referenceValue || 0})}} className="p-3 border rounded-xl bg-slate-50 outline-none">
                    <option value="">Selecione...</option>
                    {stock.map(s => <option key={s.itemId} value={s.itemId} disabled={s.quantity <= 0}>{items.find(i => i.id === s.itemId)?.name} ({s.quantity} disp.)</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">Quantidade</label>
                  <input type="number" required min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="p-3 border rounded-xl bg-slate-50 outline-none" />
                </div>
              </>
            ) : (
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Valor Financeiro (R$)</label>
                <input type="number" step="0.01" required value={formData.valueMoney} onChange={e => setFormData({...formData, valueMoney: Number(e.target.value)})} className="p-3 border rounded-xl bg-slate-50 outline-none" />
                <p className="text-xs text-slate-400">Saldo disponível: {formatCurrency(stats.cashBalance)}</p>
              </div>
            )}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Data</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="p-3 border rounded-xl bg-slate-50 outline-none" />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#001A33] text-[#EAB308] font-black py-4 rounded-xl shadow-xl hover:opacity-95 transition-all text-lg">
            CONFIRMAR DOAÇÃO
          </button>
        </form>
      </div>
    </div>
  );
};

export default Exits;
