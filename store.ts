
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import { Item, Institution, Individual, Movement, StockInfo, DashboardStats } from './types';

const SUPABASE_URL = 'https://ghgyiscnzcwokillnlox.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ3lpc2NuemN3b2tpbGxubG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzgyMjYsImV4cCI6MjA4MDk1NDIyNn0.1qzhIJ7A0pfxl8cuHTqFnCAZ7cMIICfhuYKlfhkhchU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface AppContextType {
  items: Item[];
  institutions: Institution[];
  individuals: Individual[];
  movements: Movement[];
  loading: boolean;
  getStock: () => StockInfo[];
  getDashboardStats: () => DashboardStats;
  addMovement: (mov: Omit<Movement, 'id'>) => Promise<void>;
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => Promise<void>;
  addInstitution: (inst: Omit<Institution, 'id'>) => Promise<void>;
  addIndividual: (ind: Omit<Individual, 'id'>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [individuals, setIndividuals] = useState<Individual[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [itemsRes, instRes, indRes, movRes] = await Promise.all([
        supabase.from('doa_items').select('*').order('name'),
        supabase.from('doa_institutions').select('*').order('name'),
        supabase.from('doa_individuals').select('*').order('name'),
        supabase.from('doa_movements').select('*').order('date', { ascending: false })
      ]);

      if (itemsRes.data) {
        setItems(itemsRes.data.map(i => ({
          ...i,
          referenceValue: Number(i.reference_value) || 0,
          imageUrl: i.image_url
        })));
      }
      
      if (instRes.data) {
        setInstitutions(instRes.data.map(i => ({
          ...i,
          address: {
            street: i.street, number: i.number, neighborhood: i.neighborhood,
            city: i.city, state: i.state, zipCode: i.zip_code
          },
          responsible: {
            name: i.responsible_name, position: '', phone: i.responsible_phone, email: i.responsible_email
          },
          areaOfActivity: i.area_of_activity,
          activitiesDescription: i.activities_description,
          partnershipType: i.partnership_type,
          partnershipFrequency: i.partnership_frequency,
          hasPastExperience: i.has_past_experience,
          pastExperienceDescription: i.past_experience_description
        })));
      }

      if (indRes.data) {
        setIndividuals(indRes.data.map(i => ({
          ...i,
          address: {
            street: i.street, number: i.number, neighborhood: i.neighborhood,
            city: i.city, state: i.state, zipCode: i.zip_code
          }
        })));
      }

      if (movRes.data) {
        setMovements(movRes.data.map(m => ({
          ...m,
          itemId: m.item_id,
          unitValue: Number(m.unit_value) || 0,
          totalValue: Number(m.total_value) || 0,
          valueMoney: Number(m.value_money) || 0,
          destinationId: m.destination_id,
          recipientId: m.recipient_id,
          paymentMethod: m.payment_method
        })));
      }
    } catch (error) {
      console.error('Erro crítico ao buscar dados do Supabase:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  const addInstitution = async (inst: any) => {
    const payload = {
      name: inst.name,
      type: inst.type,
      cnpj: inst.cnpj,
      phone: inst.phone,
      email: inst.email,
      active: true,
      street: inst.address.street,
      number: inst.address.number,
      neighborhood: inst.address.neighborhood,
      city: inst.address.city,
      state: inst.address.state,
      zip_code: inst.address.zipCode,
      responsible_name: inst.responsible?.name,
      responsible_phone: inst.responsible?.phone,
      responsible_email: inst.responsible?.email,
      objective: inst.objective,
      area_of_activity: inst.areaOfActivity,
      activities_description: inst.activitiesDescription,
      partnership_type: inst.partnershipType,
      partnership_frequency: inst.partnershipFrequency,
      has_past_experience: inst.hasPastExperience,
      past_experience_description: inst.pastExperienceDescription,
      notes: inst.notes
    };

    const { error } = await supabase.from('doa_institutions').insert([payload]);
    if (error) {
      console.error('Erro ao salvar instituição:', error);
      throw error;
    }
    await refreshData();
  };

  const addIndividual = async (ind: any) => {
    const payload = {
      name: ind.name,
      cpf: ind.cpf,
      phone: ind.phone,
      email: ind.email,
      notes: ind.notes,
      active: true,
      street: ind.address.street,
      number: ind.address.number,
      neighborhood: ind.address.neighborhood,
      city: ind.address.city,
      state: ind.address.state,
      zip_code: ind.address.zipCode
    };

    const { error } = await supabase.from('doa_individuals').insert([payload]);
    if (error) {
      console.error('Erro ao salvar indivíduo:', error);
      throw error;
    }
    await refreshData();
  };

  const addMovement = async (mov: any) => {
    const payload = {
      type: mov.type,
      date: mov.date,
      category: mov.category,
      item_id: mov.itemId,
      quantity: mov.quantity,
      unit_value: mov.unitValue,
      total_value: mov.totalValue,
      value_money: mov.valueMoney,
      donor: mov.donor,
      destination_id: mov.destinationId,
      recipient_id: mov.recipientId,
      notes: mov.notes,
      payment_method: mov.paymentMethod
    };
    const { error } = await supabase.from('doa_movements').insert([payload]);
    if (error) throw error;
    await refreshData();
  };

  const addItem = async (item: any) => {
    const payload = {
      name: item.name,
      category: item.category,
      unit: item.unit,
      reference_value: item.referenceValue,
      image_url: item.imageUrl,
      description: item.description,
      active: item.active
    };
    const { error } = await supabase.from('doa_items').insert([payload]);
    if (error) throw error;
    await refreshData();
  };

  const getStock = useCallback((): StockInfo[] => {
    return items.map(item => {
      const entries = movements.filter(m => m.type === 'ENTRADA' && m.category === 'ITEM' && m.itemId === item.id)
        .reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
      const exits = movements.filter(m => m.type === 'SAÍDA' && m.category === 'ITEM' && m.itemId === item.id)
        .reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
      const quantity = entries - exits;
      return { itemId: item.id, quantity, estimatedValue: quantity * (item.referenceValue || 0), minStock: 10, lowStockAlert: quantity < 10 };
    });
  }, [items, movements]);

  const getDashboardStats = useCallback((): DashboardStats => {
    const moneyIn = movements.filter(m => m.type === 'ENTRADA' && m.category === 'DINHEIRO').reduce((a, c) => a + (Number(c.valueMoney) || 0), 0);
    const moneyOut = movements.filter(m => m.type === 'SAÍDA' && m.category === 'DINHEIRO').reduce((a, c) => a + (Number(c.valueMoney) || 0), 0);
    const itemsIn = movements.filter(m => m.type === 'ENTRADA' && m.category === 'ITEM').reduce((a, c) => a + (Number(c.quantity) || 0), 0);
    const itemsOut = movements.filter(m => m.type === 'SAÍDA' && m.category === 'ITEM').reduce((a, c) => a + (Number(c.quantity) || 0), 0);
    const stock = getStock();
    const instSrv = new Set(movements.filter(m => m.type === 'SAÍDA' && m.destinationId).map(m => m.destinationId)).size;
    const indSrv = new Set(movements.filter(m => m.type === 'SAÍDA' && m.recipientId).map(m => m.recipientId)).size;

    return {
      totalMoneyIn: moneyIn, totalMoneyOut: moneyOut, cashBalance: moneyIn - moneyOut,
      totalItemsIn: itemsIn, totalItemsOut: itemsOut, estimatedStockValue: stock.reduce((a, c) => a + c.estimatedValue, 0),
      institutionsServed: instSrv, individualsServed: indSrv
    };
  }, [movements, getStock]);

  return React.createElement(AppContext.Provider, {
    value: { items, institutions, individuals, movements, loading, getStock, getDashboardStats, addMovement, addItem, addInstitution, addIndividual, refreshData }
  }, children);
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within an AppProvider');
  return context;
};
