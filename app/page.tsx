'use client';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
<<<<<<< HEAD
import { Star, Sparkles, Heart } from 'lucide-react';
=======
import { Sparkles, Heart, ShieldCheck, Truck, Star, ArrowRight, BadgeCheck } from 'lucide-react';
>>>>>>> master
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [siteName, setSiteName] = useState('Il Desiderio di una Stella');
  const [logo, setLogo] = useState('');

  useEffect(() => {
    // Carica prodotti dal database
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
      })
      .catch(() => setProducts([]));

    // Carica impostazioni
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings?.siteName) {
          setSiteName(data.settings.siteName);
        }
        if (data.settings?.logo) {
          setLogo(data.settings.logo);
        }
      })
      .catch(() => { });
  }, []);

  return (
<<<<<<< HEAD
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="text-white py-24 md:py-32 relative overflow-hidden" style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-accent))`, backgroundSize: '200% 200%', animation: 'gradientShift 15s ease infinite' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-white rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-8 transform hover:scale-110 transition-transform duration-500">
            {logo ? (
              <img src={logo} alt="Logo" className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl animate-fadeIn" />
            ) : (
              <Star className="w-20 h-20 md:w-24 md:h-24 animate-pulse drop-shadow-2xl" style={{ fill: 'var(--color-accent)', color: 'var(--color-accent)' }} />
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-slideUp drop-shadow-lg">
            {siteName}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto animate-slideUp animation-delay-200 leading-relaxed px-4">
            {t('heroSubtitle')}
          </p>
          <Link
            href="/prodotti"
            className="px-8 py-4 md:px-10 md:py-5 rounded-full text-base md:text-lg font-semibold hover:scale-105 hover:shadow-2xl transition-all duration-300 inline-block animate-slideUp animation-delay-400 shadow-xl"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text)' }}
          >
            {t('shopNow')} →
          </Link>
=======
    <div className="overflow-hidden bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.08),transparent_35%),linear-gradient(180deg,#fff_0%,#faf7ff_38%,#fff_100%)]">
      <section className="pt-4 pb-2">
        <div className="container mx-auto px-4">
          <div className="rounded-full border bg-white/80 backdrop-blur-md shadow-sm px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderColor: 'rgba(147, 51, 234, 0.12)' }}>
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              <BadgeCheck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              <span>Brand artigianale con identità personalizzata e logo dinamico</span>
            </div>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500">
              <span className="inline-flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Pagamenti sicuri</span>
              <span className="inline-flex items-center gap-1"><Truck className="w-4 h-4" /> Spedizione rapida</span>
              <span className="inline-flex items-center gap-1"><Star className="w-4 h-4" /> Supporto umano</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(147,51,234,0.98),rgba(99,102,241,0.94),rgba(253,224,71,0.88))]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-8 left-8 w-64 h-64 bg-white/70 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-36 right-12 w-80 h-80 bg-white/60 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-24 left-1/2 w-96 h-96 bg-white/50 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 backdrop-blur-md mb-6 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Portachiavi artigianali, branding premium, esperienza curata
              </div>
              <div className="flex justify-center lg:justify-start mb-6 transform hover:scale-110 transition-transform duration-500">
                {logo && (
                  <img src={logo} alt={`Logo ${siteName}`} className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl animate-fadeIn" />
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight animate-slideUp drop-shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                {siteName}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-12 max-w-2xl mx-auto lg:mx-0 animate-slideUp animation-delay-200 leading-relaxed text-white/90">
                Portachiavi artigianali che trasformano un accessorio in dichiarazione di stile. Fatto a mano con materiali premium, curato in ogni dettaglio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slideUp animation-delay-400 mb-10">
                <Link
                  href="/prodotti"
                  className="px-8 py-4 md:px-10 md:py-5 rounded-full text-base md:text-lg font-semibold hover:scale-105 hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-xl"
                  style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text)' }}
                >
                  Sfoglia collezione
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/chi-siamo"
                  className="px-8 py-4 md:px-10 md:py-5 rounded-full text-base md:text-lg font-semibold hover:scale-105 hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center gap-2 border border-white/20 bg-white/5 backdrop-blur-md"
                >
                  Leggi la storia
                </Link>
              </div>
              <div className="rounded-2xl bg-white/8 border border-white/15 backdrop-blur-md px-6 md:px-8 py-5 md:py-6 inline-flex gap-6 md:gap-8 animate-slideUp animation-delay-400">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black">✓</div>
                  <p className="text-xs md:text-sm text-white/75 mt-1">Artigianalità certificata</p>
                </div>
                <div className="h-12 w-px bg-white/10"></div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black">🛡️</div>
                  <p className="text-xs md:text-sm text-white/75 mt-1">Garanzia soddisfazione</p>
                </div>
                <div className="h-12 w-px bg-white/10"></div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black">⚡</div>
                  <p className="text-xs md:text-sm text-white/75 mt-1">Spedizione in 48h</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-10 max-w-2xl mx-auto lg:mx-0">
                {[
                  { value: '100%', label: 'Handmade' },
                  { value: '24/7', label: 'Shop online' },
                  { value: '5★', label: 'Esperienza premium' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md px-4 py-4 text-center shadow-lg">
                    <div className="text-xl sm:text-2xl font-black">{item.value}</div>
                    <div className="text-xs sm:text-sm text-white/80 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-90" />
              <div className="relative bg-white/12 backdrop-blur-2xl border border-white/20 rounded-4xl p-6 md:p-8 shadow-[0_24px_80px_rgba(31,41,55,0.25)]">
                <div className="grid gap-4">
                  <div className="rounded-3xl bg-white p-5 md:p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm uppercase tracking-[0.24em] text-gray-500 font-semibold">Signature Collection</p>
                      <BadgeCheck className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <div className="rounded-2xl bg-linear-to-br from-purple-50 to-indigo-50 p-5 border border-purple-100">
                        <p className="text-xs uppercase text-gray-500 mb-2">Artigianalità</p>
                        <p className="text-lg font-bold text-gray-900">Dettaglio curato</p>
                        <p className="text-sm text-gray-600 mt-2">Ogni prodotto racconta il brand e la qualità del lavoro manuale.</p>
                      </div>
                      <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-inner">
                        {products[0]?.images?.[0]?.url ? (
                          <img src={products[0].images[0].url} alt={products[0].name} className="w-full h-full object-cover aspect-square" />
                        ) : (
                          <div className="aspect-square flex items-center justify-center bg-linear-to-br from-purple-100 to-yellow-50 text-5xl">🔑</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { title: 'Logo dinamico', desc: 'Brand coerente ovunque' },
                      { title: 'Checkout rapido', desc: 'PayPal + consegna' },
                      { title: 'PDF ordine', desc: 'Mail post-acquisto' },
                    ].map((item) => (
                      <div key={item.title} className="rounded-2xl bg-white/90 p-4 shadow-lg border border-white/60">
                        <p className="font-bold text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
>>>>>>> master
        </div>
      </section>

      {/* Features Section */}
<<<<<<< HEAD
      <section className="py-20 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center group hover:scale-105 transition-all duration-300 p-6 rounded-2xl hover:shadow-2xl">
=======
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-3">Perché sceglierci</p>
            <h2 className="text-3xl md:text-5xl font-black mb-6" style={{ color: 'var(--color-text)' }}>Premium handmade, accessibile a tutti</h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">Design elegante, qualità senza compromessi, e un'esperienza che racconta cura dal primo click.</p>
            <div className="flex justify-center gap-4 text-sm flex-wrap">
              <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 font-semibold text-purple-700"><BadgeCheck className="w-4 h-4" /> 100% Handmade</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 font-semibold text-emerald-700"><ShieldCheck className="w-4 h-4" /> Qualità garantita</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center group hover:-translate-y-2 transition-all duration-300 p-6 rounded-[1.75rem] bg-white border border-gray-100 shadow-[0_18px_45px_rgba(31,41,55,0.08)]">
>>>>>>> master
              <div className="flex justify-center mb-6">
                <div className="relative p-4 rounded-full transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                  <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}></div>
                  <Heart className="w-12 h-12 md:w-14 md:h-14 relative z-10" style={{ color: 'var(--color-primary)' }} />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>{t('features.handmade')}</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {t('features.handmadeDesc')}
              </p>
            </div>
<<<<<<< HEAD
            <div className="text-center group hover:scale-105 transition-all duration-300 p-6 rounded-2xl hover:shadow-2xl">
=======
            <div className="text-center group hover:-translate-y-2 transition-all duration-300 p-6 rounded-[1.75rem] bg-white border border-gray-100 shadow-[0_18px_45px_rgba(31,41,55,0.08)]">
>>>>>>> master
              <div className="flex justify-center mb-6">
                <div className="relative p-4 rounded-full transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                  <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}></div>
                  <Sparkles className="w-12 h-12 md:w-14 md:h-14 relative z-10" style={{ color: 'var(--color-primary)' }} />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>{t('features.handmade')}</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {t('features.handmadeDesc')}
              </p>
            </div>
<<<<<<< HEAD
            <div className="text-center group hover:scale-105 transition-all duration-300 p-6 rounded-2xl hover:shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="relative p-4 rounded-full transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                  <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}></div>
                  <Star className="w-12 h-12 md:w-14 md:h-14 relative z-10" style={{ color: 'var(--color-primary)', fill: 'var(--color-primary)' }} />
=======
            <div className="text-center group hover:-translate-y-2 transition-all duration-300 p-6 rounded-[1.75rem] bg-white border border-gray-100 shadow-[0_18px_45px_rgba(31,41,55,0.08)]">
              <div className="flex justify-center mb-6">
                <div className="relative p-4 rounded-full transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                  <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}></div>
                  <Sparkles className="w-12 h-12 md:w-14 md:h-14 relative z-10" style={{ color: 'var(--color-primary)' }} />
>>>>>>> master
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>{t('features.quality')}</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {t('features.qualityDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
<<<<<<< HEAD
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              {t('featuredProducts')}
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full mb-6" style={{ backgroundColor: 'var(--color-accent)' }}></div>
=======
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-3">Curated selection</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              {t('featuredProducts')}
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">Una selezione ordinata, con visual pulito e prodotto al centro: così il catalogo comunica più valore e meno confusione.</p>
            <div className="w-24 h-1 mx-auto rounded-full mt-6" style={{ backgroundColor: 'var(--color-accent)' }}></div>
>>>>>>> master
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {products.slice(0, 5).map((product, index) => (
              <div key={product.id} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">{t('noProducts')}</p>
              <p className="text-sm text-gray-500">{t('addProductsFromAdmin')}</p>
            </div>
          )}
          <div className="text-center mt-16">
            <Link
              href="/prodotti"
              className="px-8 md:px-10 py-3 md:py-4 rounded-full hover:scale-105 hover:shadow-xl transition-all duration-300 inline-block font-semibold text-sm md:text-base"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
            >
              {t('viewAll')} →
            </Link>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* CTA Section */}
      <section className="text-white py-20 md:py-28 relative overflow-hidden" style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 animate-slideUp">
            Cerchi un Regalo Speciale?
          </h2>
          <p className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed animate-slideUp animation-delay-200 px-4">
            I nostri portachiavi artigianali sono perfetti per sorprendere chi ami.<br className="hidden md:block" />
            <span className="text-base md:text-xl opacity-90 mt-2 block">Personalizzazione disponibile su richiesta 🎁</span>
          </p>
          <Link
            href="/contatti"
            className="px-8 md:px-10 py-3 md:py-4 rounded-full hover:scale-105 hover:shadow-2xl transition-all duration-300 inline-block font-semibold text-sm md:text-base shadow-xl animate-slideUp animation-delay-400"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text)' }}
          >
            Contattaci Ora →
          </Link>
=======
      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-[radial-gradient(circle_at_bottom,rgba(147,51,234,0.08),transparent_32%)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slideUp">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-3">Storie di clienti</p>
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: 'var(--color-text)' }}>
              Amato da centinaia di clienti
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base">Scopri cosa dicono di noi i nostri clienti più esigenti</p>
            <div className="w-24 h-1 mx-auto rounded-full mt-6" style={{ backgroundColor: 'var(--color-accent)' }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Testimonial 1 */}
            <div className="group rounded-3xl overflow-hidden animate-fadeIn" style={{ animationDelay: '100ms' }}>
              <div className="relative h-full rounded-3xl border border-white/70 bg-white/95 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(147,51,234,0.08)] hover:shadow-[0_24px_64px_rgba(147,51,234,0.16)] transition-all duration-500 flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 flex-1 text-sm md:text-base">
                  "Qualità eccezionale, dettagli perfetti. I portachiavi sono diventati il mio accessorio preferito. Miglior acquisto dell'anno!"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200/50">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-200 to-indigo-200 flex items-center justify-center font-bold" style={{ color: 'var(--color-primary)' }}>
                    SF
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>Sofia Fabbri</p>
                    <p className="text-xs text-gray-500">Design Studio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group rounded-3xl overflow-hidden animate-fadeIn" style={{ animationDelay: '150ms' }}>
              <div className="relative h-full rounded-3xl border border-white/70 bg-white/95 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(147,51,234,0.08)] hover:shadow-[0_24px_64px_rgba(147,51,234,0.16)] transition-all duration-500 flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 flex-1 text-sm md:text-base">
                  "Artigianalità vera, non superficiale. Si vede che dietro c'è passione e competenza. Ritorno cliente al 100%!"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200/50">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-200 to-orange-200 flex items-center justify-center font-bold" style={{ color: 'var(--color-primary)' }}>
                    MC
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>Marco Cattaneo</p>
                    <p className="text-xs text-gray-500">Imprenditore</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="group rounded-3xl overflow-hidden animate-fadeIn" style={{ animationDelay: '200ms' }}>
              <div className="relative h-full rounded-3xl border border-white/70 bg-white/95 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(147,51,234,0.08)] hover:shadow-[0_24px_64px_rgba(147,51,234,0.16)] transition-all duration-500 flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 flex-1 text-sm md:text-base">
                  "Packaging lussuoso, prodotto premium. È stato il regalo perfetto. I miei ospiti non smettono di farmi domande!"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200/50">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-pink-200 to-rose-200 flex items-center justify-center font-bold" style={{ color: 'var(--color-primary)' }}>
                    LG
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>Lucia Genovese</p>
                    <p className="text-xs text-gray-500">Marketing Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-8 px-8 py-5 rounded-full bg-white/80 backdrop-blur-xl border border-white/70 shadow-lg">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black" style={{ color: 'var(--color-primary)' }}>500+</p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Clienti soddisfatti</p>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black" style={{ color: 'var(--color-primary)' }}>4.9/5</p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Rating medio</p>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black" style={{ color: 'var(--color-primary)' }}>24h</p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Supporto</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(31,41,55,0.98),rgba(147,51,234,0.96),rgba(99,102,241,0.9))]" />
        <div className="absolute inset-0 opacity-15">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto rounded-4xl border border-white/15 bg-white/10 backdrop-blur-2xl p-8 md:p-12 text-center shadow-[0_30px_90px_rgba(17,24,39,0.25)]">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-4">Personalizzazione su misura</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 animate-slideUp">
              Trasforma un accessorio in identità.
            </h2>
            <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed animate-slideUp animation-delay-200 px-4 text-white/90">
              Portachiavi handmade, materiali premium, design che parla per te.
              <span className="text-base md:text-xl opacity-90 mt-4 block">Contattaci per richiedere il tuo capolavoro personale 🔑✨</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slideUp animation-delay-400">
              <Link
                href="/contatti"
                className="px-8 md:px-10 py-3 md:py-4 rounded-full hover:scale-105 hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center gap-2 font-semibold text-sm md:text-base shadow-xl"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text)' }}
              >
                Richiedi personalizzazione
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/prodotti"
                className="px-8 md:px-10 py-3 md:py-4 rounded-full border border-white/30 bg-white/5 hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center gap-2 font-semibold text-sm md:text-base text-white"
              >
                Vedi collezione
              </Link>
            </div>
            <p className="text-xs md:text-sm text-white/60 text-center">💬 Risposta entro 24 ore | 🎁 Packaging premium incluso | ✨ Garanzia soddisfazione</p>
          </div>
>>>>>>> master
        </div>
      </section >
    </div >
  );
}
