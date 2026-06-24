'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, User, LogOut, Menu, X, Search, Heart, Sparkles } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type SessionUser = {
    id: string;
    name?: string;
    email: string;
    role?: string;
};

export default function Navbar() {
    const getTotalItems = useCartStore(state => state.getTotalItems);
    const wishlistItems = useWishlistStore(state => state.items);
    const { t } = useLanguage();
    const [isHydrated, setIsHydrated] = useState(false);
    const [user, setUser] = useState<SessionUser | null>(null);
    const [siteName, setSiteName] = useState('Il Desiderio di una Stella');
    const [logo, setLogo] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const wishlistCount = isHydrated ? wishlistItems.length : 0;
    const cartCount = isHydrated ? getTotalItems() : 0;

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const checkUser = () => {
        fetch('/api/auth/me', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => setUser(data.user))
            .catch(() => setUser(null));
    };

    useEffect(() => {
        checkUser();

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
                })
                .catch(() => { });
        };

        loadSettings();

        // Ricarica user ogni volta che la pagina diventa visibile
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                checkUser();
                loadSettings();
            }
        };

        const handleSettingsUpdated = () => {
            loadSettings();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', checkUser);
        window.addEventListener('site-settings-updated', handleSettingsUpdated);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', checkUser);
            window.removeEventListener('site-settings-updated', handleSettingsUpdated);
        };
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        setMobileMenuOpen(false);
        router.push('/');
        router.refresh();
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/prodotti?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navItems = [
        { href: '/', label: t('home') },
        { href: '/prodotti', label: t('products') },
        { href: '/chi-siamo', label: t('about') },
        { href: '/contatti', label: t('contacts') }
    ];

    return (
        <>
            <div className="sticky top-0 z-50">
                <div className="hidden md:block border-b border-[#2f1d15] bg-[linear-gradient(120deg,#1c120d,#2b1a13)] text-[#f2ddc8] shadow-[0_10px_24px_rgba(10,6,4,0.45)]">
                    <div className="container mx-auto px-4 py-2 flex items-center justify-between text-xs sm:text-sm">
                        <span className="inline-flex items-center gap-2 font-semibold text-[#f4e6d8]">
                            <Sparkles className="w-3.5 h-3.5 text-[#f2c96b]" />
                            Atelier digitale artigianale: design premium e customer care umano
                        </span>
                        <span className="rounded-full border border-[#5b3a2c] bg-[#3a251b] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#f6d9aa]">
                            Spedizione tracciata 48h
                        </span>
                    </div>
                </div>

                <nav className="border-b border-[#2d1b14] bg-[linear-gradient(140deg,#130c09,#2c1a14_38%,#47291d)] text-white shadow-[0_18px_45px_rgba(8,5,3,0.62)] backdrop-blur-xl">
                    <div className="container mx-auto px-4 py-3 md:py-3.5">
                        <div className="flex items-center justify-between gap-3">
                            <Link href="/" className="flex items-center gap-2.5 min-w-0 hover:opacity-90 transition-opacity">
                                <span className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-[#8a634d] bg-[#fff6e8] shadow-[0_8px_18px_rgba(0,0,0,0.35)]">
                                    {logo ? (
                                        <Image
                                            src={logo}
                                            alt="Logo Il Desiderio di una Stella"
                                            width={44}
                                            height={44}
                                            unoptimized
                                            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                                        />
                                    ) : (
                                        <Star className="w-8 h-8 sm:w-10 sm:h-10" style={{ fill: 'var(--color-accent)', color: 'var(--color-accent)' }} />
                                    )}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[0.62rem] sm:text-xs uppercase tracking-[0.22em] text-[#e8cab1]">Il tuo atelier</p>
                                    <p className="font-display text-base sm:text-xl truncate text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">{siteName}</p>
                                </div>
                            </Link>

                            <div className="hidden lg:flex flex-1 max-w-lg mx-6">
                                <form onSubmit={handleSearch} className="w-full relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t('search')}
                                        className="w-full rounded-full px-5 py-2.5 pr-11 border border-[#5b3a2c] focus:outline-none focus:ring-2 focus:ring-[#f2c96b]"
                                        style={{
                                            backgroundColor: 'rgba(255, 245, 230, 0.14)',
                                            color: '#fff4e1',
                                            borderColor: '#6c4534'
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                        style={{ color: '#f2c96b' }}
                                    >
                                        <Search className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>

                            <div className="hidden md:flex items-center gap-5 lg:gap-6">
                                {navItems.map((item) => (
                                    <Link key={item.href} href={item.href} className="text-sm font-semibold text-[#fff6e8] hover:text-[#f2c96b] transition-colors">
                                        {item.label}
                                    </Link>
                                ))}
                                {user?.role === 'admin' && (
                                    <Link href="/admin" className="rounded-full px-4 py-1.5 font-semibold text-[#2f221b] bg-[#f2c96b] hover:bg-[#f5d78f] transition-colors">
                                        {t('admin')}
                                    </Link>
                                )}
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2.5">
                                <LanguageSelector />
                                <button
                                    onClick={() => setSearchOpen(!searchOpen)}
                                    className="lg:hidden p-2 rounded-full hover:bg-[#ffffff24] transition-colors"
                                    title={t('search')}
                                >
                                    <Search className="w-5 h-5" />
                                </button>

                                <Link href="/preferiti" className="relative p-2 rounded-full hover:bg-[#ffffff24] transition-colors hidden sm:block">
                                    <Heart className="w-5 h-5" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-[11px] font-bold flex items-center justify-center">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>

                                {user ? (
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-full hover:bg-[#ffffff24] transition-colors"
                                        title={t('logout')}
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <Link href="/login" className="p-2 rounded-full hover:bg-[#ffffff24] transition-colors hidden md:block" title={t('login')}>
                                        <User className="w-5 h-5" />
                                    </Link>
                                )}

                                <Link href="/carrello" className="relative p-2 rounded-full hover:bg-[#ffffff24] transition-colors">
                                    <ShoppingCart className="w-5 h-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-[11px] font-bold flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="md:hidden p-2 rounded-full hover:bg-[#ffffff24] transition-colors"
                                    aria-label="Menu"
                                >
                                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>

                        {searchOpen && (
                            <div className="lg:hidden mt-3 animate-slideDown">
                                <form onSubmit={handleSearch} className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t('search')}
                                        className="w-full rounded-full px-4 py-2.5 pr-11 border border-[#6c4534] focus:outline-none focus:ring-2 focus:ring-[#f2c96b]"
                                        style={{
                                            backgroundColor: 'rgba(255, 245, 230, 0.14)',
                                            color: '#fff4e1',
                                            borderColor: '#6c4534'
                                        }}
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                        style={{ color: '#f2c96b' }}
                                    >
                                        <Search className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <button className="absolute inset-0 bg-[#251711]/60 backdrop-blur-sm" onClick={closeMobileMenu} aria-label="Chiudi menu" />
                    <div className="absolute top-0 right-0 h-full w-[86%] max-w-sm p-5 bg-[linear-gradient(180deg,#3d241b,#6b3a28)] text-white shadow-2xl animate-slideDown overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <p className="font-display text-2xl">Menu</p>
                            <button className="p-2 rounded-full hover:bg-white/15" onClick={closeMobileMenu}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block rounded-xl px-4 py-3 bg-white/10 hover:bg-white/16 font-semibold"
                                    onClick={closeMobileMenu}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Link
                                href="/preferiti"
                                className="block rounded-xl px-4 py-3 bg-white/10 hover:bg-white/16 font-semibold"
                                onClick={closeMobileMenu}
                            >
                                {t('wishlist')} {wishlistItems.length > 0 ? `(${wishlistItems.length})` : ''}
                            </Link>
                        </div>

                        <div className="mt-6 pt-5 border-t border-white/20 space-y-2">
                            {user ? (
                                <>
                                    <Link
                                        href="/account"
                                        className="block rounded-xl px-4 py-3 bg-white/10 hover:bg-white/16 font-semibold"
                                        onClick={closeMobileMenu}
                                    >
                                        {t('account')}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left rounded-xl px-4 py-3 bg-white/10 hover:bg-white/16 font-semibold"
                                    >
                                        {t('logout')}
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="block rounded-xl px-4 py-3 bg-white/10 hover:bg-white/16 font-semibold"
                                    onClick={closeMobileMenu}
                                >
                                    {t('login')}
                                </Link>
                            )}

                            {user?.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="block rounded-xl px-4 py-3 bg-[#f2c96b] text-[#2f221b] font-bold"
                                    onClick={closeMobileMenu}
                                >
                                    {t('admin')}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
