export type NicheCategory = 'all' | 'cafeteria' | 'heladeria' | 'barberia' | 'panaderia';

export interface NicheDefinition {
  id: NicheCategory;
  name: string;
  shortName: string;
  iconName: 'Coffee' | 'IceCream' | 'Scissors' | 'Croissant' | 'Layers';
  accentColor: string;
  bgGradient: string;
  borderHoverColor: string;
}

export const NICHE_DEFINITIONS: Record<NicheCategory, NicheDefinition> = {
  all: {
    id: 'all',
    name: 'Todos los rubros',
    shortName: 'Todos',
    iconName: 'Layers',
    accentColor: '#18181b',
    bgGradient: 'from-neutral-900 to-neutral-800',
    borderHoverColor: 'border-neutral-500'
  },
  cafeteria: {
    id: 'cafeteria',
    name: 'Cafeterías de Especialidad',
    shortName: 'Cafeterías',
    iconName: 'Coffee',
    accentColor: '#92400e', // Amber-800
    bgGradient: 'from-[#2e1d14] via-[#1f140e] to-[#120b08]',
    borderHoverColor: 'border-amber-600/40'
  },
  heladeria: {
    id: 'heladeria',
    name: 'Heladerías Artesanales',
    shortName: 'Heladerías',
    iconName: 'IceCream',
    accentColor: '#0284c7', // Sky-600
    bgGradient: 'from-[#0e273c] via-[#091a29] to-[#040e17]',
    borderHoverColor: 'border-sky-500/40'
  },
  barberia: {
    id: 'barberia',
    name: 'Barberías & Estética',
    shortName: 'Barberías',
    iconName: 'Scissors',
    accentColor: '#4f46e5', // Indigo-600
    bgGradient: 'from-[#1e1b4b] via-[#141233] to-[#0b0a1d]',
    borderHoverColor: 'border-indigo-500/40'
  },
  panaderia: {
    id: 'panaderia',
    name: 'Panaderías & Masas',
    shortName: 'Panaderías',
    iconName: 'Croissant',
    accentColor: '#ea580c', // Orange-600
    bgGradient: 'from-[#331c0e] via-[#241309] to-[#140b05]',
    borderHoverColor: 'border-orange-500/40'
  }
};

export interface NicheCardItem {
  id: string;
  businessId: string;
  localName: string;
  category: NicheCategory;
  href?: string;
  stamps: number;
  totalStamps: number;
  nextRewardTitle: string;
  unavailable?: boolean;
}

export interface NicheSectionData {
  niche: NicheDefinition;
  /** Tarjetas activas en las que el cliente ya suma sellos en este rubro */
  cards: NicheCardItem[];
  /** Hay más comercios disponibles para afiliarse en este rubro en la red Vookly */
  hasMoreToDiscover: boolean;
  /** Cantidad de comercios adicionales en la zona */
  availableCount?: number;
}

/**
 * Datos estructurados de la Billetera por Nichos.
 * Cumple con la regla de oro: siempre hay al menos 1 tarjeta real activa (Coffee Shop).
 */
export const DEFAULT_NICHES_DATA: NicheSectionData[] = [
  {
    niche: NICHE_DEFINITIONS.cafeteria,
    cards: [
      {
        id: 'card-cafe-1',
        businessId: 'cafeteria',
        localName: 'Coffee Shop',
        category: 'cafeteria',
        href: '/local/cafeteria',
        stamps: 15,
        totalStamps: 30,
        nextRewardTitle: 'Tostado Especial',
        unavailable: false
      }
    ],
    hasMoreToDiscover: true,
    availableCount: 4
  },
  {
    niche: NICHE_DEFINITIONS.heladeria,
    cards: [], // Sin tarjeta activa todavía -> muestra DiscoverNicheCard
    hasMoreToDiscover: true,
    availableCount: 2
  },
  {
    niche: NICHE_DEFINITIONS.barberia,
    cards: [
      {
        id: 'card-barber-1',
        businessId: 'barberia',
        localName: 'Barbería Central',
        category: 'barberia',
        href: '/local/barberia',
        stamps: 8,
        totalStamps: 20,
        nextRewardTitle: 'Corte + Barba',
        unavailable: true
      }
    ],
    hasMoreToDiscover: false // No hay más comercios por ahora en la zona
  },
  {
    niche: NICHE_DEFINITIONS.panaderia,
    cards: [], // Sin tarjeta activa todavía -> muestra estado Próximamente
    hasMoreToDiscover: false
  }
];
