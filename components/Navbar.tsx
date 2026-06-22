'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut, Menu, X, Search, Heart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const getTotalItems = useCartStore(state => state.getTotalItems);
    const wishlistItems = useWishlistStore(state => state.items);
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [siteName, setSiteName] = useState('Il Desiderio di una Stella');
    const [logo, setLogo] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSettings, setSearchSettings] = useState({
        searchBgColor: '#ffffff',
        searchTextColor: '#374151',
        searchPlaceholder: '#9ca3af',
        searchBorderColor: '#e5e7eb',
        searchIconColor: '#6b7280'
    });
    const router = useRouter();

    const checkUser = () => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                console.log('User data:', data.user); // Debug
                setUser(data.user);
            })
            .catch(() => setUser(null));
    };

    const loadSiteSettings = () => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings?.siteName) {
                    setSiteName(data.settings.siteName);
                }
                if (data.settings?.logo !== undefined) {
                    setLogo(data.settings.logo || '');
                }
                if (data.settings) {
                    setSearchSettings({
                        searchBgColor: data.settings.searchBgColor || '#ffffff',
                        searchTextColor: data.settings.searchTextColor || '#374151',
                        searchPlaceholder: data.settings.searchPlaceholder || '#9ca3af',
                        searchBorderColor: data.settings.searchBorderColor || '#e5e7eb',
                        searchIconColor: data.settings.searchIconColor || '#6b7280'
                    });
                }
            })
            .catch(() => { });
    };

    useEffect(() => {
        checkUser();
        loadSiteSettings();

        // Aggiorna logo/nome in tempo reale quando l'admin salva le impostazioni
        window.addEventListener('siteSettingsUpdated', loadSiteSettings);

        // Ricarica user ogni volta che la pagina diventa visibile
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                checkUser();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', checkUser);

        return () => {
            window.removeEventListener('siteSettingsUpdated', loadSiteSettings);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', checkUser);
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

    return (
        <>
            <nav className="sticky top-0 z-50 text-white shadow-[0_20px_60px_rgba(31,41,55,0.22)] backdrop-blur-md border-b border-white/10" style={{ background: `linear-gradient(135deg, rgba(31,41,55,0.95), rgba(147,51,234,0.92), rgba(99,102,241,0.9))` }}>
                <div className="container mx-auto px-4 py-3 md:py-4">
                    <div className="flex items-center justify-between gap-4">
                        <Link href="/" className="flex items-center space-x-3 text-xl sm:text-2xl font-black tracking-tight hover:scale-[1.02] transition-transform duration-300">
                            {logo && (
                                <img src={logo} alt={`Logo ${siteName}`} className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-2xl" loading="lazy" role="img" />
                            )}
                            <span className="hidden sm:inline leading-none">{siteName}</span>
                        </Link>

                        {/* Search Bar - Desktop */}
                        <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                            <form onSubmit={handleSearch} className="w-full relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('search')}
                                    className="w-full px-4 py-3 pr-12 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-lg"
                                    style={{
                                        backgroundColor: searchSettings.searchBgColor,
                                        color: searchSettings.searchTextColor,
                                        borderColor: searchSettings.searchBorderColor,
                                        borderWidth: '1px',
                                        borderStyle: 'solid'
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-80 transition-opacity"
                                    style={{ color: searchSettings.searchIconColor }}
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </form>
                        </div>

                        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                            <Link href="/" className="px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-300 font-medium relative group whitespace-nowrap">
                                {t('home')}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link href="/prodotti" className="px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-300 font-medium relative group whitespace-nowrap">
                                {t('products')}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link href="/chi-siamo" className="px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-300 font-medium relative group whitespace-nowrap">
                                {t('about')}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link href="/contatti" className="px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-300 font-medium relative group whitespace-nowrap">
                                {t('contacts')}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            {user?.role === 'admin' && (
                                <Link href="/admin" className="px-4 py-2 rounded-full hover:scale-105 transition-all duration-300 font-bold shadow-lg" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text)' }}>
                                    {t('admin')}
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center space-x-3 sm:space-x-4">
                            {/* Language Selector */}
                            <LanguageSelector />
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="lg:hidden p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
                                title={t('search')}
                            >
                                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>

                            {/* Wishlist */}
                            <Link href="/preferiti" className="relative p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 hidden sm:block">
                                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <Link href="/account" className="text-xs sm:text-sm hidden lg:inline font-medium hover:text-yellow-300 transition">
                                        {t('hello')}, {user.name}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
                                        title={t('logout')}
                                    >
                                        <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 hidden md:block" title={t('login')}>
                                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                                </Link>
                            )}
                            <Link href="/carrello" className="relative p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110">
                                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </Link>

                            {/* Hamburger Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2.5 hover:bg-white/10 rounded-full transition-all duration-300"
                                aria-label="Menu"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {searchOpen && (
                        <div className="lg:hidden mt-4 animate-slideDown">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('search')}
                                    className="w-full px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                    style={{
                                        backgroundColor: searchSettings.searchBgColor,
                                        color: searchSettings.searchTextColor,
                                        borderColor: searchSettings.searchBorderColor,
                                        borderWidth: '1px',
                                        borderStyle: 'solid'
                                    }}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:opacity-80 transition-opacity"
                                    style={{ color: searchSettings.searchIconColor }}
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeMobileMenu}
                    ></div>
                    <div className="absolute top-18 left-0 right-0 text-white shadow-2xl animate-slideDown border-t border-white/10" style={{ background: `linear-gradient(135deg, rgba(31,41,55,0.97), rgba(147,51,234,0.96), rgba(99,102,241,0.92))` }}>
                        <div className="container mx-auto px-4 py-6 space-y-3">
                            <Link
                                href="/"
                                className="flex items-center gap-2 py-3 px-4 rounded-2xl hover:bg-white/10 transition-all duration-300 font-medium whitespace-nowrap"
                                onClick={closeMobileMenu}
                            >
                                🏠 {t('home')}
                            </Link>
                            <Link
                                href="/prodotti"
                                className="flex items-center gap-2 py-3 px-4 rounded-2xl hover:bg-white/10 transition-all duration-300 font-medium whitespace-nowrap"
                                onClick={closeMobileMenu}
                            >
                                🛍️ {t('products')}
                            </Link>
                            <Link
                                href="/preferiti"
                                className="flex items-center gap-2 py-3 px-4 rounded-2xl hover:bg-white/10 transition-all duration-300 font-medium sm:hidden whitespace-nowrap"
                                onClick={closeMobileMenu}
                            >
                                ❤️ {t('wishlist')} {wishlistItems.length > 0 && `(${wishlistItems.length})`}
                            </Link>
                            <Link
                                href="/chi-siamo"
                                className="flex items-center gap-2 py-3 px-4 rounded-2xl hover:bg-white/10 transition-all duration-300 font-medium whitespace-nowrap"
                                onClick={closeMobileMenu}
                            >
                                ℹ️ {t('about')}
                            </Link>
                            <Link
                                href="/contatti"
                                className="flex items-center gap-2 py-3 px-4 rounded-2xl hover:bg-white/10 transition-all duration-300 font-medium whitespace-nowrap"
                                onClick={closeMobileMenu}
                            >
                                📧 {t('contacts')}
                            </Link>

                            {user?.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 py-3 px-4 rounded-2xl font-bold shadow-lg whitespace-nowrap"
                                    style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text)' }}
                                    onClick={closeMobileMenu}
                                >
                                    ⚙️ {t('admin')}
                                </Link>
                            )}

                            <div className="pt-4 border-t border-white/20">
                                {user ? (
                                    <div className="space-y-3">
                                        <Link
                                            href="/account"
                                            className="flex items-center gap-2 py-3 px-4 rounded-2xl hover:bg-white/10 transition-all duration-300 whitespace-nowrap"
                                            onClick={closeMobileMenu}
                                        >
                                            👤 {t('account')}
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full py-3 px-4 rounded-2xl hover:bg-white/10 transition-all duration-300 font-medium text-left flex items-center space-x-2"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>{t('logout')}</span>
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-2 py-3 px-4 rounded-2xl hover:bg-white/10 transition-all duration-300 font-medium whitespace-nowrap"
                                        onClick={closeMobileMenu}
                                    >
                                        👤 {t('login')}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
