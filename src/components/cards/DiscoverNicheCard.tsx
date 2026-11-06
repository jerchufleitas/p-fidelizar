'use client';

import React from 'react';
import { Compass, Sparkles, PlusCircle } from 'lucide-react';
import type { NicheDefinition } from '@/components/cards/nicheData';

export interface DiscoverNicheCardProps {
  niche: NicheDefinition;
  hasMoreToDiscover: boolean;
  availableCount?: number;
  className?: string;
  onClick?: () => void;
}

/**
 * DiscoverNicheCard: Tarjeta placeholder vectorial con borde suave.
 * Permite invitar al usuario a afiliarse a nuevos comercios del mismo nicho
 * o muestra el estado "Próximamente más locales en tu zona".
 */
export const DiscoverNicheCard: React.FC<DiscoverNicheCardProps> = ({
  niche,
  hasMoreToDiscover,
  availableCount = 1,
  className = '',
  onClick
}) => {
  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`relative w-full h-[220px] rounded-[24px] p-5 flex flex-col justify-between border-2 border-dashed border-neutral-300/80 bg-neutral-50/70 hover:bg-neutral-100/80 hover:border-neutral-400 transition-all duration-150 active:scale-[0.98] select-none ${className}`}
    >
      {/* Cabecera de la tarjeta placeholder */}
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-neutral-200/60 flex items-center justify-center text-neutral-600">
          {hasMoreToDiscover ? (
            <PlusCircle size={20} className="text-neutral-700" />
          ) : (
            <Sparkles size={18} className="text-amber-500" />
          )}
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 bg-white/80 px-2.5 py-0.5 rounded-full border border-neutral-200/60">
          {niche.shortName}
        </span>
      </div>

      {/* Contenido Central */}
      <div className="my-auto text-left pr-2">
        {hasMoreToDiscover ? (
          <>
            <h4 className="text-[15px] font-bold text-neutral-900 leading-snug">
              Descubrí {niche.shortName.toLowerCase()} en tu zona
            </h4>
            <p className="text-xs font-medium text-neutral-500 mt-1">
              Hay {availableCount} {availableCount === 1 ? 'comercio adherido listo' : 'comercios adheridos listos'} para sumar sellos.
            </p>
          </>
        ) : (
          <>
            <h4 className="text-[15px] font-bold text-neutral-900 leading-snug">
              Próximamente más {niche.shortName.toLowerCase()}
            </h4>
            <p className="text-xs font-medium text-neutral-500 mt-1">
              Estamos sumando nuevos locales en tu ciudad. ¡Estate atento!
            </p>
          </>
        )}
      </div>

      {/* Pie de Acción */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 pt-2 border-t border-neutral-200/60">
        <Compass size={14} />
        <span>{hasMoreToDiscover ? 'Explorar comercios →' : 'Ver novedades'}</span>
      </div>
    </article>
  );
};

export default DiscoverNicheCard;
