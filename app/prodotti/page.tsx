'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';

export default function ProdottiPage() {
    const { t } = useLanguage();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        fetch('/api/admin/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data.products || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Errore caricamento prodotti:', err);
                setLoading(false);
            });
    }, []);

    const categories = Array.from(new Set(products.map(p => p.category)));

    let filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    // Apply search filter
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    return (
        <div className="min-h-screen py-12 md:py-20" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16 animate-slideUp">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6" style={{ color: 'var(--color-text)' }}>
                        {searchQuery ? `${t('searchResults')} "${searchQuery}"` : t('allProducts')}
                    </h1>
                    <div className="w-24 h-1 mx-auto rounded-full mb-6" style={{ backgroundColor: 'var(--color-accent)' }}></div>
                    <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed px-4" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
                        {searchQuery
                            ? `${filteredProducts.length} ${filteredProducts.length === 1 ? t('productFound') : t('productsFound')}`
                            : t('productsDescription')
                        }
                    </p>
                </div>

                {/* Filtri per Categoria */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 md:mb-16 animate-slideUp animation-delay-200 px-2">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 text-sm sm:text-base ${selectedCategory === 'all' ? 'shadow-lg' : ''}`}
                        style={{
                            backgroundColor: selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-card-bg)',
                            color: selectedCategory === 'all' ? 'var(--color-button-text)' : 'var(--color-text)',
                            borderWidth: selectedCategory === 'all' ? '0' : '2px',
                            borderColor: 'var(--color-border)'
                        }}
                    >
                        {t('all')} {selectedCategory === 'all' && `(${products.length})`}
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold hover:scale-105 hover:shadow-md transition-all duration-300 text-sm sm:text-base ${selectedCategory === category ? 'shadow-lg' : ''}`}
                            style={{
                                backgroundColor: selectedCategory === category ? 'var(--color-primary)' : 'var(--color-card-bg)',
                                color: selectedCategory === category ? 'var(--color-button-text)' : 'var(--color-text)',
                                borderWidth: selectedCategory === category ? '0' : '2px',
                                borderColor: 'var(--color-border)'
                            }}
                        >
                            {category} {selectedCategory === category && `(${products.filter(p => p.category === category).length})`}
                        </button>
                    ))}
                </div>

                {/* Contatore Risultati */}
                <div className="text-center mb-8">
                    <p className="text-sm md:text-base" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'prodotto trovato' : 'prodotti trovati'}
                    </p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-primary)' }}></div>
                        <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>{t('loading')}</p>
                    </div>
                ) : (
                    <>
                        {/* Griglia Prodotti */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                            {filteredProducts.map((product, index) => (
                                <div key={product.id} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        {/* Messaggio Nessun Risultato */}
                        {filteredProducts.length === 0 && !loading && (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                                    {t('noProducts')}
                                </h3>
                                <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                                    {selectedCategory === 'all' ? t('addProductsFromAdmin') : t('tryDifferentCategory')}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
