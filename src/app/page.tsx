'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { HomeGreeting } from '@/components/home/HomeGreeting';
import { SmartRewardBanner } from '@/components/home/SmartRewardBanner';
import { WalletSectionHeader } from '@/components/home/WalletSectionHeader';
import { NicheFilterTabs } from '@/components/home/NicheFilterTabs';
import { CardContainer } from '@/components/cards/CardContainer';
import { NicheCategory, DEFAULT_NICHES_DATA } from '@/components/cards/nicheData';

// Generamos lista plana de tarjetas activas para alimentar el SmartRewardBanner
const BANNER_CARDS = DEFAULT_NICHES_DATA.flatMap((sec) =>
  sec.cards.map((c) => ({
    id: c.id,
    localName: c.localName,
    imagePath: '',
    href: c.href,
    stamps: c.stamps,
    totalStamps: c.totalStamps,
    nextRewardTitle: c.nextRewardTitle,
    unavailable: c.unavailable
  }))
);

export default function Home() {
  const [selectedNiche, setSelectedNiche] = useState<NicheCategory>('all');
  const [discoverAlert, setDiscoverAlert] = useState<string | null>(null);

  const totalActiveCards = DEFAULT_NICHES_DATA.reduce(
    (acc, sec) => acc + sec.cards.length,
    0
  );

  const handleDiscoverClick = (nicheName: string) => {
    setDiscoverAlert(`Próximamente más locales de ${nicheName} en tu zona. ¡Estate atento!`);
    setTimeout(() => setDiscoverAlert(null), 3500);
  };

  return (
    <div className="h-screen bg-neutral-100 flex justify-center overflow-hidden">
      {/* Shell Móvil Centrado */}
      <main className="w-full max-w-md h-screen bg-white relative flex flex-col overflow-hidden shadow-2xl">
        {/* 1. Cabecera Minimalista */}
        <TopBar />

        {/* 2. Saludo Contextual por Horario */}
        <HomeGreeting />

        {/* 3. Banner Inteligente de Recompensas (Status Island) */}
        <SmartRewardBanner cards={BANNER_CARDS} />

        {/* 4. Encabezado de la Sección de Billetera */}
        <WalletSectionHeader totalCards={totalActiveCards} />

        {/* 5. Barra de Filtros / Tabs Horizontales por Nicho */}
        <NicheFilterTabs
          selectedNiche={selectedNiche}
          onSelectNiche={setSelectedNiche}
          className="pb-3"
        />

        {/* Notificación flotante de descubrimiento */}
        {discoverAlert && (
          <div className="px-5 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-neutral-900 text-white text-xs font-medium px-3.5 py-2 rounded-xl shadow-lg flex items-center justify-between">
              <span>{discoverAlert}</span>
            </div>
          </div>
        )}

        {/* 6. Contenedor Modular de Tarjetas por Secciones Verticales con ScrollStack */}
        <div className="flex-1 w-full bg-white min-h-0">
          <CardContainer
            selectedNiche={selectedNiche}
            nichesData={DEFAULT_NICHES_DATA}
            onDiscoverClick={handleDiscoverClick}
          />
        </div>
      </main>
    </div>
  );
}
