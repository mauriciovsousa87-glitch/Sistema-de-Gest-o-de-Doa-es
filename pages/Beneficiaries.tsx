
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Institution, Individual, InstitutionType, AreaOfActivity, PartnershipType, PartnershipFrequency } from '../types';
import { Building2, Plus, Search, ChevronRight, User, Phone, Mail, MapPin, Briefcase, Globe, Fingerprint } from 'lucide-react';
import { formatCNPJ, formatPhone } from '../utils';

const Beneficiaries: React.FC = () => {
  const { institutions, individuals, addInstitution, addIndividual } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [beneficiaryType, setBeneficiaryType] = useState<'PJ' | 'PF'>('PJ');
  const [search, setSearch] = useState('');

  // Estados dos Formulários
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (beneficiaryType === 'PJ') {
      addInstitution({ ...formPJ, active: true });
    } else {
      addIndividual({ ...formPF, active: true });
    }
    setShowForm(false);
  };

  const filteredPJ = institutions.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.cnpj.includes(search));
  const filteredPF = individuals.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.cpf.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Beneficiários</h2>
          <p className="text-slate-500 text-sm">Instituições parceiras e Indivíduos assistidos pela ação.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#001A33] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#002a52] transition-all shadow-lg flex items-center gap-2">
          {showForm ? 'Fechar Form' : <><Plus size={20} /> Novo Beneficiário</>}
        </button>
      </div>

      {!showForm && (
        <div className="flex bg-white p-1 rounded-xl border w-fit mb-4">
          <button onClick={() => setBeneficiaryType('PJ')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${beneficiaryType === 'PJ' ? 'bg-[#001A33] text-white shadow-md' : 'text-slate-500'}`}>Instituições (PJ)</button>
          <button onClick={() => setBeneficiaryType('PF')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${beneficiaryType === 'PF' ? 'bg-[#001A33] text-white shadow-md' : 'text-slate-500'}`}>Pessoas Físicas (PF)</button>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm p-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4 border-b pb-4">
            <span className="font-bold text-slate-700">Tipo de Cadastro:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={beneficiaryType === 'PJ'} onChange={() => setBeneficiaryType('PJ')} /> PJ (Empresa/ONG)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={beneficiaryType === 'PF'} onChange={() => setBeneficiaryType('PF')} /> PF (Indivíduo)
            </label>
          </div>

          {beneficiaryType === 'PJ' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Razão Social / Nome" value={formPJ.name} onChange={v => setFormPJ({...formPJ, name: v})} />
                <Input label="CNPJ" value={formPJ.cnpj} onChange={v => setFormPJ({...formPJ, cnpj: formatCNPJ(v)})} />
                <Select label="Tipo" value={formPJ.type} options={['ONG', 'Associação', 'Fundação', 'Empresa', 'Outro']} onChange={v => setFormPJ({...formPJ, type: v as any})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Telefone" value={formPJ.phone} onChange={v => setFormPJ({...formPJ, phone: formatPhone(v)})} />
                <Input label="Email" type="email" value={formPJ.email} onChange={v => setFormPJ({...formPJ, email: v})} />
              </div>
              <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest mt-4">Dados do Responsável</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nome do Responsável" value={formPJ.responsible.name} onChange={v => setFormPJ({...formPJ, responsible: {...formPJ.responsible, name: v}})} />
                <Input label="Cargo" value={formPJ.responsible.position} onChange={v => setFormPJ({...formPJ, responsible: {...formPJ.responsible, position: v}})} />
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
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Situação Socioeconômica / Notas</label>
                <textarea rows={3} value={formPF.notes} onChange={e => setFormPF({...formPF, notes: e.target.value})} className="p-2.5 border rounded-lg bg-slate-50 outline-none resize-none" />
              </div>
            </div>
          )}

          {/* Seção de Endereço unificada */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest">Localização / Endereço</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Rua/Av</label>
                <input type="text" className="p-2.5 border rounded-lg bg-slate-50 outline-none" 
                  value={beneficiaryType === 'PJ' ? formPJ.address.street : formPF.address.street} 
                  onChange={e => beneficiaryType === 'PJ' ? setFormPJ({...formPJ, address: {...formPJ.address, street: e.target.value}}) : setFormPF({...formPF, address: {...formPF.address, street: e.target.value}})} />
              </div>
              <Input label="Nº" value={beneficiaryType === 'PJ' ? formPJ.address.number : formPF.address.number} onChange={v => beneficiaryType === 'PJ' ? setFormPJ({...formPJ, address: {...formPJ.address, number: v}}) : setFormPF({...formPF, address: {...formPF.address, number: v}})} />
              <Input label="Bairro" value={beneficiaryType === 'PJ' ? formPJ.address.neighborhood : formPF.address.neighborhood} onChange={v => beneficiaryType === 'PJ' ? setFormPJ({...formPJ, address: {...formPJ.address, neighborhood: v}}) : setFormPF({...formPF, address: {...formPF.address, neighborhood: v}})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#EAB308] text-[#001A33] font-black py-4 rounded-xl hover:opacity-90 transition-all shadow-lg text-center">
            FINALIZAR CADASTRO NO SISTEMA
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Pesquisar por nome, CPF ou CNPJ..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-[#001A33] outline-none shadow-sm" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {beneficiaryType === 'PJ' ? filteredPJ.map(inst => (
              <BeneficiaryCard key={inst.id} name={inst.name} identifier={inst.cnpj} type={inst.type} phone={inst.phone} email={inst.email} icon={<Building2 size={24} />} />
            )) : filteredPF.map(ind => (
              <BeneficiaryCard key={ind.id} name={ind.name} identifier={ind.cpf} type="PESSOA FÍSICA" phone={ind.phone} email={ind.email} icon={<User size={24} />} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BeneficiaryCard = ({ name, identifier, type, phone, email, icon }: any) => (
  <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#001A33]/5 text-[#001A33] rounded-xl">{icon}</div>
        <div>
          <h4 className="font-bold text-slate-800">{name}</h4>
          <p className="text-xs text-slate-400">{identifier}</p>
        </div>
      </div>
      <span className="px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 text-[10px] font-black uppercase tracking-wider">{type}</span>
    </div>
    <div className="flex gap-4 pt-4 border-t">
      <div className="flex items-center gap-2 text-xs text-slate-500"><Phone size={14} /> {phone}</div>
      <div className="flex items-center gap-2 text-xs text-slate-500 truncate"><Mail size={14} /> {email}</div>
    </div>
  </div>
);

const Input = ({ label, value, onChange, type = 'text' }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <input type={type} required value={value} onChange={e => onChange(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-[#001A33]" />
  </div>
);

const Select = ({ label, value, options, onChange }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50 outline-none">
      {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default Beneficiaries;
