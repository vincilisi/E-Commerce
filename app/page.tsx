'use client';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Star, Sparkles, Heart } from 'lucide-react';
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center group hover:scale-105 transition-all duration-300 p-6 rounded-2xl hover:shadow-2xl">
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
            <div className="text-center group hover:scale-105 transition-all duration-300 p-6 rounded-2xl hover:shadow-2xl">
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
            <div className="text-center group hover:scale-105 transition-all duration-300 p-6 rounded-2xl hover:shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="relative p-4 rounded-full transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                  <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}></div>
                  <Star className="w-12 h-12 md:w-14 md:h-14 relative z-10" style={{ color: 'var(--color-primary)', fill: 'var(--color-primary)' }} />
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
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              {t('featuredProducts')}
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full mb-6" style={{ backgroundColor: 'var(--color-accent)' }}></div>
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
        </div>
      </section >
    </div >
  );
}
