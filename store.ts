
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
      // Nota: Não setamos loading aqui para evitar "piscadas" na UI durante atualizações de fundo
      const [itemsRes, instRes, indRes, movRes] = await Promise.all([
        supabase.from('doa_items').select('*').order('name'),
        supabase.from('doa_institutions').select('*').order('name'),
        supabase.from('doa_individuals').select('*').order('name'),
        supabase.from('doa_movements').select('*').order('date', { ascending: false })
      ]);

      if (itemsRes.data) setItems(itemsRes.data.map(i => ({ ...i, referenceValue: i.reference_value, imageUrl: i.image_url })));
      if (instRes.data) setInstitutions(instRes.data);
      if (indRes.data) setIndividuals(indRes.data);
      if (movRes.data) setMovements(movRes.data.map(m => ({
        ...m, itemId: m.item_id, unitValue: m.unit_value, totalValue: m.total_value,
        valueMoney: m.value_money, destinationId: m.destination_id, recipientId: m.recipient_id
      })));
    } catch (error) {
      console.error('Erro crítico ao buscar dados do Supabase:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

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

  const addMovement = async (mov: any) => {
    const payload = {
      type: mov.type, date: mov.date, category: mov.category, item_id: mov.itemId,
      quantity: mov.quantity, unit_value: mov.unitValue, total_value: mov.totalValue,
      value_money: mov.valueMoney, donor: mov.donor, destination_id: mov.destinationId,
      recipient_id: mov.recipientId, notes: mov.notes
    };
    const { error } = await supabase.from('doa_movements').insert([payload]);
    if (error) throw error;
    await refreshData();
  };

  const addItem = async (item: any) => {
    const { error } = await supabase.from('doa_items').insert([{ ...item, reference_value: item.referenceValue, image_url: item.imageUrl }]);
    if (error) throw error;
    await refreshData();
  };

  const addInstitution = async (inst: any) => {
    const { error } = await supabase.from('doa_institutions').insert([inst]);
    if (error) {
      console.error('Erro ao salvar Instituição:', error);
      throw error;
    }
    await refreshData();
  };

  const addIndividual = async (ind: any) => {
    const { error } = await supabase.from('doa_individuals').insert([ind]);
    if (error) {
      console.error('Erro ao salvar Pessoa Física:', error);
      throw error;
    }
    await refreshData();
  };

  return React.createElement(AppContext.Provider, {
    value: { items, institutions, individuals, movements, loading, getStock, getDashboardStats, addMovement, addItem, addInstitution, addIndividual, refreshData }
  }, children);
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within an AppProvider');
  return context;
};
