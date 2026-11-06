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
 * CardContainer: Orquesta las tarjetas por secciones verticales de nichos.
 * 1. Prioriza rubros con tarjetas activas al inicio.
 * 2. En vista global [Todos], apila visualmente las tarjetas en cascada (overlap real)
 *    para que se vean 2 tarjetas juntas asomando de entrada.
 * 3. En vista filtrada [Nicho], activa el ScrollStack interactivo fullscreen de 60fps.
 */
export const CardContainer: React.FC<CardContainerProps> = ({
  selectedNiche = 'all',
  nichesData = DEFAULT_NICHES_DATA,
  onDiscoverClick
}) => {
  // Ordenar priorizando los nichos que tienen tarjetas activas
  const sortedNiches = [...nichesData].sort((a, b) => {
    const aHasCards = a.cards.length > 0 ? 1 : 0;
    const bHasCards = b.cards.length > 0 ? 1 : 0;
    return bHasCards - aHasCards;
  });

  const filteredSections =
    selectedNiche === 'all'
      ? sortedNiches
      : sortedNiches.filter((sec) => sec.niche.id === selectedNiche);

  const isSingleNiche = selectedNiche !== 'all';

  return (
    <div
      className={`w-full h-full no-scrollbar ${
        isSingleNiche ? 'overflow-hidden pb-4' : 'overflow-y-auto pb-28 space-y-7'
      }`}
    >
      {filteredSections.map((section) => {
        const hasCards = section.cards.length > 0;

        return (
          <section
            key={section.niche.id}
            className={`w-full ${isSingleNiche ? 'h-full px-4' : 'px-4'}`}
          >
            {/* Cabecera del Nicho (solo visible en modo 'all') */}
            {!isSingleNiche && (
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight text-neutral-800">
                    {section.niche.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200/60">
                    {section.cards.length}
                  </span>
                </div>
              </div>
            )}

            {/* CASO A: MODO FILTRADO POR NICHO INDIVIDUAL (ScrollStack Interactivo Fullscreen) */}
            {isSingleNiche && hasCards && (
              <div className="w-full h-full">
                <ScrollStack
                  itemDistance={100}
                  itemStackDistance={26}
                  stackPosition="8%"
                  itemScale={0.035}
                  baseScale={0.93}
                  dimAmount={0.15}
                  blurAmount={0}
                  tiltAmount={3}
                  rotationAmount={1.2}
                  holdDistance={130}
                  smoothScroll
                  snap
                  innerPadding="px-1"
                  className="w-full h-full no-scrollbar"
                >
                  {section.cards.map((card) => (
                    <ScrollStackItem
                      key={card.id}
                      padding="p-0"
                      background="transparent"
                      boxShadow="none"
                      itemClassName="h-[235px] rounded-[24px] overflow-hidden"
                    >
                      <a
                        href={card.href || '#'}
                        className="block w-full h-full"
                        aria-label={`Ver tarjeta de ${card.localName}`}
                      >
                        <SvgLoyaltyCard
                          localName={card.localName}
                          category={card.category}
                          stamps={card.stamps}
                          totalStamps={card.totalStamps}
                          unavailable={card.unavailable}
                        />
                      </a>
                    </ScrollStackItem>
                  ))}

                  <ScrollStackItem
                    key={`discover-${section.niche.id}`}
                    padding="p-0"
                    background="transparent"
                    boxShadow="none"
                    itemClassName="h-[235px] rounded-[24px] overflow-hidden"
                  >
                    <DiscoverNicheCard
                      niche={section.niche}
                      hasMoreToDiscover={section.hasMoreToDiscover}
                      availableCount={section.availableCount}
                      onClick={() => onDiscoverClick?.(section.niche.shortName)}
                    />
                  </ScrollStackItem>
                </ScrollStack>
              </div>
            )}

            {/* CASO B: MODO VISTA GLOBAL [TODOS] CON TARJETAS (Cascada visual compacta con solapamiento) */}
            {!isSingleNiche && hasCards && (
              <div className="flex flex-col">
                {/* Lista de tarjetas con solapamiento negativo natural (se ven 2 juntas de entrada) */}
                {section.cards.map((card, idx) => (
                  <div
                    key={card.id}
                    className={`w-full h-[210px] rounded-[24px] transition-transform ${
                      idx > 0 ? '-mt-[145px] hover:-translate-y-2' : ''
                    }`}
                    style={{ zIndex: idx + 1 }}
                  >
                    <a
                      href={card.href || '#'}
                      className="block w-full h-full"
                      aria-label={`Ver tarjeta de ${card.localName}`}
                    >
                      <SvgLoyaltyCard
                        localName={card.localName}
                        category={card.category}
                        stamps={card.stamps}
                        totalStamps={card.totalStamps}
                        unavailable={card.unavailable}
                      />
                    </a>
                  </div>
                ))}

                {/* Tarjeta de descubrimiento compacta al pie del grupo */}
                <div className="w-full mt-3">
                  <DiscoverNicheCard
                    niche={section.niche}
                    hasMoreToDiscover={section.hasMoreToDiscover}
                    availableCount={section.availableCount}
                    className="h-[105px] p-3.5"
                    onClick={() => onDiscoverClick?.(section.niche.shortName)}
                  />
                </div>
              </div>
            )}

            {/* CASO C: NICHO SIN TARJETAS ACTIVAS (Placeholder compacto) */}
            {!hasCards && (
              <div className="w-full px-1">
                <DiscoverNicheCard
                  niche={section.niche}
                  hasMoreToDiscover={section.hasMoreToDiscover}
                  availableCount={section.availableCount}
                  className="h-[130px] p-4"
                  onClick={() => onDiscoverClick?.(section.niche.shortName)}
                />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default CardContainer;
