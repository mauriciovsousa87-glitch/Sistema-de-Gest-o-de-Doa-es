
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Category, Unit } from '../types';
import { Package, Plus, Search, Trash2, Edit3, Image as ImageIcon, Info } from 'lucide-react';
import { formatCurrency } from '../utils';

const Items: React.FC = () => {
  const { items, addItem, loading } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Alimentos' as Category,
    unit: 'un' as Unit,
    referenceValue: 0,
    imageUrl: '',
    description: '',
    active: true
  });

  const categories: Category[] = ['Alimentos', 'Higiene', 'Roupa', 'Outros'];
  const units: Unit[] = ['un', 'kg', 'pacote', 'caixa'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addItem(formData);
      setShowForm(false);
      setFormData({
        name: '',
        category: 'Alimentos',
        unit: 'un',
        referenceValue: 0,
        imageUrl: '',
        description: '',
        active: true
      });
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      alert("Erro ao salvar item. Verifique sua conexão.");
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Catálogo de Itens</h2>
          <p className="text-slate-500 text-sm">Gerencie os produtos e recursos disponíveis para doação.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          {showForm ? 'Cancelar' : <><Plus size={20} /> Novo Item</>}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <Package size={20} className="text-blue-600" /> Detalhes do Novo Item
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Nome do Item</label>
              <input 
                required 
                type="text" 
                placeholder="Ex: Cesta Básica Tipo 1"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Categoria</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value as Category})} 
                  className="p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Unidade</label>
                <select 
                  value={formData.unit} 
                  onChange={e => setFormData({...formData, unit: e.target.value as Unit})} 
                  className="p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Valor de Referência (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">R$</span>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={formData.referenceValue} 
                  onChange={e => setFormData({...formData, referenceValue: Number(e.target.value)})} 
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <p className="text-[10px] text-slate-400 italic">Valor estimado para fins de relatório de transparência.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">URL da Imagem (Opcional)</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="url" 
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={formData.imageUrl} 
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Descrição/Conteúdo</label>
              <textarea 
                rows={3} 
                placeholder="Detalhes sobre o que compõe este item..."
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Salvar Item no Catálogo
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou categoria..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Unidade</th>
                    <th className="px-6 py-4">Valor Ref.</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="text-slate-400" size={20} />
                            )}
                          </div>
                          <span className="font-bold text-slate-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {item.unit}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {formatCurrency(item.referenceValue)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]" title={item.description}>
                          {item.description || 'Sem descrição'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit3 size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                        Nenhum item cadastrado ou encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Dica de Uso */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
        <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-800">
          <p className="font-bold">Como funciona:</p>
          <p>Os itens cadastrados aqui aparecerão automaticamente nas abas de <strong>Entrada de Doações</strong> e <strong>Saída para Instituições</strong>, permitindo o controle rigoroso do estoque.</p>
        </div>
      </div>
    </div>
  );
};

export default Items;
