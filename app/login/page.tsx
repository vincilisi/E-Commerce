'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [logo, setLogo] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings?.logo) {
                    setLogo(data.settings.logo);
                }
            })
            .catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Credenziali non valide');
                return;
            }

            toast.success('Login effettuato!');
            router.push('/');
            router.refresh();
        } catch (error) {
            toast.error('Errore durante il login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.2),transparent_36%),linear-gradient(135deg,rgba(31,41,55,0.98),rgba(147,51,234,0.94),rgba(99,102,241,0.9))]">
            <Toaster position="top-center" />

            <div className="max-w-md w-full rounded-4xl shadow-[0_28px_80px_rgba(17,24,39,0.35)] p-6 sm:p-8 border border-white/20 bg-white/90 backdrop-blur-2xl" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                <div className="mb-5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700"><ShieldCheck className="w-3.5 h-3.5" /> Accesso sicuro</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 font-semibold text-purple-700"><Sparkles className="w-3.5 h-3.5" /> Esperienza premium</span>
                </div>
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        {logo && <img src={logo} alt="Logo" className="w-16 h-16 object-contain drop-shadow-xl" loading="lazy" role="img" />}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight" style={{ color: 'var(--color-text)' }}>
                        Benvenuto
                    </h1>
                    <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                        Accedi al tuo account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="tua@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            <Lock className="w-4 h-4 inline mr-2" />
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50 shadow-lg"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                    >
                        {loading ? 'Accesso in corso...' : 'Accedi'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                        Non hai un account?{' '}
                        <Link href="/registrati" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
                            Registrati
                        </Link>
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-500">
                        Account demo admin:<br />
                        <span className="font-mono text-xs">admin@stella.it / admin123</span>
                    </p>
                </div>
            </div>
        </div>
    );
}