
export type Category = 'Alimentos' | 'Higiene' | 'Roupa' | 'Outros';
export type Unit = 'un' | 'kg' | 'pacote' | 'caixa';
export type InstitutionType = 'ONG' | 'Associação' | 'Fundação' | 'Empresa' | 'Outro';
export type AreaOfActivity = 'Assistência Social' | 'Educação' | 'Saúde' | 'Cultura' | 'Meio Ambiente' | 'Família' | 'Outro';
export type PartnershipType = 'Doação de recursos' | 'Voluntariado' | 'Apoio logístico' | 'Colaboração em eventos' | 'Programas educacionais' | 'Capacitação' | 'Outro';
export type PartnershipFrequency = 'Esporádica' | 'Periódica' | 'Permanente' | 'Outro';

export type MovType = 'ENTRADA' | 'SAÍDA';
export type MovCategory = 'ITEM' | 'DINHEIRO';
export type PaymentMethod = 'PIX' | 'Dinheiro' | 'Transferência' | 'Cartão' | 'Outro';

export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Item {
  id: string;
  name: string;
  category: Category;
  unit: Unit;
  referenceValue: number;
  imageUrl?: string;
  description: string;
  active: boolean;
  createdAt: string;
}

export interface Individual {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  address: Address;
  notes: string;
  active: boolean;
}

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  cnpj: string;
  phone: string;
  email: string;
  address: Address;
  responsible: {
    name: string;
    position: string;
    phone: string;
    email: string;
  };
  objective: string;
  areaOfActivity: AreaOfActivity;
  activitiesDescription: string;
  partnershipType: PartnershipType;
  partnershipFrequency: PartnershipFrequency;
  hasPastExperience: boolean;
  pastExperienceDescription?: string;
  notes: string;
  active: boolean;
}

export interface Movement {
  id: string;
  type: MovType;
  date: string;
  category: MovCategory;
  itemId?: string;
  quantity?: number;
  unitValue?: number;
  totalValue: number;
  valueMoney?: number;
  paymentMethod?: PaymentMethod;
  donor?: string;
  destinationId?: string; // Reference to Institution
  recipientId?: string;   // Reference to Individual
  notes: string;
}

export interface StockInfo {
  itemId: string;
  quantity: number;
  estimatedValue: number;
  minStock: number;
  lowStockAlert: boolean;
}

export interface DashboardStats {
  totalMoneyIn: number;
  totalMoneyOut: number;
  cashBalance: number;
  totalItemsIn: number;
  totalItemsOut: number;
  estimatedStockValue: number;
  institutionsServed: number;
  individualsServed: number;
}
