
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Category, Unit, Item } from '../types';
import { Package, Plus, Search, Trash2, Edit2, Loader2, AlertCircle, X } from 'lucide-react';
import { formatCurrency } from '../utils';

const Items: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
      if (editingId) {
        await updateItem(editingId, formData);
      } else {
        await addItem(formData);
      }
      handleCancel();
    } catch (error) {
      alert("Erro ao salvar item.");
    }
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      unit: item.unit,
      referenceValue: item.referenceValue,
      imageUrl: item.imageUrl || '',
      description: item.description || '',
      active: item.active
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '', category: 'Alimentos', unit: 'un', referenceValue: 0, imageUrl: '', description: '', active: true
    });
  };

  const filteredItems = items.filter(item => 
    (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Catálogo de Itens</h2>
          <p className="text-slate-500 text-sm">Gerencie o portfólio de doações.</p>
        </div>
        <button 
          onClick={() => showForm ? handleCancel() : setShowForm(true)}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
            showForm ? 'bg-slate-200 text-slate-600' : 'bg-[#001A33] text-white shadow-lg shadow-blue-900/20'
          }`}
        >
          {showForm ? <><X size={20} /> Cancelar</> : <><Plus size={20} /> Novo Item</>}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             {editingId ? <Edit2 size={20} className="text-[#EAB308]" /> : <Plus size={20} className="text-[#EAB308]" />}
             {editingId ? 'Editar Item' : 'Novo Cadastro de Item'}
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nome</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-3 border rounded-xl bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-[#001A33]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Categoria</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})} className="p-3 border rounded-xl bg-slate-50 text-sm outline-none">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Unidade</label>
                <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value as Unit})} className="p-3 border rounded-xl bg-slate-50 text-sm outline-none">
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Valor Ref (R$)</label>
              <input type="number" step="0.01" value={formData.referenceValue} onChange={e => setFormData({...formData, referenceValue: Number(e.target.value)})} className="p-3 border rounded-xl bg-slate-50 text-sm outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Imagem URL</label>
              <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="p-3 border rounded-xl bg-slate-50 text-sm outline-none" />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#EAB308] text-[#001A33] font-black py-4 rounded-xl shadow-xl hover:opacity-90">
            {editingId ? 'ATUALIZAR ITEM' : 'SALVAR NO CATÁLOGO'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Buscar por nome ou categoria..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white outline-none shadow-sm" />
          </div>

          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Valor Ref.</th>
                    <th className="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {filteredItems.map(item => (
                    <ItemRow key={item.id} item={item} onEdit={handleEdit} onDelete={deleteItem} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ItemRow = ({ item, onEdit, onDelete }: any) => {
  const [deleteStage, setDeleteStage] = useState<'idle' | 'armed' | 'processing'>('idle');

  const handleDelete = async () => {
    if (deleteStage === 'idle') {
      setDeleteStage('armed');
      setTimeout(() => setDeleteStage('idle'), 4000);
      return;
    }
    if (deleteStage === 'armed') {
      setDeleteStage('processing');
      try {
        await onDelete(item.id);
      } catch (error) {
        setDeleteStage('idle');
        alert("Não foi possível excluir. Existem registros de estoque vinculados.");
      }
    }
  };

  return (
    <tr className={`hover:bg-slate-50 transition-colors ${deleteStage === 'armed' ? 'bg-red-50/30' : ''}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
            {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover rounded" /> : <Package className="text-slate-400" size={16} />}
          </div>
          <span className="font-bold text-slate-800">{item.name}</span>
        </div>
      </td>
      <td className="px-6 py-4"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase">{item.category}</span></td>
      <td className="px-6 py-4 font-bold text-slate-700">{formatCurrency(item.referenceValue)}</td>
      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">
          <button 
            onClick={() => onEdit(item)}
            className="p-2 text-slate-400 hover:text-[#001A33] hover:bg-slate-100 rounded-lg transition-all"
            title="Editar Item"
          >
            <Edit2 size={16} />
          </button>
          
          <button 
            onClick={handleDelete}
            disabled={deleteStage === 'processing'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
              deleteStage === 'idle' ? 'text-slate-300 hover:text-red-500 hover:bg-red-50' : 
              deleteStage === 'armed' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {deleteStage === 'idle' && <Trash2 size={16} />}
            {deleteStage === 'armed' && <><AlertCircle size={14} /> CONFIRMA?</>}
            {deleteStage === 'processing' && <Loader2 className="animate-spin" size={14} />}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Items;
