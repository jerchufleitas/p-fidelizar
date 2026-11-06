'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, ChevronRight } from 'lucide-react';
import type { NicheCardItem } from '@/components/cards/nicheData';
import {
  MOCK_BUSINESS_CAFETERIA,
  MOCK_RULES_CAFETERIA,
  MOCK_CUSTOMER_STATUS_CAFETERIA
} from '@/data/mockLoyalty';
import {
  loadDemoSimulatorConfig,
  applyDemoConfigToEntities
} from '@/services/demoSimulatorStorage';

export interface SmartRewardBannerProps {
  cards: Array<{
    id: string;
    localName: string;
    href?: string;
    stamps: number;
    totalStamps: number;
    nextRewardTitle: string;
    unavailable?: boolean;
  }>;
}

export type BannerState =
  | {
      type: 'ready';
      href: string;
      businessName: string;
      rewardTitle: string;
      badgeText: string;
      subtitle: string;
    }
  | {
      type: 'close';
      href: string;
      businessName: string;
      rewardTitle: string;
      stampsLeft: number;
      badgeText: string;
      subtitle: string;
    }
  | null;

export function computeBannerState(cards: SmartRewardBannerProps['cards']): BannerState {
  if (typeof window === 'undefined') return null;

  const cafeteriaCard = cards.find((c) => c.href === '/local/cafeteria');
  if (cafeteriaCard) {
    const config = loadDemoSimulatorConfig(
      'cafeteria',
      MOCK_BUSINESS_CAFETERIA.name,
      MOCK_RULES_CAFETERIA,
      MOCK_CUSTOMER_STATUS_CAFETERIA
    );

    const { rules, wallet } = applyDemoConfigToEntities(
      config,
      MOCK_RULES_CAFETERIA,
      MOCK_CUSTOMER_STATUS_CAFETERIA
    );

    const businessDisplayName = config.businessName || MOCK_BUSINESS_CAFETERIA.name;

    const vouchers = wallet.vouchers || [];
    const readyVoucher = vouchers.find((v) => v.status === 'ready');
    if (readyVoucher) {
      return {
        type: 'ready',
        href: '/local/cafeteria',
        businessName: businessDisplayName,
        rewardTitle: readyVoucher.rewardTitle,
        badgeText: '¡Premio listo!',
        subtitle: `Disponible para canjear en ${businessDisplayName}`
      };
    }

    const sortedMilestones = [...rules.rewardMilestones].sort(
      (a, b) => a.stampThreshold - b.stampThreshold
    );

    const nextMilestone = sortedMilestones.find((m) => m.stampThreshold > wallet.currentStamps);
    if (nextMilestone) {
      const stampsLeft = nextMilestone.stampThreshold - wallet.currentStamps;
      if (stampsLeft === 1 || stampsLeft === 2) {
        return {
          type: 'close',
          href: '/local/cafeteria',
          businessName: businessDisplayName,
          rewardTitle: nextMilestone.rewardTitle,
          stampsLeft,
          badgeText: stampsLeft === 1 ? 'A solo 1 sello' : 'A solo 2 sellos',
          subtitle: `Estás muy cerca de ganar en ${businessDisplayName}`
        };
      }
    }
  }

  return null;
}

/**
 * SmartRewardBanner estilo Status Island (Kokonut UI / Dynamic Island):
 * Píldora flotante compacta y elegante de estética oscura nativa con animación fluida en GPU.
 */
export const SmartRewardBanner: React.FC<SmartRewardBannerProps> = ({ cards }) => {
  const [banner, setBanner] = useState<BannerState>(null);

  useEffect(() => {
    setBanner(computeBannerState(cards));

    const handleStorageChange = () => {
      setBanner(computeBannerState(cards));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [cards]);

  if (!banner) {
    return null;
  }

  const isReady = banner.type === 'ready';

  return (
    <section className="px-5 py-2.5 flex justify-center select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.rewardTitle + banner.badgeText}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
          className="relative w-full"
        >
          {/* Capa decorativa posterior tipo Dynamic Island (Stack de profundidad) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -top-1 mx-auto w-[92%] h-full rounded-[24px] bg-neutral-800/40 opacity-70 scale-95 blur-[0.5px]"
          />

          {/* Isla Principal Flotante (Status Island) */}
          <Link
            href={banner.href}
            className="relative flex items-center justify-between w-full h-[54px] px-3.5 bg-neutral-950 text-white rounded-[22px] shadow-xl shadow-black/20 border border-white/10 active:scale-[0.98] transition-transform duration-150 overflow-hidden"
          >
            {/* Lado izquierdo: Icono de Estado + Textos */}
            <div className="flex items-center gap-3 min-w-0 pr-2">
              {/* Badge Icono Circular pulsante */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isReady
                    ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40'
                }`}
              >
                {isReady ? (
                  <Gift className="w-4 h-4 animate-pulse" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>

              {/* Textos de la Isla */}
              <div className="min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-tight">
                  <span
                    className={`text-[10.5px] font-bold uppercase tracking-wider ${
                      isReady ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {banner.badgeText}
                  </span>
                  <span className="text-neutral-500 text-[10px]">•</span>
                  <span className="text-[11.5px] font-semibold text-neutral-300 truncate max-w-[130px]">
                    {banner.businessName}
                  </span>
                </div>
                <h2 className="text-[13px] font-bold text-white truncate leading-snug">
                  {banner.rewardTitle}
                </h2>
              </div>
            </div>

            {/* Lado derecho: Píldora de acción "Canjear" / Chevron */}
            <div className="flex items-center gap-1.5 shrink-0 pl-2">
              <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-white transition-colors">
                {isReady ? 'Canjear' : 'Ver'}
              </span>
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-neutral-300">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default SmartRewardBanner;
