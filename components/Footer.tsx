'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageIndicator from './LanguageIndicator';
import toast from 'react-hot-toast';

export default function Footer() {
    const { t } = useLanguage();
    const [siteName, setSiteName] = useState('Il Desiderio di una Stella');
    const [logo, setLogo] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);

    const loadSettings = () => {
        fetch('/api/settings', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (data.settings?.siteName) {
                    setSiteName(data.settings.siteName);
                }
                if (data.settings?.logo) {
                    setLogo(data.settings.logo);
                }
                if (data.settings?.contactEmail) {
                    setContactEmail(data.settings.contactEmail);
                }
            })
            .catch(() => { })
            .finally(() => setSettingsLoaded(true));
    };

    useEffect(() => {
        loadSettings();

        const onSettingsUpdated = () => loadSettings();
        window.addEventListener('site-settings-updated', onSettingsUpdated);

        return () => {
            window.removeEventListener('site-settings-updated', onSettingsUpdated);
        };
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
        } catch {
            toast.error('Errore nell\'iscrizione alla newsletter');
        } finally {
            setSubscribing(false);
        }
    };

    return (
        <footer className="text-white pt-12 sm:pt-16 pb-6 sm:pb-8 mt-16 sm:mt-20 border-t border-[#e8d6c0]" style={{ background: `linear-gradient(145deg, #3a2219, #8d4e31)` }}>
            <div className="container mx-auto px-4">
                <div className="mb-8 rounded-2xl border border-white/20 bg-white/8 backdrop-blur-md p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-[#f6dbab] mb-1">{t('premiumExperience')}</p>
                        <p className="text-sm sm:text-base text-white/90">{t('premiumTagline')}</p>
                    </div>
                    <a href="/contatti" className="btn-lux-secondary text-center whitespace-nowrap">{t('talkToUs')}</a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Colonna 1: Brand */}
                    <div className="glass-panel rounded-2xl p-5">
                        <div className="flex items-center space-x-2 mb-4">
                            {logo ? (
                                <Image
                                    src={logo}
                                    alt="Logo Il Desiderio di una Stella"
                                    width={40}
                                    height={40}
                                    unoptimized
                                    className="w-10 h-10 object-contain drop-shadow-lg"
                                />
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
                            {settingsLoaded && contactEmail ? (
                                <a href={`mailto:${contactEmail}`} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-110" aria-label="Email">
                                    <Mail className="w-5 h-5" />
                                </a>
                            ) : (
                                <span className="p-2 bg-white/10 rounded-lg opacity-60" aria-hidden="true">
                                    <Mail className="w-5 h-5" />
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Colonna 2: Link Rapidi */}
                    <div className="glass-panel rounded-2xl p-5">
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
                    <div className="glass-panel rounded-2xl p-5">
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
                                    <span>{t('trackOrder')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/resi" className="text-white/80 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2">
                                    <span className="text-yellow-300">→</span>
                                    <span>{t('returnsRefunds')}</span>
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
                                    <span>{t('termsAndConditions')}</span>
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
                    <div className="glass-panel rounded-2xl p-5">
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
