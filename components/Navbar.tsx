'use client';

import Link from 'next/link';
import { ShoppingCart, Star, User, LogOut, Menu, X, Search, Heart } from 'lucide-react';
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

    useEffect(() => {
        checkUser();

        // Carica il nome del sito e il logo
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings?.siteName) {
                    setSiteName(data.settings.siteName);
                }
                if (data.settings?.logo) {
                    setLogo(data.settings.logo);
                }
                // Carica impostazioni barra di ricerca
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

        // Ricarica user ogni volta che la pagina diventa visibile
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                checkUser();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', checkUser);

        return () => {
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
            <nav className="sticky top-0 z-50 text-white shadow-xl backdrop-blur-sm" style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }}>
                <div className="container mx-auto px-4 py-4 md:py-5">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2 text-xl sm:text-2xl font-bold hover:scale-105 transition-transform duration-300">
                            {logo ? (
                                <img src={logo} alt="Logo Il Desiderio di una Stella" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-lg" loading="lazy" role="img" />
                            ) : (
                                <Star className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-lg" style={{ fill: 'var(--color-accent)', color: 'var(--color-accent)' }} />
                            )}
                            <span className="hidden sm:inline">{siteName}</span>
                        </Link>

                        {/* Search Bar - Desktop */}
                        <div className="hidden lg:flex flex-1 max-w-md mx-8">
                            <form onSubmit={handleSearch} className="w-full relative">
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

                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="hover:text-yellow-300 transition-all duration-300 font-medium relative group">
                                {t('home')}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link href="/prodotti" className="hover:text-yellow-300 transition-all duration-300 font-medium relative group">
                                {t('products')}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link href="/chi-siamo" className="hover:text-yellow-300 transition-all duration-300 font-medium relative group">
                                {t('about')}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link href="/contatti" className="hover:text-yellow-300 transition-all duration-300 font-medium relative group">
                                {t('contacts')}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            {user?.role === 'admin' && (
                                <Link href="/admin" className="px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 font-bold shadow-lg" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text)' }}>
                                    {t('admin')}
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center space-x-3 sm:space-x-4">
                            {/* Language Selector */}
                            <LanguageSelector />
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
                                title={t('search')}
                            >
                                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>

                            {/* Wishlist */}
                            <Link href="/preferiti" className="relative p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110 hidden sm:block">
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
                                        className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
                                        title={t('logout')}
                                    >
                                        <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110 hidden md:block" title={t('login')}>
                                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                                </Link>
                            )}
                            <Link href="/carrello" className="relative p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110">
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
                                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
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
                    <div className="absolute top-[72px] left-0 right-0 text-white shadow-2xl animate-slideDown" style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }}>
                        <div className="container mx-auto px-4 py-6 space-y-4">
                            <Link
                                href="/"
                                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                                onClick={closeMobileMenu}
                            >
                                🏠 {t('home')}
                            </Link>
                            <Link
                                href="/prodotti"
                                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                                onClick={closeMobileMenu}
                            >
                                🛍️ {t('products')}
                            </Link>
                            <Link
                                href="/preferiti"
                                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium sm:hidden"
                                onClick={closeMobileMenu}
                            >
                                ❤️ {t('wishlist')} {wishlistItems.length > 0 && `(${wishlistItems.length})`}
                            </Link>
                            <Link
                                href="/chi-siamo"
                                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                                onClick={closeMobileMenu}
                            >
                                ℹ️ {t('about')}
                            </Link>
                            <Link
                                href="/contatti"
                                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                                onClick={closeMobileMenu}
                            >
                                📧 {t('contacts')}
                            </Link>

                            {user?.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="block py-3 px-4 rounded-lg font-bold shadow-lg"
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
                                            className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                                            onClick={closeMobileMenu}
                                        >
                                            👤 {t('account')}
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium text-left flex items-center space-x-2"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>{t('logout')}</span>
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
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
