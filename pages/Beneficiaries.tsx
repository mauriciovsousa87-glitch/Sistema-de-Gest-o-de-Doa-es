
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { Institution, Individual, InstitutionType, AreaOfActivity, PartnershipType, PartnershipFrequency } from '../types';
import { Building2, Plus, Search, ChevronRight, User, Phone, Mail, MapPin, Inbox } from 'lucide-react';
import { formatCNPJ, formatPhone } from '../utils';

const Beneficiaries: React.FC = () => {
  const { institutions, individuals, addInstitution, addIndividual, loading } = useAppStore();
  const [showForm, setShowForm] = useState(false);
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
    try {
      if (beneficiaryType === 'PJ') {
        await addInstitution({ ...formPJ, active: true });
      } else {
        await addIndividual({ ...formPF, active: true });
      }
      setShowForm(false);
      // O Refresh Data é chamado dentro das funções da store
    } catch (error) {
      alert("Houve um erro ao salvar o cadastro. Tente novamente.");
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
        <button onClick={() => setShowForm(!showForm)} className="bg-[#001A33] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#002a52] transition-all shadow-lg flex items-center gap-2">
          {showForm ? 'Cancelar Cadastro' : <><Plus size={20} /> Novo Beneficiário</>}
        </button>
      </div>

      {!showForm && (
        <div className="flex bg-white p-1 rounded-xl border w-fit mb-4 shadow-sm">
          <button onClick={() => setBeneficiaryType('PJ')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${beneficiaryType === 'PJ' ? 'bg-[#001A33] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Instituições (PJ)</button>
          <button onClick={() => setBeneficiaryType('PF')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${beneficiaryType === 'PF' ? 'bg-[#001A33] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Pessoas Físicas (PF)</button>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm p-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
           {/* Form Content - Mesma estrutura anterior */}
          <div className="flex items-center gap-4 border-b pb-4">
            <span className="font-bold text-slate-700">Tipo:</span>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
              <input type="radio" checked={beneficiaryType === 'PJ'} onChange={() => setBeneficiaryType('PJ')} className="w-4 h-4 text-[#001A33]" /> Pessoa Jurídica
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
              <input type="radio" checked={beneficiaryType === 'PF'} onChange={() => setBeneficiaryType('PF')} className="w-4 h-4 text-[#001A33]" /> Pessoa Física
            </label>
          </div>

          {beneficiaryType === 'PJ' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Razão Social" value={formPJ.name} onChange={v => setFormPJ({...formPJ, name: v})} />
                <Input label="CNPJ" value={formPJ.cnpj} onChange={v => setFormPJ({...formPJ, cnpj: formatCNPJ(v)})} />
                <Select label="Tipo" value={formPJ.type} options={['ONG', 'Associação', 'Fundação', 'Empresa', 'Outro']} onChange={v => setFormPJ({...formPJ, type: v as any})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Telefone" value={formPJ.phone} onChange={v => setFormPJ({...formPJ, phone: formatPhone(v)})} />
                <Input label="Email" type="email" value={formPJ.email} onChange={v => setFormPJ({...formPJ, email: v})} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nome Completo" value={formPF.name} onChange={v => setFormPF({...formPF, name: v})} />
                <Input label="CPF" value={formPF.cpf} onChange={v => setFormPF({...formPF, cpf: v})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Telefone" value={formPF.phone} onChange={v => setFormPF({...formPF, phone: formatPhone(v)})} />
                <Input label="Email" type="email" value={formPF.email} onChange={v => setFormPF({...formPF, email: v})} />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} /> Endereço de Atendimento
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input label="Rua/Av" value={beneficiaryType === 'PJ' ? formPJ.address.street : formPF.address.street} 
                  onChange={v => beneficiaryType === 'PJ' ? setFormPJ({...formPJ, address: {...formPJ.address, street: v}}) : setFormPF({...formPF, address: {...formPF.address, street: v}})} />
              </div>
              <Input label="Bairro" value={beneficiaryType === 'PJ' ? formPJ.address.neighborhood : formPF.address.neighborhood} 
                onChange={v => beneficiaryType === 'PJ' ? setFormPJ({...formPJ, address: {...formPJ.address, neighborhood: v}}) : setFormPF({...formPF, address: {...formPF.address, neighborhood: v}})} />
              <Input label="Cidade" value={beneficiaryType === 'PJ' ? formPJ.address.city : formPF.address.city} 
                onChange={v => beneficiaryType === 'PJ' ? setFormPJ({...formPJ, address: {...formPJ.address, city: v}}) : setFormPF({...formPF, address: {...formPF.address, city: v}})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#EAB308] text-[#001A33] font-black py-4 rounded-xl hover:opacity-90 transition-all shadow-xl">
            FINALIZAR E SALVAR NO BANCO
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Pesquisar por nome ou documento..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-[#001A33] outline-none shadow-sm" />
          </div>

          {loading ? (
             <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {beneficiaryType === 'PJ' ? (
                filteredPJ.length > 0 ? filteredPJ.map(inst => (
                  <BeneficiaryCard key={inst.id} name={inst.name} identifier={inst.cnpj} type={inst.type} phone={inst.phone} email={inst.email} icon={<Building2 size={24} />} />
                )) : <EmptyList message="Nenhuma instituição cadastrada." />
              ) : (
                filteredPF.length > 0 ? filteredPF.map(ind => (
                  <BeneficiaryCard key={ind.id} name={ind.name} identifier={ind.cpf} type="PESSOA FÍSICA" phone={ind.phone} email={ind.email} icon={<User size={24} />} />
                )) : <EmptyList message="Nenhuma pessoa física cadastrada." />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const EmptyList = ({ message }: { message: string }) => (
  <div className="col-span-full py-12 flex flex-col items-center text-slate-400 bg-white rounded-2xl border border-dashed">
    <Inbox size={48} className="mb-2 opacity-20" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

const BeneficiaryCard = ({ name, identifier, type, phone, email, icon }: any) => (
  <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#001A33]/5 text-[#001A33] rounded-xl group-hover:bg-[#EAB308] transition-colors">{icon}</div>
        <div>
          <h4 className="font-bold text-slate-800">{name || 'Sem nome'}</h4>
          <p className="text-xs text-slate-400 font-medium">{identifier || 'Sem documento'}</p>
        </div>
      </div>
      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider">{type}</span>
    </div>
    <div className="flex gap-4 pt-4 border-t border-slate-50">
      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium"><Phone size={14} className="text-slate-300" /> {phone || 'N/A'}</div>
      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium truncate"><Mail size={14} className="text-slate-300" /> {email || 'N/A'}</div>
    </div>
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
