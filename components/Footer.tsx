'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageIndicator from './LanguageIndicator';
import toast from 'react-hot-toast';

export default function Footer() {
    const { t } = useLanguage();
    const [siteName, setSiteName] = useState('Il Desiderio di una Stella');
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
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/20 pt-8">
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
