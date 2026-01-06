
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { Institution, Individual } from '../types';
import { Building2, Plus, Search, User, Phone, Mail, MapPin, Inbox, Loader2, Trash2, AlertCircle, Check } from 'lucide-react';
import { formatCNPJ, formatPhone } from '../utils';

const Beneficiaries: React.FC = () => {
  const { institutions, individuals, addInstitution, addIndividual, deleteInstitution, deleteIndividual, loading } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [beneficiaryType, setBeneficiaryType] = useState<'PJ' | 'PF'>('PJ');
  const [search, setSearch] = useState('');

  const [formPJ, setFormPJ] = useState<Omit<Institution, 'id' | 'active'>>({
    name: '', type: 'ONG', cnpj: '', phone: '', email: '',
    address: { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '' },
    responsible: { name: '', position: '', phone: '', email: '' },
    objective: '', areaOfActivity: 'Assistência Social', activitiesDescription: '',
    partnershipType: 'Doação de recursos', partnershipFrequency: 'Periódica',
    hasPastExperience: false, pastExperienceDescription: '', notes: ''
  });

  const [formPF, setFormPF] = useState<Omit<Individual, 'id' | 'active'>>({
    name: '', cpf: '', phone: '', email: '', notes: '',
    address: { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '' }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (beneficiaryType === 'PJ') {
        await addInstitution({ ...formPJ, active: true });
      } else {
        await addIndividual({ ...formPF, active: true });
      }
      setShowForm(false);
      setSearch('');
    } catch (error: any) {
      console.error("Erro no formulário:", error);
      alert(`Erro ao salvar: ${error.message || 'Verifique sua conexão.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPJ = useMemo(() => institutions.filter(i => 
    (i.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (i.cnpj || '').includes(search)
  ), [institutions, search]);

  const filteredPF = useMemo(() => individuals.filter(i => 
    (i.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (i.cpf || '').includes(search)
  ), [individuals, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Beneficiários</h2>
          <p className="text-slate-500 text-sm">Organize as instituições e pessoas atendidas pelo We Care.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-[#001A33] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#002a52] transition-all shadow-lg flex items-center gap-2">
            <Plus size={20} /> Novo Beneficiário
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm p-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-700">Tipo:</span>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                <input type="radio" name="type" checked={beneficiaryType === 'PJ'} onChange={() => setBeneficiaryType('PJ')} className="w-4 h-4 text-[#001A33]" /> Pessoa Jurídica
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                <input type="radio" name="type" checked={beneficiaryType === 'PF'} onChange={() => setBeneficiaryType('PF')} className="w-4 h-4 text-[#001A33]" /> Pessoa Física
              </label>
            </div>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">Cancelar</button>
          </div>

          {beneficiaryType === 'PJ' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Razão Social" value={formPJ.name} onChange={v => setFormPJ({...formPJ, name: v})} />
                <Input label="CNPJ" value={formPJ.cnpj} onChange={v => setFormPJ({...formPJ, cnpj: formatCNPJ(v)})} />
                <Select label="Tipo" value={formPJ.type} options={['ONG', 'Associação', 'Fundação', 'Empresa', 'Outro']} onChange={v => setFormPJ({...formPJ, type: v as any})} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nome Completo" value={formPF.name} onChange={v => setFormPF({...formPF, name: v})} />
                <Input label="CPF" value={formPF.cpf} onChange={v => setFormPF({...formPF, cpf: v})} />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} /> Localização
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Cidade" value={beneficiaryType === 'PJ' ? formPJ.address.city : formPF.address.city} 
                onChange={v => beneficiaryType === 'PJ' ? setFormPJ({...formPJ, address: {...formPJ.address, city: v}}) : setFormPF({...formPF, address: {...formPF.address, city: v}})} />
              <Input label="Bairro" value={beneficiaryType === 'PJ' ? formPJ.address.neighborhood : formPF.address.neighborhood} 
                onChange={v => beneficiaryType === 'PJ' ? setFormPJ({...formPJ, address: {...formPJ.address, neighborhood: v}}) : setFormPF({...formPF, address: {...formPF.address, neighborhood: v}})} />
              <Input label="Rua/Av" value={beneficiaryType === 'PJ' ? formPJ.address.street : formPF.address.street} 
                onChange={v => beneficiaryType === 'PJ' ? setFormPJ({...formPJ, address: {...formPJ.address, street: v}}) : setFormPF({...formPF, address: {...formPF.address, street: v}})} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-[#EAB308] text-[#001A33] font-black py-4 rounded-xl hover:opacity-90 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? <><Loader2 className="animate-spin" size={20} /> PROCESSANDO...</> : 'FINALIZAR E SALVAR NO BANCO'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex bg-white p-1 rounded-xl border w-fit mb-4 shadow-sm">
            <button onClick={() => setBeneficiaryType('PJ')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${beneficiaryType === 'PJ' ? 'bg-[#001A33] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Instituições (PJ)</button>
            <button onClick={() => setBeneficiaryType('PF')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${beneficiaryType === 'PF' ? 'bg-[#001A33] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Pessoas Físicas (PF)</button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Pesquisar..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-[#001A33] outline-none shadow-sm" />
          </div>

          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#001A33]" size={32} /></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {beneficiaryType === 'PJ' ? (
                filteredPJ.length > 0 ? filteredPJ.map(inst => (
                  <BeneficiaryCard key={inst.id} id={inst.id} name={inst.name} identifier={inst.cnpj} type={inst.type} phone={inst.phone} email={inst.email} icon={<Building2 size={24} />} onAction={deleteInstitution} />
                )) : <EmptyList message="Nenhuma instituição encontrada." />
              ) : (
                filteredPF.length > 0 ? filteredPF.map(ind => (
                  <BeneficiaryCard key={ind.id} id={ind.id} name={ind.name} identifier={ind.cpf} type="PESSOA FÍSICA" phone={ind.phone} email={ind.email} icon={<User size={24} />} onAction={deleteIndividual} />
                )) : <EmptyList message="Nenhuma pessoa encontrada." />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BeneficiaryCard = ({ id, name, identifier, type, phone, email, icon, onAction }: any) => {
  const [deleteStage, setDeleteStage] = useState<'idle' | 'armed' | 'processing'>('idle');

  const handleDelete = async () => {
    if (deleteStage === 'idle') {
      setDeleteStage('armed');
      setTimeout(() => setDeleteStage('idle'), 4000); // Reset após 4s
      return;
    }
    
    if (deleteStage === 'armed') {
      setDeleteStage('processing');
      try {
        await onAction(id);
      } catch (error) {
        setDeleteStage('idle');
        alert("Erro ao excluir: Este registro pode estar sendo usado em uma doação ativa.");
      }
    }
  };

  return (
    <div className={`bg-white border rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between group ${deleteStage === 'armed' ? 'border-red-500 ring-2 ring-red-100' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl transition-colors ${deleteStage === 'armed' ? 'bg-red-100 text-red-600' : 'bg-[#001A33]/5 text-[#001A33]'}`}>{icon}</div>
          <div>
            <h4 className="font-bold text-slate-800">{name || 'Sem nome'}</h4>
            <p className="text-xs text-slate-400 font-medium">{identifier || 'Sem documento'}</p>
          </div>
        </div>
        
        <button 
          onClick={handleDelete}
          disabled={deleteStage === 'processing'}
          className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            deleteStage === 'idle' ? 'text-slate-300 hover:text-red-500 hover:bg-red-50' : 
            deleteStage === 'armed' ? 'bg-red-600 text-white animate-pulse' : 
            'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {deleteStage === 'idle' && <Trash2 size={18} />}
          {deleteStage === 'armed' && <><AlertCircle size={14} /> CONFIRMA?</>}
          {deleteStage === 'processing' && <Loader2 className="animate-spin" size={14} />}
        </button>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400">
        <span>{type}</span>
        <div className="flex gap-4">
          {phone && <span className="flex items-center gap-1"><Phone size={12} /> {phone}</span>}
        </div>
      </div>
    </div>
  );
};

const EmptyList = ({ message }: { message: string }) => (
  <div className="col-span-full py-12 flex flex-col items-center text-slate-400 bg-white rounded-2xl border border-dashed">
    <Inbox size={48} className="mb-2 opacity-20" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

const Input = ({ label, value, onChange, type = 'text' }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>
    <input type={type} required value={value} onChange={e => onChange(e.target.value)} className="p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-[#001A33] text-sm" />
  </div>
);

const Select = ({ label, value, options, onChange }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="p-3 border rounded-xl bg-slate-50 outline-none text-sm font-medium">
      {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default Beneficiaries;
