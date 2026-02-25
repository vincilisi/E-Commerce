'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Mail, Lock, User as UserIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Le password non coincidono');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('La password deve essere di almeno 6 caratteri');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Errore durante la registrazione');
                return;
            }

            toast.success('Registrazione completata! Effettua il login.');
            router.push('/login');
        } catch (error) {
            toast.error('Errore durante la registrazione');
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
                        Crea un Account
                    </h1>
                    <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                        Registrati per iniziare a fare shopping
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            <UserIcon className="w-4 h-4 inline mr-2" />
                            Nome
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Il tuo nome"
                        />
                    </div>

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
                            placeholder="Minimo 6 caratteri"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            <Lock className="w-4 h-4 inline mr-2" />
                            Conferma Password
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Ripeti la password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                    >
                        {loading ? 'Registrazione in corso...' : 'Registrati'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                        Hai già un account?{' '}
                        <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
                            Accedi
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
