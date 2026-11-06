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
 * 1. Mantiene el ScrollStack nativo de React Bits para el efecto de apilamiento elástico original.
 * 2. Las tarjetas NO se superponen en reposo: tienen flujo natural una debajo de la otra.
 *    El apilamiento SOLO ocurre cuando hacés scroll hacia arriba.
 * 3. En la categoría Cafeterías entran Coffee Shop y Café Roma separadas limpiamente sin tocarse.
 * 4. Cero huecos gigantes: los títulos de categoría van como divisores que fluyen de forma natural.
 */
export const CardContainer: React.FC<CardContainerProps> = ({
  selectedNiche = 'all',
  nichesData = DEFAULT_NICHES_DATA,
  onDiscoverClick
}) => {
  // Priorizar rubros con tarjetas activas arriba
  const sortedNiches = [...nichesData].sort((a, b) => {
    const aHasCards = a.cards.length > 0 ? 1 : 0;
    const bHasCards = b.cards.length > 0 ? 1 : 0;
    return bHasCards - aHasCards;
  });

  const filteredSections =
    selectedNiche === 'all'
      ? sortedNiches
      : sortedNiches.filter((sec) => sec.niche.id === selectedNiche);

  // Mapeamos los elementos para el ScrollStack
  const items = filteredSections.flatMap((section) => {
    const sectionItems: Array<{
      key: string;
      categoryHeader?: string;
      cardData?: (typeof section.cards)[0];
      discoverData?: typeof section;
    }> = [];

    // Título de la categoría como encabezado del primer elemento
    const headerTitle = selectedNiche === 'all' ? section.niche.name : undefined;

    if (section.cards.length > 0) {
      section.cards.forEach((card, idx) => {
        sectionItems.push({
          key: card.id,
          categoryHeader: idx === 0 ? headerTitle : undefined,
          cardData: card
        });
      });
    }

    // Tarjeta de descubrimiento al final de la categoría
    sectionItems.push({
      key: `discover-${section.niche.id}`,
      categoryHeader: section.cards.length === 0 ? headerTitle : undefined,
      discoverData: section
    });

    return sectionItems;
  });

  return (
    <section className="w-full h-full">
      <ScrollStack
        itemDistance={24}
        itemStackDistance={18}
        stackPosition="12%"
        itemScale={0.04}
        baseScale={0.93}
        dimAmount={0.2}
        blurAmount={0}
        tiltAmount={3}
        rotationAmount={1.2}
        holdDistance={100}
        smoothScroll
        snap
        innerPadding="px-4"
        className="w-full h-full no-scrollbar"
      >
        {items.map((item) => (
          <ScrollStackItem
            key={item.key}
            padding="p-0"
            background="transparent"
            boxShadow="none"
            itemClassName="h-[215px] rounded-[24px] overflow-hidden"
          >
            {item.cardData ? (
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
            ) : item.discoverData ? (
              <DiscoverNicheCard
                niche={item.discoverData.niche}
                hasMoreToDiscover={item.discoverData.hasMoreToDiscover}
                availableCount={item.discoverData.availableCount}
                className="h-full p-4"
                onClick={() => onDiscoverClick?.(item.discoverData?.niche.shortName || '')}
              />
            ) : null}
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
};

export default CardContainer;
