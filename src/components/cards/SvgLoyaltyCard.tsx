'use client';

import React from 'react';
import { Coffee, IceCream, Scissors, Croissant } from 'lucide-react';
import type { NicheCategory } from '@/components/cards/nicheData';

export interface SvgLoyaltyCardProps {
  localName: string;
  category: NicheCategory;
  stamps?: number;
  totalStamps?: number;
  unavailable?: boolean;
  className?: string;
}

function renderCategoryIcon(category: NicheCategory) {
  const size = 38;
  const strokeWidth = 1.2;

  switch (category) {
    case 'cafeteria':
      return <Coffee size={size} strokeWidth={strokeWidth} className="text-amber-400/25" />;
    case 'heladeria':
      return <IceCream size={size} strokeWidth={strokeWidth} className="text-sky-400/25" />;
    case 'barberia':
      return <Scissors size={size} strokeWidth={strokeWidth} className="text-indigo-400/25" />;
    case 'panaderia':
      return <Croissant size={size} strokeWidth={strokeWidth} className="text-orange-400/25" />;
    default:
      return null;
  }
}

/**
 * SvgLoyaltyCard: Tarjeta vectorial pura para la Billetera.
 * Elimina al 100% las imágenes JPG pesadas y resuelve el fondo con CSS y SVG nativo.
 */
export const SvgLoyaltyCard: React.FC<SvgLoyaltyCardProps> = ({
  localName,
  category,
  stamps,
  totalStamps,
  unavailable = false,
  className = ''
}) => {
  // Paletas y gradientes por rubro (diseño sobrio, premium estilo fintech/tarjeta de crédito)
  const getTheme = () => {
    switch (category) {
      case 'cafeteria':
        return {
          bg: 'bg-gradient-to-br from-[#26160c] via-[#1a0e07] to-[#0d0703]',
          border: 'border-amber-900/40',
          accent: 'text-amber-400',
          chip: 'from-amber-200 via-amber-400 to-amber-600',
          subtext: 'Cafetería de Especialidad'
        };
      case 'heladeria':
        return {
          bg: 'bg-gradient-to-br from-[#0c2235] via-[#071623] to-[#030b12]',
          border: 'border-sky-900/40',
          accent: 'text-sky-400',
          chip: 'from-sky-200 via-sky-400 to-sky-600',
          subtext: 'Heladería Artesanal'
        };
      case 'barberia':
        return {
          bg: 'bg-gradient-to-br from-[#1c183a] via-[#110e26] to-[#070613]',
          border: 'border-indigo-900/40',
          accent: 'text-indigo-400',
          chip: 'from-neutral-200 via-neutral-400 to-neutral-600',
          subtext: 'Barbería & Estética'
        };
      case 'panaderia':
      default:
        return {
          bg: 'bg-gradient-to-br from-[#2c180b] via-[#1c0f06] to-[#0e0702]',
          border: 'border-orange-900/40',
          accent: 'text-orange-400',
          chip: 'from-orange-200 via-orange-400 to-orange-600',
          subtext: 'Panadería & Confitería'
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`relative w-full h-full rounded-[24px] overflow-hidden p-5 flex flex-col justify-between border ${theme.border} ${theme.bg} shadow-xl shadow-black/30 select-none ${className}`}
    >
      {/* Fondo SVG decorativo con mallas y líneas geométricas sutiles */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`grid-${category}`} width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#ffffff" fillOpacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${category})`} />
      </svg>

      {/* Marca de agua / Icono temático del rubro (Slot preparado para los SVGs de Ramiro) */}
      <div className="absolute right-4 bottom-4 pointer-events-none">
        {renderCategoryIcon(category)}
      </div>

      {/* Cabecera de la Tarjeta: Chip Dorado / Metálico + Badge Próximamente */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Chip EMV Inteligente */}
        <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-200 via-amber-300 to-amber-500 shadow-sm border border-amber-600/40 flex items-center justify-center p-0.5">
          <div className="w-full h-full border border-amber-700/30 rounded-sm grid grid-cols-2 gap-0.5 opacity-80" />
        </div>

        {unavailable && (
          <span className="text-[10.5px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10 backdrop-blur-sm">
            Próximamente
          </span>
        )}
      </div>

      {/* Cuerpo: Nombre del Local y Subtexto de Categoría */}
      <div className="relative z-10 mt-auto pt-6">
        <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
          {theme.subtext}
        </span>
        <h3 className="text-xl font-black text-white tracking-tight leading-tight truncate">
          {localName}
        </h3>

        {/* Barra de progreso simplificada y sellos (Ubicación limpia sin solapamientos) */}
        {stamps !== undefined && totalStamps !== undefined && (
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-xs font-semibold text-neutral-300">
              Progreso acumulado
            </span>
            <span className={`text-xs font-bold ${theme.accent}`}>
              {stamps} / {totalStamps} sellos
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SvgLoyaltyCard;
