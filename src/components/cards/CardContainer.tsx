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
 * Dentro de cada nicho, las tarjetas se apilan con ScrollStack contenido.
 * Permite filtrar por un rubro específico o ver todos los nichos apilados secuencialmente.
 */
export const CardContainer: React.FC<CardContainerProps> = ({
  selectedNiche = 'all',
  nichesData = DEFAULT_NICHES_DATA,
  onDiscoverClick
}) => {
  // Filtramos según el tab seleccionado (o todos)
  const filteredSections =
    selectedNiche === 'all'
      ? nichesData
      : nichesData.filter((sec) => sec.niche.id === selectedNiche);

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar pb-16 space-y-8">
      {filteredSections.map((section) => {
        const hasCards = section.cards.length > 0;

        return (
          <section key={section.niche.id} className="w-full px-4">
            {/* Cabecera del Nicho (solo visible en modo 'all') */}
            {selectedNiche === 'all' && (
              <div className="flex items-center justify-between mb-3 px-1">
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

            {/* CASO A: Tiene tarjetas activas -> Altura suficiente para que se vean dos tarjetas al mismo tiempo */}
            {hasCards ? (
              <div className="w-full h-[510px]">
                <ScrollStack
                  itemDistance={12}
                  itemStackDistance={14}
                  stackPosition="4%"
                  itemScale={0.03}
                  baseScale={0.96}
                  dimAmount={0.15}
                  blurAmount={0}
                  tiltAmount={2}
                  rotationAmount={1}
                  holdDistance={90}
                  smoothScroll
                  snap
                  innerPadding="px-1"
                  className="w-full h-full no-scrollbar"
                >
                  {/* 1. Tarjetas Activas del Cliente */}
                  {section.cards.map((card) => (
                    <ScrollStackItem
                      key={card.id}
                      padding="p-0"
                      background="transparent"
                      boxShadow="none"
                      itemClassName="h-[220px] rounded-[24px] overflow-hidden"
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

                  {/* 2. Tarjeta Final de Invitación/Descubrimiento dentro del stack */}
                  <ScrollStackItem
                    key={`discover-${section.niche.id}`}
                    padding="p-0"
                    background="transparent"
                    boxShadow="none"
                    itemClassName="h-[220px] rounded-[24px] overflow-hidden"
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
            ) : (
              /* CASO B: Sin tarjetas en este nicho -> Placeholder directo */
              <div className="w-full px-1">
                <DiscoverNicheCard
                  niche={section.niche}
                  hasMoreToDiscover={section.hasMoreToDiscover}
                  availableCount={section.availableCount}
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
