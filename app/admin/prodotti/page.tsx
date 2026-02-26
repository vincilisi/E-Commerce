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
                toast.error('Errore nell\'eliminazione');
            }
        } catch (error) {
            toast.error('Errore nell\'eliminazione');
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
            <Toaster position="top-center" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>Gestione Prodotti</h1>
                    <button
                        onClick={() => router.push('/admin/prodotti/nuovo')}
                        className="px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center space-x-2"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuovo Prodotto</span>
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">Caricamento...</div>
                ) : (
                    <div className="rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <table className="w-full">
                            <thead style={{ backgroundColor: 'var(--color-background)' }}>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: 'var(--color-text)', opacity: 0.6 }}>Nome</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: 'var(--color-text)', opacity: 0.6 }}>Prezzo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: 'var(--color-text)', opacity: 0.6 }}>Categoria</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: 'var(--color-text)', opacity: 0.6 }}>Stato</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: 'var(--color-text)', opacity: 0.6 }}>Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            â‚¬{product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {product.inStock ? 'Disponibile' : 'Esaurito'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => window.open(`/prodotti/${product.id}`, '_blank')}
                                                    className="hover:opacity-70"
                                                    style={{ color: 'var(--color-primary)' }}
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/admin/prodotti/${product.id}`)}
                                                    className="hover:opacity-70"
                                                    style={{ color: 'var(--color-primary)' }}
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {products.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                Nessun prodotto trovato. Crea il primo prodotto!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

