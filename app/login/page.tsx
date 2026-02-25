'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Mail, Lock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

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
        <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: `linear-gradient(to bottom right, var(--color-primary), var(--color-secondary))` }}>
            <Toaster position="top-center" />

            <div className="max-w-md w-full rounded-2xl shadow-2xl p-6 sm:p-8" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Star className="w-16 h-16" style={{ fill: 'var(--color-primary)', color: 'var(--color-primary)' }} />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
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