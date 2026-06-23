<<<<<<< HEAD
﻿'use client';
=======
'use client';

>>>>>>> master
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
            const res = await fetch('/api/admin/products', {
                credentials: "include"   // 🔥 OBBLIGATORIO
            });

            if (!res.ok) {
                throw new Error("Unauthorized");
            }

            const data = await res.json();
            setProducts(data.products || []);
        } catch (err) {
            console.error("Errore GET prodotti:", err);
            toast.error('Errore nel caricamento prodotti');
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: "DELETE",
                credentials: "include"   // 🔥 OBBLIGATORIO
            });

            if (res.ok) {
                toast.success('Prodotto eliminato');
                loadProducts();
            } else {
                const errorText = await res.text();
                console.error("Errore DELETE:", errorText);
                toast.error('Errore nell\'eliminazione');
            }
        } catch (err) {
            console.error("Errore DELETE:", err);
            toast.error('Errore nell\'eliminazione');
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
            <Toaster position="top-center" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                        Gestione Prodotti
                    </h1>

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
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Nome</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Prezzo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Categoria</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Stato</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Azioni</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id}>
<<<<<<< HEAD
                                        <td className="px-6 py-4">{product.name}</td>
                                        <td className="px-6 py-4">€{product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">{product.category}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    product.inStock
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
=======
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
<<<<<<< HEAD
                                            â‚¬{product.price.toFixed(2)}
=======
                                            €{product.price.toFixed(2)}
>>>>>>> master
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
>>>>>>> main
                                                {product.inStock ? 'Disponibile' : 'Esaurito'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <button onClick={() => window.open(`/prodotti/${product.id}`, '_blank')}>
                                                    <Eye className="w-5 h-5" />
                                                </button>

                                                <button onClick={() => router.push(`/admin/prodotti/${product.id}`)}>
                                                    <Edit className="w-5 h-5" />
                                                </button>

                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
<<<<<<< HEAD

=======
>>>>>>> master
