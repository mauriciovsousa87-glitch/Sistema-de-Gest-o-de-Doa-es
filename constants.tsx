
import { Item, Institution, Movement } from './types';

export const SEED_ITEMS: Item[] = [
  {
    id: 'it-1',
    name: 'Cesta Básica',
    category: 'Alimentos',
    unit: 'un',
    referenceValue: 120.0,
    imageUrl: 'https://picsum.photos/seed/cesta/200',
    description: 'Cesta básica padrão contendo arroz, feijão, óleo, etc.',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-2',
    name: 'Cobertor',
    category: 'Roupa',
    unit: 'un',
    referenceValue: 45.0,
    imageUrl: 'https://picsum.photos/seed/cobertor/200',
    description: 'Cobertor de microfibra solteiro.',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'it-3',
    name: 'Leite Integral',
    category: 'Alimentos',
    unit: 'caixa',
    referenceValue: 60.0, // 12 un
    imageUrl: 'https://picsum.photos/seed/leite/200',
    description: 'Caixa fechada com 12 litros de leite integral.',
    active: true,
    createdAt: new Date().toISOString()
  }
];

export const SEED_INSTITUTIONS: Institution[] = [
  {
    id: 'ins-1',
    name: 'ONG Coração Aberto',
    type: 'ONG',
    cnpj: '00.000.000/0001-00',
    phone: '(11) 98888-7777',
    email: 'contato@coracaoaberto.org',
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01001-000'
    },
    responsible: {
      name: 'João Silva',
      position: 'Diretor',
      phone: '(11) 99999-8888',
      email: 'joao@coracaoaberto.org'
    },
    objective: 'Reduzir a fome na região central.',
    areaOfActivity: 'Assistência Social',
    activitiesDescription: 'Distribuição de marmitas e cestas básicas semanalmente.',
    partnershipType: 'Doação de recursos',
    partnershipFrequency: 'Periódica',
    hasPastExperience: true,
    pastExperienceDescription: 'Parceria com Banco de Alimentos por 2 anos.',
    notes: 'Prioridade para cestas básicas.',
    active: true
  },
  {
    id: 'ins-2',
    name: 'Associação Esperança Kids',
    type: 'Associação',
    cnpj: '11.111.111/0001-11',
    phone: '(11) 97777-6666',
    email: 'contato@esperancakids.org',
    address: {
      street: 'Av. da Infância',
      number: '456',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    responsible: {
      name: 'Maria Santos',
      position: 'Coordenadora',
      phone: '(11) 98888-2222',
      email: 'maria@esperancakids.org'
    },
    objective: 'Educação complementar para crianças carentes.',
    areaOfActivity: 'Educação',
    activitiesDescription: 'Reforço escolar e aulas de música.',
    partnershipType: 'Programas educacionais',
    partnershipFrequency: 'Permanente',
    hasPastExperience: false,
    notes: 'Necessita de material escolar e lanches.',
    active: true
  }
];

export const SEED_MOVEMENTS: Movement[] = [
  {
    id: 'mov-1',
    type: 'ENTRADA',
    date: '2023-10-01T10:00:00Z',
    category: 'ITEM',
    itemId: 'it-1',
    quantity: 100,
    unitValue: 120.0,
    totalValue: 12000.0,
    donor: 'Supermercado Sol',
    notes: 'Doação de estoque excedente.'
  },
  {
    id: 'mov-2',
    type: 'ENTRADA',
    date: '2023-10-02T14:00:00Z',
    category: 'DINHEIRO',
    valueMoney: 5000.0,
    totalValue: 5000.0,
    paymentMethod: 'PIX',
    donor: 'Empresa Alpha',
    notes: 'Patrocínio mensal.'
  }
];
