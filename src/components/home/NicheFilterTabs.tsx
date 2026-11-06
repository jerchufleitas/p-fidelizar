'use client';

import React from 'react';
import { Coffee, IceCream, Scissors, Croissant, Layers } from 'lucide-react';
import {
  NicheCategory,
  NICHE_DEFINITIONS,
  NicheDefinition
} from '@/components/cards/nicheData';

export interface NicheFilterTabsProps {
  selectedNiche: NicheCategory;
  onSelectNiche: (niche: NicheCategory) => void;
  className?: string;
}

const TABS: NicheCategory[] = ['all', 'cafeteria', 'heladeria', 'barberia', 'panaderia'];

function renderTabIcon(iconName: NicheDefinition['iconName'], isActive: boolean) {
  const size = 15;
  const strokeWidth = isActive ? 2.4 : 1.8;

  switch (iconName) {
    case 'Coffee':
      return <Coffee size={size} strokeWidth={strokeWidth} />;
    case 'IceCream':
      return <IceCream size={size} strokeWidth={strokeWidth} />;
    case 'Scissors':
      return <Scissors size={size} strokeWidth={strokeWidth} />;
    case 'Croissant':
      return <Croissant size={size} strokeWidth={strokeWidth} />;
    case 'Layers':
    default:
      return <Layers size={size} strokeWidth={strokeWidth} />;
  }
}

/**
 * NicheFilterTabs: Bloque Lego modular desacoplado.
 * Barra horizontal con scroll táctil suave para filtrar la billetera por rubro.
 */
export const NicheFilterTabs: React.FC<NicheFilterTabsProps> = ({
  selectedNiche,
  onSelectNiche,
  className = ''
}) => {
  return (
    <nav
      aria-label="Filtro de comercios por rubro"
      className={`w-full overflow-x-auto no-scrollbar py-2 px-5 flex items-center gap-2 select-none ${className}`}
    >
      {TABS.map((tabKey) => {
        const def = NICHE_DEFINITIONS[tabKey];
        const isActive = selectedNiche === tabKey;

        return (
          <button
            key={tabKey}
            type="button"
            onClick={() => onSelectNiche(tabKey)}
            aria-pressed={isActive}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all duration-150 active:scale-95 border ${
              isActive
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                : 'bg-white text-neutral-600 border-neutral-200/80 hover:bg-neutral-50 hover:border-neutral-300'
            }`}
          >
            <span className={isActive ? 'text-white' : 'text-neutral-500'}>
              {renderTabIcon(def.iconName, isActive)}
            </span>
            <span>{def.shortName}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default NicheFilterTabs;
