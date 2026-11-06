'use client';

import React from 'react';
import ScrollStack, { ScrollStackItem } from '@/components/registry/ScrollStack';
import { SvgLoyaltyCard } from './SvgLoyaltyCard';
import { DiscoverNicheCard } from './DiscoverNicheCard';
import {
  NicheCategory,
  NicheSectionData,
  DEFAULT_NICHES_DATA
} from './nicheData';

export interface CardContainerProps {
  selectedNiche?: NicheCategory;
  nichesData?: NicheSectionData[];
  onDiscoverClick?: (nicheName: string) => void;
}

/**
 * CardContainer:
 * Vuelve a la arquitectura original limpia del ScrollStack de Ramiro:
 * - Las tarjetas se presentan una abajo de la otra en flujo natural.
 * - Al scrollear hacia arriba, se produce el efecto de apilamiento fluido nativo.
 * - Distancia calibrada (itemDistance={85}, itemStackDistance={20}) para que no queden huecos vacíos.
 */
export const CardContainer: React.FC<CardContainerProps> = ({
  selectedNiche = 'all',
  nichesData = DEFAULT_NICHES_DATA,
  onDiscoverClick
}) => {
  // Ordenar priorizando los rubros que tienen tarjetas activas
  const sortedNiches = [...nichesData].sort((a, b) => {
    const aHasCards = a.cards.length > 0 ? 1 : 0;
    const bHasCards = b.cards.length > 0 ? 1 : 0;
    return bHasCards - aHasCards;
  });

  const filteredSections =
    selectedNiche === 'all'
      ? sortedNiches
      : sortedNiches.filter((sec) => sec.niche.id === selectedNiche);

  // Unificamos los items para que el ScrollStack corra en toda la billetera de forma fluida
  const allItems = filteredSections.flatMap((section) => {
    const items: Array<{
      key: string;
      type: 'card' | 'discover';
      nicheTitle?: string;
      cardData?: (typeof section.cards)[0];
      nicheData: typeof section;
    }> = [];

    // Si tiene tarjetas activas, las agregamos una a una
    if (section.cards.length > 0) {
      section.cards.forEach((card, idx) => {
        items.push({
          key: card.id,
          type: 'card',
          nicheTitle: idx === 0 && selectedNiche === 'all' ? section.niche.name : undefined,
          cardData: card,
          nicheData: section
        });
      });
    }

    // Agregamos la tarjeta de descubrimiento/placeholder al final de la categoría
    items.push({
      key: `discover-${section.niche.id}`,
      type: 'discover',
      nicheTitle: section.cards.length === 0 && selectedNiche === 'all' ? section.niche.name : undefined,
      nicheData: section
    });

    return items;
  });

  return (
    <section className="w-full h-full">
      <ScrollStack
        itemDistance={85}
        itemStackDistance={20}
        stackPosition="10%"
        itemScale={0.04}
        baseScale={0.93}
        dimAmount={0.2}
        blurAmount={0}
        tiltAmount={3}
        rotationAmount={1.2}
        holdDistance={120}
        smoothScroll
        snap
        innerPadding="px-4"
        className="w-full h-full no-scrollbar"
      >
        {allItems.map((item) => (
          <ScrollStackItem
            key={item.key}
            padding="p-0"
            background="transparent"
            boxShadow="none"
            itemClassName="h-[235px] rounded-[24px] overflow-hidden"
          >
            {item.nicheTitle && (
              <div className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 px-1">
                {item.nicheTitle}
              </div>
            )}

            {item.type === 'card' && item.cardData ? (
              <a
                href={item.cardData.href || '#'}
                className="block w-full h-full"
                aria-label={`Ver tarjeta de ${item.cardData.localName}`}
              >
                <SvgLoyaltyCard
                  localName={item.cardData.localName}
                  category={item.cardData.category}
                  stamps={item.cardData.stamps}
                  totalStamps={item.cardData.totalStamps}
                  unavailable={item.cardData.unavailable}
                />
              </a>
            ) : (
              <DiscoverNicheCard
                niche={item.nicheData.niche}
                hasMoreToDiscover={item.nicheData.hasMoreToDiscover}
                availableCount={item.nicheData.availableCount}
                onClick={() => onDiscoverClick?.(item.nicheData.niche.shortName)}
              />
            )}
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
};

export default CardContainer;
