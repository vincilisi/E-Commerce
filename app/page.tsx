'use client';

import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, BadgeCheck, Heart, ShieldCheck, Sparkles, Star, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

type HomeProduct = {
  id: string;
  name: string;
  images?: Array<{ url: string }>;
};

export default function Home() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [siteName, setSiteName] = useState('Il Desiderio di una Stella');
  const [logo, setLogo] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch(() => setProducts([]));

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.siteName) {
          setSiteName(data.settings.siteName);
        }
        if (data.settings?.logo) {
          setLogo(data.settings.logo);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="overflow-hidden lux-shell">
      <section className="pt-4 md:pt-6 pb-2">
        <div className="container mx-auto px-4">
          <div className="rounded-full border border-[#ead9c4] bg-white/80 backdrop-blur-md px-5 py-3 shadow-[0_14px_35px_rgba(33,26,23,0.08)] flex flex-col lg:flex-row gap-2 lg:gap-4 items-center justify-between section-wrap">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#6e5245]">
              <BadgeCheck className="w-4 h-4 text-[#a53b2f]" />
              <span>Brand artigianale con posizionamento premium e identita forte</span>
            </div>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-[#816759]">
              <span className="inline-flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Pagamenti sicuri</span>
              <span className="inline-flex items-center gap-1"><Truck className="w-4 h-4" /> Spedizione tracciata</span>
              <span className="inline-flex items-center gap-1"><Heart className="w-4 h-4" /> Customer care umano</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-24 lg:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(165,59,47,0.96),rgba(196,108,50,0.9),rgba(242,201,107,0.86))]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-16 -top-10 h-72 w-72 rounded-full bg-white/50 blur-3xl animate-blob" />
          <div className="absolute -right-10 top-[18%] h-96 w-96 rounded-full bg-white/40 blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-[38%] h-88 w-88 rounded-full bg-white/35 blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md mb-6 text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4" />
                Fatto a mano, design d&apos;autore, dettaglio maniacale
              </div>

              <div className="flex items-center gap-4 mb-6">
                {logo ? (
                  <Image
                    src={logo}
                    alt={`Logo ${siteName}`}
                    width={80}
                    height={80}
                    unoptimized
                    className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl"
                  />
                ) : (
                  <Star className="w-14 h-14 md:w-16 md:h-16" style={{ color: 'var(--color-accent)', fill: 'var(--color-accent)' }} />
                )}
                <span className="text-sm md:text-base font-semibold uppercase tracking-[0.22em] text-white/85">Atelier digitale</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-6 drop-shadow-[0_16px_36px_rgba(0,0,0,0.22)]">
                {siteName}
              </h1>

              <p className="text-lg md:text-2xl max-w-2xl leading-relaxed text-white/90 mb-10">
                {t('heroSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/prodotti"
                  className="inline-flex items-center justify-center gap-2 text-base md:text-lg btn-lux-secondary"
                >
                  {t('shopNow')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/chi-siamo"
                  className="inline-flex items-center justify-center rounded-full px-8 py-4 text-base md:text-lg font-semibold border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/18 float-soft"
                >
                  La nostra storia
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-7 rounded-[2.2rem] bg-white/25 blur-3xl" />
              <div className="relative rounded-4xl border border-white/35 bg-white/12 backdrop-blur-2xl p-6 md:p-8 shadow-[0_26px_90px_rgba(33,26,23,0.28)]">
                <div className="rounded-3xl bg-white p-6 md:p-7 border border-[#f0dfcb] shadow-[0_18px_45px_rgba(33,26,23,0.1)]">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#8a6f5e] mb-2">Signature Piece</p>
                  <h3 className="font-display text-2xl text-[#2f221b] mb-4">Ogni dettaglio racconta valore</h3>
                  <div className="rounded-2xl overflow-hidden bg-[#fff7ee] border border-[#f1dfc8] mb-4">
                    {products[0]?.images?.[0]?.url ? (
                      <Image
                        src={products[0].images[0].url}
                        alt={products[0].name}
                        width={640}
                        height={640}
                        unoptimized
                        className="w-full aspect-square object-cover"
                      />
                    ) : (
                      <div className="aspect-square flex items-center justify-center text-6xl">🔑</div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Handmade', value: '100%' },
                      { label: 'Care', value: 'Premium' },
                      { label: 'Tempo', value: '48h' }
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-[#f0dfcb] bg-[#fffaf3] py-3 text-center">
                        <p className="text-xs uppercase tracking-wide text-[#8a6f5e]">{item.label}</p>
                        <p className="text-sm font-bold text-[#3d2b21] mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14 md:mb-16">
            <p className="text-sm uppercase tracking-[0.28em] text-[#8b6f60] mb-3">Perche sceglierci</p>
            <h2 className="font-display text-4xl md:text-6xl text-[#2e211b] mb-5">Un design che sembra gioielleria</h2>
            <p className="text-[#6f5749] text-base md:text-lg leading-relaxed">
              La qualità percepita nasce da coerenza visiva, storytelling curato e materiali selezionati. Qui ogni elemento comunica valore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-8">
            {[
              { icon: Heart, title: t('features.handmade'), desc: t('features.handmadeDesc') },
              { icon: Sparkles, title: t('features.quality'), desc: t('features.qualityDesc') },
              { icon: Truck, title: t('features.shipping'), desc: t('features.shippingDesc') }
            ].map((item) => (
              <article key={item.title} className="rounded-[1.6rem] border border-[#ecdcc8] bg-white/90 backdrop-blur-md p-7 shadow-[0_20px_45px_rgba(33,26,23,0.08)] hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(33,26,23,0.13)]">
                <div className="w-14 h-14 rounded-2xl bg-[#fff5e6] border border-[#efdabc] flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-[#a53b2f]" />
                </div>
                <h3 className="font-display text-2xl text-[#2f221b] mb-3">{item.title}</h3>
                <p className="text-[#6f5749] leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-[linear-gradient(180deg,#fffaf4_0%,#fffdfb_100%)] border-y border-[#f1e3d2]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 md:mb-16">
            <h2 className="font-display text-4xl md:text-6xl text-[#2f211b] mb-4">{t('featuredProducts')}</h2>
            <p className="text-[#705849] max-w-2xl mx-auto">Una selezione con impatto visivo forte, pensata per raccontare immediatamente la qualità del brand.</p>
            <div className="w-28 h-1.5 mx-auto rounded-full bg-[linear-gradient(90deg,#a53b2f,#f2c96b)] mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {products.slice(0, 5).map((product, index) => (
              <div key={product.id} className="animate-fadeIn" style={{ animationDelay: `${index * 110}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#6f5749] mb-2">{t('noProducts')}</p>
              <p className="text-sm text-[#8d7465]">{t('addProductsFromAdmin')}</p>
            </div>
          )}

          <div className="text-center mt-14">
            <Link
              href="/prodotti"
              className="inline-flex items-center gap-2 text-base md:text-lg btn-lux-primary"
            >
              {t('viewAll')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(130deg,#2b1913_0%,#533126_45%,#8f4f33_100%)]" />
        <div className="absolute inset-0 opacity-35">
          <div className="absolute -left-8 -bottom-32 h-80 w-80 rounded-full bg-[#f6d99c] blur-3xl" />
          <div className="absolute -right-20 -top-16 h-96 w-96 rounded-full bg-[#d48f5a] blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6">Cerchi un regalo memorabile?</h2>
          <p className="text-lg md:text-2xl max-w-3xl mx-auto text-white/85 mb-10 leading-relaxed">
            Portachiavi artigianali, personalizzazioni su richiesta e un&apos;esperienza premium dal primo click alla consegna.
          </p>
          <Link
            href="/contatti"
            className="inline-flex items-center gap-2 rounded-full px-9 py-4 text-base md:text-lg font-semibold bg-[#f2c96b] text-[#3f2a20] shadow-[0_22px_45px_rgba(0,0,0,0.35)] hover:scale-[1.03] float-soft"
          >
            Contattaci ora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
