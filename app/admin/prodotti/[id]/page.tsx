'use client';
import { useEffect, useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function ModificaProdotto() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Classici',
        materials: [''],
        dimensions: '',
        inStock: true
    });

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = async () => {
        try {
            const res = await fetch(`/api/admin/products/${productId}`);
            if (res.ok) {
                const { product } = await res.json();
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price.toString(),
                    category: product.category,
                    materials: product.materials || [''],
                    dimensions: product.dimensions || '',
                    inStock: product.inStock
                });
            } else {
                toast.error('Prodotto non trovato');
                router.push('/admin/prodotti');
            }
        } catch (error) {
            toast.error('Errore nel caricamento');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.price) {
            toast.error('Compila tutti i campi obbligatori');
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    category: formData.category,
                    materials: formData.materials.filter(m => m.trim() !== ''),
                    dimensions: formData.dimensions,
                    inStock: formData.inStock
                })
            });

            if (res.ok) {
                toast.success('Prodotto aggiornato con successo!');
                setTimeout(() => router.push('/admin/prodotti'), 1500);
            } else {
                toast.error('Errore nell\'aggiornamento del prodotto');
            }
        } catch (error) {
            toast.error('Errore nell\'aggiornamento del prodotto');
        } finally {
            setSubmitting(false);
        }
    };

    const addMaterial = () => {
        setFormData({ ...formData, materials: [...formData.materials, ''] });
    };

    const removeMaterial = (index: number) => {
        const newMaterials = formData.materials.filter((_, i) => i !== index);
        setFormData({ ...formData, materials: newMaterials });
    };

    const updateMaterial = (index: number, value: string) => {
        const newMaterials = [...formData.materials];
        newMaterials[index] = value;
        setFormData({ ...formData, materials: newMaterials });
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Caricamento...</div>;
    }

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
            <Toaster position="top-center" />

            <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/admin/prodotti" className="hover:opacity-80 mb-6 inline-block" style={{ color: 'var(--color-primary)' }}>
                    ← Torna ai Prodotti
                </Link>

                <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                    <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Modifica Prodotto</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Nome Prodotto *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                placeholder="es. Portachiavi Stelle Danzanti"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Descrizione *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                placeholder="Descrizione dettagliata del prodotto..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Prezzo (€) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    placeholder="12.50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Categoria *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                >
                                    <option value="Classici">Classici</option>
                                    <option value="Personalizzati">Personalizzati</option>
                                    <option value="Stagionali">Stagionali</option>
                                    <option value="Novità">Novità</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Materiali</label>
                            {formData.materials.map((material, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-2">
                                    <input
                                        type="text"
                                        value={material}
                                        onChange={(e) => updateMaterial(index, e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="es. Perline in vetro"
                                    />
                                    {formData.materials.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMaterial(index)}
                                            className="text-red-600 hover:text-red-700 p-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addMaterial}
                                className="text-purple-600 hover:text-purple-700 flex items-center space-x-1 mt-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Aggiungi Materiale</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Dimensioni</label>
                            <input
                                type="text"
                                value={formData.dimensions}
                                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                placeholder="es. 8cm x 3cm"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="inStock"
                                checked={formData.inStock}
                                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-600"
                            />
                            <label htmlFor="inStock" className="ml-3 text-gray-700 font-semibold">
                                Disponibile in magazzino
                            </label>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => router.push('/admin/prodotti')}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Annulla
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-3 rounded-lg hover:opacity-90 transition flex items-center space-x-2 disabled:opacity-50"
                                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                            >
                                <Save className="w-5 h-5" />
                                <span>{submitting ? 'Salvataggio...' : 'Salva Modifiche'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
