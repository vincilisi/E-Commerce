'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageIndicator from './LanguageIndicator';
import toast from 'react-hot-toast';

export default function Footer() {
    const { t } = useLanguage();
<<<<<<< HEAD
    const [siteName, setSiteName] = useState('Il Desiderio di una Stella');
=======
    const [siteName, setSiteName] = useState('Il tuo sito');
>>>>>>> master
    const [logo, setLogo] = useState('');
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);

    useEffect(() => {
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

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            toast.error('Inserisci un indirizzo email valido');
            return;
        }

        setSubscribing(true);
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newsletterEmail })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || 'Iscrizione completata!');
                setNewsletterEmail('');
            } else {
                toast.error(data.error || 'Errore nell\'iscrizione');
            }
        } catch (error) {
            toast.error('Errore nell\'iscrizione alla newsletter');
        } finally {
            setSubscribing(false);
        }
    };

    return (
<<<<<<< HEAD
        <footer className="text-white pt-12 sm:pt-16 pb-6 sm:pb-8 mt-16 sm:mt-20" style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Colonna 1: Brand */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            {logo ? (
                                <img src={logo} alt="Logo Il Desiderio di una Stella" className="w-10 h-10 object-contain drop-shadow-lg" loading="lazy" role="img" />
                            ) : (
                                <Star className="w-10 h-10 drop-shadow-lg" style={{ fill: 'var(--color-accent)', color: 'var(--color-accent)' }} />
                            )}
                            <h3 className="text-xl font-bold">{siteName}</h3>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed mb-4">
                            {t('productsDescription')}
                        </p>
                        <div className="flex space-x-3">
                            <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-110" aria-label="Facebook">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-110" aria-label="Instagram">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="mailto:info@ildesideriostellar.it" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-110" aria-label="Email">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Colonna 2: Link Rapidi */}
                    <div>
                        <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">{t('quickLinks')}</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2">
                                    <span className="text-yellow-300">→</span>
                                    <span>{t('home')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/prodotti" className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2">
                                    <span className="text-yellow-300">→</span>
                                    <span>{t('products')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/chi-siamo" className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2">
                                    <span className="text-yellow-300">→</span>
                                    <span>{t('about')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/contatti" className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2">
                                    <span className="text-yellow-300">→</span>
                                    <span>{t('contacts')}</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Colonna 3: Servizio Clienti */}
                    <div>
                        <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">{t('customerService')}</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/faq" className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2">
                                    <span className="text-yellow-300">→</span>
                                    <span>FAQ</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/traccia-ordine" className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2">
                                    <span className="text-yellow-300">→</span>
                                    <span>Traccia Ordine</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/resi" className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2">
                                    <span className="text-yellow-300">→</span>
                                    <span>Resi e Rimborsi</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/privacy" className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2">
                                    <span className="text-yellow-300">→</span>
                                    <span>Privacy Policy</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/termini" className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2">
                                    <span className="text-yellow-300">→</span>
                                    <span>Termini e Condizioni</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2">
                                    <span className="text-yellow-300">→</span>
                                    <span>Blog</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Colonna 4: Newsletter */}
                    <div>
                        <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">{t('newsletter')}</h4>
                        <p className="text-white/80 text-sm mb-4">
                            {t('newsletterText')}
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                            <input
                                type="email"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                placeholder={t('yourEmail')}
                                className="w-full px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                required
                            />
                            <button
                                type="submit"
                                disabled={subscribing}
                                className="w-full px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text)' }}
                            >
                                {subscribing ? t('subscribing') : t('subscribe')}
                            </button>
                        </form>
                        <p className="text-white/60 text-xs mt-3">
                            {t('privacyNotice')}
                        </p>
=======
        <footer className="text-white pt-12 sm:pt-16 pb-6 sm:pb-8 mt-16 sm:mt-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(31,41,55,0.98),rgba(147,51,234,0.96),rgba(99,102,241,0.9))]" />
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 relative z-10">
                    <div className="lg:col-span-4">
                        <div className="rounded-[1.75rem] border border-white/15 bg-white/10 backdrop-blur-xl p-6 shadow-[0_18px_45px_rgba(17,24,39,0.18)] h-full">
                            <div className="flex items-center gap-3 mb-4">
                                {logo ? (
                                    <img src={logo} alt={`Logo ${siteName}`} className="w-11 h-11 object-contain drop-shadow-lg" loading="lazy" role="img" />
                                ) : (
                                    <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center text-xl font-black">{siteName.slice(0, 1).toUpperCase()}</div>
                                )}
                                <h3 className="text-xl font-black tracking-tight">{siteName}</h3>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed mb-6">
                                {t('productsDescription')}
                            </p>
                            <div className="flex gap-3 flex-wrap mb-6">
                                <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold border border-white/10">Artigianale</span>
                                <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold border border-white/10">Premium</span>
                                <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold border border-white/10">Branding dinamico</span>
                            </div>
                            <div className="flex space-x-3">
                                <a href="#" className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110" aria-label="Facebook">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110" aria-label="Instagram">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="/contatti" className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110" aria-label="Contatti">
                                    <Mail className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-base sm:text-lg font-black mb-4 tracking-wide uppercase text-white/90">{t('quickLinks')}</h4>
                        <ul className="space-y-3">
                            {[
                                { href: '/', label: t('home') },
                                { href: '/prodotti', label: t('products') },
                                { href: '/chi-siamo', label: t('about') },
                                { href: '/contatti', label: t('contacts') },
                            ].map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-white/75 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2 group">
                                        <span className="text-yellow-300 transition-transform duration-300 group-hover:translate-x-1">→</span>
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h4 className="text-base sm:text-lg font-black mb-4 tracking-wide uppercase text-white/90">{t('customerService')}</h4>
                        <ul className="space-y-3">
                            {[
                                { href: '/faq', label: 'FAQ' },
                                { href: '/traccia-ordine', label: 'Traccia Ordine' },
                                { href: '/legal/resi', label: 'Resi e Rimborsi' },
                                { href: '/legal/privacy', label: 'Privacy Policy' },
                                { href: '/legal/termini', label: 'Termini e Condizioni' },
                                { href: '/blog', label: 'Blog' },
                            ].map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-white/75 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2 group">
                                        <span className="text-yellow-300 transition-transform duration-300 group-hover:translate-x-1">→</span>
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="rounded-[1.75rem] border border-white/15 bg-white/10 backdrop-blur-xl p-6 shadow-[0_18px_45px_rgba(17,24,39,0.18)] h-full">
                            <h4 className="text-base sm:text-lg font-black mb-3 tracking-wide uppercase text-white/90">{t('newsletter')}</h4>
                            <p className="text-white/80 text-sm mb-4">
                                {t('newsletterText')}
                            </p>
                            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder={t('yourEmail')}
                                    className="w-full px-4 py-3 rounded-xl text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-inner"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={subscribing}
                                    className="w-full px-4 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 shadow-lg"
                                    style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text)' }}
                                >
                                    {subscribing ? t('subscribing') : t('subscribe')}
                                </button>
                            </form>
                            <p className="text-white/60 text-xs mt-3">
                                {t('privacyNotice')}
                            </p>
                        </div>
>>>>>>> master
                    </div>
                </div>

                {/* Divider */}
<<<<<<< HEAD
                <div className="border-t border-white/20 pt-8">
=======
                <div className="border-t border-white/15 pt-8 relative z-10">
>>>>>>> master
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <p className="text-white/70 text-sm text-center md:text-left">
                                © {new Date().getFullYear()} {siteName}. {t('allRightsReserved')}.
                            </p>
                            <LanguageIndicator />
                        </div>
                        <p className="text-white/70 text-sm flex items-center space-x-1">
                            <span>{t('madeWithLove')}</span>
                            <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
                            <span>{t('inItaly')}</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
