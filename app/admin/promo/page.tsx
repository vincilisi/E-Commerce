'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Tag, Percent, Euro, Edit, Trash2, Copy, Check, X } from 'lucide-react';

interface PromoCode {
    id: string;
    code: string;
    type: string;
    value: number;
    minPurchase: number;
    maxUses: number | null;
    usedCount: number;
    active: boolean;
    expiresAt: string | null;
    createdAt: string;
}

export default function PromoCodesAdmin() {
    const [codes, setCodes] = useState<PromoCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: 10,
        minPurchase: 0,
        maxUses: '',
        active: true,
        expiresAt: '',
    });

    useEffect(() => {
        fetchCodes();
    }, []);

    const fetchCodes = async () => {
        try {
            const res = await fetch('/api/admin/promo-codes');
            const data = await res.json();
            setCodes(data);
        } catch (error) {
            console.error('Error fetching promo codes:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, code });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingCode
                ? `/api/admin/promo-codes/${editingCode.id}`
                : '/api/admin/promo-codes';

            const method = editingCode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
                }),
            });

            if (res.ok) {
                fetchCodes();
                resetForm();
            } else {
                const error = await res.json();
                alert(error.error || 'Errore');
            }
        } catch (error) {
            console.error('Error saving promo code:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Sei sicuro di voler eliminare questo codice?')) return;

        try {
            const res = await fetch(`/api/admin/promo-codes/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCodes();
            }
        } catch (error) {
            console.error('Error deleting promo code:', error);
        }
    };

    const handleEdit = (code: PromoCode) => {
        setEditingCode(code);
        setFormData({
            code: code.code,
            type: code.type as 'percentage' | 'fixed',
            value: code.value,
            minPurchase: code.minPurchase,
            maxUses: code.maxUses?.toString() || '',
            active: code.active,
            expiresAt: code.expiresAt ? code.expiresAt.split('T')[0] : '',
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            code: '',
            type: 'percentage',
            value: 10,
            minPurchase: 0,
            maxUses: '',
            active: true,
            expiresAt: '',
        });
        setEditingCode(null);
        setShowForm(false);
    };

    const toggleActive = async (code: PromoCode) => {
        try {
            await fetch(`/api/admin/promo-codes/${code.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...code, active: !code.active }),
            });
            fetchCodes();
        } catch (error) {
            console.error('Error toggling code:', error);
        }
    };

    const copyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const isExpired = (expiresAt: string | null) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Caricamento...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="container mx-auto px-4 max-w-6xl">
                <Link href="/admin" className="flex items-center hover:opacity-80 mb-6" style={{ color: 'var(--color-primary)' }}>
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Torna alla Dashboard
                </Link>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                        🏷️ Codici Promozionali
                    </h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        Nuovo Codice
                    </button>
                </div>

                {/* Form Creazione/Modifica */}
                {showForm && (
                    <div className="rounded-lg shadow-md p-6 mb-8" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                            {editingCode ? '✏️ Modifica Codice' : '➕ Nuovo Codice Promo'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                        Codice *
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            className="flex-1 p-2 rounded border uppercase"
                                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                            placeholder="es. ESTATE2024"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={generateCode}
                                            className="px-3 py-2 rounded border text-sm"
                                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                                        >
                                            Genera
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                        Tipo Sconto *
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                                        className="w-full p-2 rounded border"
                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                    >
                                        <option value="percentage">Percentuale (%)</option>
                                        <option value="fixed">Importo Fisso (€)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                        Valore *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                                            className="w-full p-2 rounded border pr-8"
                                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                            min="0"
                                            max={formData.type === 'percentage' ? 100 : undefined}
                                            step="0.01"
                                            required
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            {formData.type === 'percentage' ? '%' : '€'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                        Acquisto Minimo (€)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.minPurchase}
                                        onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) || 0 })}
                                        className="w-full p-2 rounded border"
                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                        Max Utilizzi
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.maxUses}
                                        onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                                        className="w-full p-2 rounded border"
                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                        min="0"
                                        placeholder="Illimitato"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                        Scadenza
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.expiresAt}
                                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                        className="w-full p-2 rounded border"
                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <span style={{ color: 'var(--color-text)' }}>Attivo</span>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg text-white"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                    {editingCode ? 'Salva Modifiche' : 'Crea Codice'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 rounded-lg border"
                                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                                >
                                    Annulla
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Lista Codici */}
                {codes.length === 0 ? (
                    <div className="rounded-lg shadow-md p-12 text-center" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <Tag className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: 'var(--color-text)' }} />
                        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Nessun codice promo</h3>
                        <p className="text-gray-500 mb-4">Crea il tuo primo codice sconto per iniziare</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-2 rounded-lg text-white"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            Crea Codice
                        </button>
                    </div>
                ) : (
                    <div className="rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr style={{ backgroundColor: 'var(--color-background)' }}>
                                        <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Codice</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Sconto</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Min. Acquisto</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Utilizzi</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Scadenza</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Stato</th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Azioni</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                                    {codes.map((code) => (
                                        <tr key={code.id} className={`${!code.active || isExpired(code.expiresAt) ? 'opacity-60' : ''}`}>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold" style={{ color: 'var(--color-primary)' }}>
                                                        {code.code}
                                                    </span>
                                                    <button
                                                        onClick={() => copyCode(code.code, code.id)}
                                                        className="p-1 rounded hover:bg-gray-100"
                                                        title="Copia codice"
                                                    >
                                                        {copiedId === code.id ? (
                                                            <Check className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="w-4 h-4 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    {code.type === 'percentage' ? (
                                                        <>
                                                            <Percent className="w-4 h-4 text-blue-500" />
                                                            <span className="font-semibold">{code.value}%</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Euro className="w-4 h-4 text-green-500" />
                                                            <span className="font-semibold">€{code.value.toFixed(2)}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {code.minPurchase > 0 ? `€${code.minPurchase.toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="text-gray-600">
                                                    {code.usedCount}{code.maxUses ? `/${code.maxUses}` : ''}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {code.expiresAt ? (
                                                    <span className={isExpired(code.expiresAt) ? 'text-red-500' : 'text-gray-600'}>
                                                        {new Date(code.expiresAt).toLocaleDateString('it-IT')}
                                                        {isExpired(code.expiresAt) && ' (scaduto)'}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">Mai</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => toggleActive(code)}
                                                    className={`px-2 py-1 text-xs rounded-full font-semibold ${code.active && !isExpired(code.expiresAt)
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {code.active && !isExpired(code.expiresAt) ? 'Attivo' : 'Inattivo'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(code)}
                                                        className="p-2 rounded hover:bg-gray-100"
                                                        title="Modifica"
                                                    >
                                                        <Edit className="w-4 h-4 text-gray-500" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(code.id)}
                                                        className="p-2 rounded hover:bg-red-100"
                                                        title="Elimina"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-8 rounded-lg p-6 bg-blue-50 border border-blue-200">
                    <h3 className="text-lg font-bold text-blue-800 mb-3">💡 Come funzionano i codici promo</h3>
                    <ul className="space-y-2 text-sm text-blue-700">
                        <li>• <strong>Percentuale:</strong> Sconto in % sul totale del carrello (es. 10% di sconto)</li>
                        <li>• <strong>Importo Fisso:</strong> Sconto in Euro fisso (es. €5 di sconto)</li>
                        <li>• <strong>Acquisto Minimo:</strong> Il cliente deve spendere almeno questo importo per usare il codice</li>
                        <li>• <strong>Max Utilizzi:</strong> Quante volte il codice può essere usato in totale</li>
                        <li>• <strong>Scadenza:</strong> Dopo questa data il codice non sarà più valido</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
