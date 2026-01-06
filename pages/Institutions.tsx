
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Institution, InstitutionType, AreaOfActivity, PartnershipType, PartnershipFrequency } from '../types';
import { Building2, Plus, Search, ChevronRight, User, Phone, Mail, MapPin, Briefcase, Globe } from 'lucide-react';
import { formatCNPJ, formatPhone } from '../utils';

const Institutions: React.FC = () => {
  const { institutions, addInstitution } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState<Omit<Institution, 'id' | 'active'>>({
    name: '',
    type: 'ONG',
    cnpj: '',
    phone: '',
    email: '',
    address: { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '' },
    responsible: { name: '', position: '', phone: '', email: '' },
    objective: '',
    areaOfActivity: 'Assistência Social',
    activitiesDescription: '',
    partnershipType: 'Doação de recursos',
    partnershipFrequency: 'Periódica',
    hasPastExperience: false,
    pastExperienceDescription: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInstitution({ ...formData, active: true });
    setShowForm(false);
    // Reset
  };

  const filtered = institutions.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.cnpj.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Instituições</h2>
          <p className="text-slate-500 text-sm">Cadastre e gerencie as organizações parceiras.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          {showForm ? 'Cancelar' : <><Plus size={20} /> Nova Instituição</>}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm p-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Dados Básicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" /> Dados da Instituição
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Nome da Instituição</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">CNPJ</label>
                <input required type="text" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: formatCNPJ(e.target.value)})} maxLength={18} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Tipo</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as InstitutionType})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="ONG">ONG</option>
                  <option value="Associação">Associação</option>
                  <option value="Fundação">Fundação</option>
                  <option value="Empresa">Empresa</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Telefone Institucional</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: formatPhone(e.target.value)})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Email Institucional</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" /> Sede (Endereço)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Rua/Logradouro</label>
                <input type="text" value={formData.address.street} onChange={e => setFormData({...formData, address: {...formData.address, street: e.target.value}})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Número</label>
                <input type="text" value={formData.address.number} onChange={e => setFormData({...formData, address: {...formData.address, number: e.target.value}})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Bairro</label>
                <input type="text" value={formData.address.neighborhood} onChange={e => setFormData({...formData, address: {...formData.address, neighborhood: e.target.value}})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Cidade</label>
                <input type="text" value={formData.address.city} onChange={e => setFormData({...formData, address: {...formData.address, city: e.target.value}})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Estado (UF)</label>
                <input type="text" maxLength={2} value={formData.address.state} onChange={e => setFormData({...formData, address: {...formData.address, state: e.target.value.toUpperCase()}})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">CEP</label>
                <input type="text" value={formData.address.zipCode} onChange={e => setFormData({...formData, address: {...formData.address, zipCode: e.target.value}})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Responsável */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <User size={20} className="text-blue-600" /> Responsável pela Instituição
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Nome do Responsável</label>
                <input type="text" value={formData.responsible.name} onChange={e => setFormData({...formData, responsible: {...formData.responsible, name: e.target.value}})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Cargo</label>
                <input type="text" value={formData.responsible.position} onChange={e => setFormData({...formData, responsible: {...formData.responsible, position: e.target.value}})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Telefone do Responsável</label>
                <input type="text" value={formData.responsible.phone} onChange={e => setFormData({...formData, responsible: {...formData.responsible, phone: formatPhone(e.target.value)}})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Email do Responsável</label>
                <input type="email" value={formData.responsible.email} onChange={e => setFormData({...formData, responsible: {...formData.responsible, email: e.target.value}})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Atuação e Parceria */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Globe size={20} className="text-blue-600" /> Atuação e Parceria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Área de Atuação</label>
                <select value={formData.areaOfActivity} onChange={e => setFormData({...formData, areaOfActivity: e.target.value as AreaOfActivity})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Assistência Social">Assistência Social</option>
                  <option value="Educação">Educação</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Meio Ambiente">Meio Ambiente</option>
                  <option value="Família">Família</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Objetivo</label>
                <input type="text" value={formData.objective} onChange={e => setFormData({...formData, objective: e.target.value})} placeholder="Ex: Combater a desnutrição infantil" className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Descrição das Atividades</label>
                <textarea rows={3} value={formData.activitiesDescription} onChange={e => setFormData({...formData, activitiesDescription: e.target.value})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Tipo de Parceria Proposta</label>
                <select value={formData.partnershipType} onChange={e => setFormData({...formData, partnershipType: e.target.value as PartnershipType})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Doação de recursos">Doação de recursos</option>
                  <option value="Voluntariado">Voluntariado</option>
                  <option value="Apoio logístico">Apoio logístico</option>
                  <option value="Colaboração em eventos">Colaboração em eventos</option>
                  <option value="Programas educacionais">Programas educacionais</option>
                  <option value="Capacitação">Capacitação</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Frequência da Parceria</label>
                <select value={formData.partnershipFrequency} onChange={e => setFormData({...formData, partnershipFrequency: e.target.value as PartnershipFrequency})} className="p-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Esporádica">Esporádica</option>
                  <option value="Periódica">Periódica</option>
                  <option value="Permanente">Permanente</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-xl border">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.hasPastExperience} onChange={e => setFormData({...formData, hasPastExperience: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-slate-700">Já possui experiência em parcerias com outras organizações?</span>
              </label>
              {formData.hasPastExperience && (
                <textarea placeholder="Descreva brevemente as parcerias passadas..." rows={2} value={formData.pastExperienceDescription} onChange={e => setFormData({...formData, pastExperienceDescription: e.target.value})} className="mt-2 p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              )}
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Cadastrar Instituição
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou CNPJ..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(inst => (
              <div key={inst.id} className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{inst.name}</h4>
                      <p className="text-xs text-slate-400">{inst.cnpj}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${inst.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {inst.type}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <AreaOfActivityIcon area={inst.areaOfActivity} />
                    <span>{inst.areaOfActivity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <User size={16} className="text-slate-400" />
                    <span className="truncate">{inst.responsible.name}</span>
                  </div>
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="flex gap-2">
                    <a href={`tel:${inst.phone}`} className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600"><Phone size={18} /></a>
                    <a href={`mailto:${inst.email}`} className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600"><Mail size={18} /></a>
                  </div>
                  <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    Ver Detalhes <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AreaOfActivityIcon = ({ area }: { area: AreaOfActivity }) => {
  switch (area) {
    case 'Educação': return <Briefcase size={16} className="text-slate-400" />;
    case 'Saúde': return <Globe size={16} className="text-slate-400" />;
    default: return <Globe size={16} className="text-slate-400" />;
  }
};

export default Institutions;
