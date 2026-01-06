
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import { Item, Institution, Movement, StockInfo, DashboardStats } from './types';

// Credenciais fornecidas pelo usuário
const SUPABASE_URL = 'https://ghgyiscnzcwokillnlox.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ3lpc2NuemN3b2tpbGxubG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzgyMjYsImV4cCI6MjA4MDk1NDIyNn0.1qzhIJ7A0pfxl8cuHTqFnCAZ7cMIICfhuYKlfhkhchU';

// Cliente inicializado globalmente
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface AppContextType {
  items: Item[];
  institutions: Institution[];
  movements: Movement[];
  loading: boolean;
  getStock: () => StockInfo[];
  getDashboardStats: () => DashboardStats;
  addMovement: (mov: Omit<Movement, 'id'>) => Promise<void>;
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => Promise<void>;
  addInstitution: (inst: Omit<Institution, 'id'>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, instRes, movRes] = await Promise.all([
        supabase.from('doa_items').select('*').order('name'),
        supabase.from('doa_institutions').select('*').order('name'),
        supabase.from('doa_movements').select('*').order('date', { ascending: false })
      ]);

      if (itemsRes.data) {
        setItems(itemsRes.data.map(item => ({
          ...item,
          referenceValue: item.reference_value,
          imageUrl: item.image_url
        })));
      }
      
      if (instRes.data) {
        setInstitutions(instRes.data);
      }
      
      if (movRes.data) {
        setMovements(movRes.data.map(mov => ({
          ...mov,
          itemId: mov.item_id,
          unitValue: mov.unit_value,
          totalValue: mov.total_value,
          valueMoney: mov.value_money,
          destinationId: mov.destination_id
        })));
      }
    } catch (error) {
      console.error('Erro ao buscar dados do Supabase:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const getStock = useCallback((): StockInfo[] => {
    return items.map(item => {
      const entries = movements
        .filter(m => m.type === 'ENTRADA' && m.category === 'ITEM' && m.itemId === item.id)
        .reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
      
      const exits = movements
        .filter(m => m.type === 'SAÍDA' && m.category === 'ITEM' && m.itemId === item.id)
        .reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
      
      const quantity = entries - exits;
      const minStock = 10;
      
      return {
        itemId: item.id,
        quantity,
        estimatedValue: quantity * (item.referenceValue || 0),
        minStock,
        lowStockAlert: quantity < minStock
      };
    });
  }, [items, movements]);

  const getDashboardStats = useCallback((): DashboardStats => {
    const moneyIn = movements
      .filter(m => m.type === 'ENTRADA' && m.category === 'DINHEIRO')
      .reduce((acc, curr) => acc + (Number(curr.valueMoney) || 0), 0);
    
    const moneyOut = movements
      .filter(m => m.type === 'SAÍDA' && m.category === 'DINHEIRO')
      .reduce((acc, curr) => acc + (Number(curr.valueMoney) || 0), 0);
    
    const itemsIn = movements
      .filter(m => m.type === 'ENTRADA' && m.category === 'ITEM')
      .reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
    
    const itemsOut = movements
      .filter(m => m.type === 'SAÍDA' && m.category === 'ITEM')
      .reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
    
    const stock = getStock();
    const estVal = stock.reduce((acc, curr) => acc + curr.estimatedValue, 0);
    
    const uniqueInstitutions = new Set(
      movements
        .filter(m => m.type === 'SAÍDA' && m.destinationId)
        .map(m => m.destinationId)
    ).size;

    return {
      totalMoneyIn: moneyIn,
      totalMoneyOut: moneyOut,
      cashBalance: moneyIn - moneyOut,
      totalItemsIn: itemsIn,
      totalItemsOut: itemsOut,
      estimatedStockValue: estVal,
      institutionsServed: uniqueInstitutions
    };
  }, [movements, getStock]);

  const addMovement = async (mov: any) => {
    const dbPayload = {
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
      notes: mov.notes
    };
    const { error } = await supabase.from('doa_movements').insert([dbPayload]);
    if (error) throw error;
    await refreshData();
  };

  const addItem = async (item: any) => {
    const dbPayload = {
      name: item.name,
      category: item.category,
      unit: item.unit,
      reference_value: item.referenceValue,
      image_url: item.imageUrl,
      description: item.description,
      active: item.active
    };
    const { error } = await supabase.from('doa_items').insert([dbPayload]);
    if (error) throw error;
    await refreshData();
  };

  const addInstitution = async (inst: any) => {
    const { error } = await supabase.from('doa_institutions').insert([inst]);
    if (error) throw error;
    await refreshData();
  };

  return React.createElement(AppContext.Provider, {
    value: {
      items,
      institutions,
      movements,
      loading,
      getStock,
      getDashboardStats,
      addMovement,
      addItem,
      addInstitution,
      refreshData
    }
  }, children);
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
