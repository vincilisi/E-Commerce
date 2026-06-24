'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
}

export default function AdminProdotti() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            toast.error('Errore nel caricamento prodotti');
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success('Prodotto eliminato');
                loadProducts();
            } else {
                const data = await res.json().catch(() => null);
                toast.error(data?.error || 'Errore nell\'eliminazione');
            }
        } catch (error) {
            toast.error('Errore nell\'eliminazione');
        }
    };

    return (
        <div className="page-shell min-h-screen">
            <Toaster position="top-center" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
                    <div>
                        <p className="eyebrow mb-2">Catalogo admin</p>
                        <h1 className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>Gestione Prodotti</h1>
                    </div>
                    <button
                        onClick={() => router.push('/admin/prodotti/nuovo')}
                        className="btn-lux-primary flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuovo Prodotto</span>
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">Caricamento...</div>
                ) : (
                    <div className="admin-grid">
                        {products.map((product) => (
                            <div key={product.id} className="admin-row-card p-5 sm:p-6">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="space-y-2">
                                        <p className="eyebrow">{product.category}</p>
                                        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{product.name}</h2>
                                        <div className="flex flex-wrap gap-3 items-center">
                                            <span className="stat-pill">€{product.price.toFixed(2)}</span>
                                            <span className={`status-badge ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {product.inStock ? 'Disponibile' : 'Esaurito'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => window.open(`/prodotti/${product.id}`, '_blank')} className="icon-action" style={{ color: 'var(--color-primary)' }}>
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => router.push(`/admin/prodotti/${product.id}`)} className="icon-action" style={{ color: 'var(--color-primary)' }}>
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => deleteProduct(product.id)} className="icon-action text-red-600 hover:text-red-900">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {products.length === 0 && (
                            <div className="empty-state-panel text-center py-12 text-gray-500">
                                Nessun prodotto trovato. Crea il primo prodotto!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
