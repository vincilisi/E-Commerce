'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { autoTranslateProduct } from '@/lib/autoTranslate';
import TranslationPreview from '@/components/TranslationPreview';

export default function NuovoProdotto() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Classici',
        inStock: true,
        materials: [''],
        dimensions: '',
        images: ['']
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Carica solo file immagine');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Immagine troppo grande. Massimo 5MB');
            return;
        }

        setUploadingImage(true);

        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const newImages = [...formData.images];
                newImages[index] = base64String;
                setFormData({ ...formData, images: newImages });
                toast.success('Immagine caricata!');
            };
            reader.onerror = () => {
                toast.error('Errore nel caricamento immagine');
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error('Errore nel caricamento immagine');
        } finally {
            setUploadingImage(false);
        }
    };

    const addImage = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const updateImage = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const removeImage = (index: number) => {
        setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Genera automaticamente le traduzioni
            const translations = autoTranslateProduct(formData.name, formData.description);

            toast.success('Traduzioni generate automaticamente in 8 lingue!');

            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    materials: formData.materials.filter(m => m.trim()),
                    images: formData.images.filter(i => i.trim()),
                    translations // Aggiungi le traduzioni al prodotto
                })
            });

            if (res.ok) {
                toast.success('Prodotto creato con successo in tutte le lingue!');
                router.push('/admin/prodotti');
            } else {
                toast.error('Errore nella creazione del prodotto');
            }
        } catch (error) {
            toast.error('Errore nella creazione del prodotto');
        } finally {
            setLoading(false);
        }
    };

    const addMaterial = () => {
        setFormData({ ...formData, materials: [...formData.materials, ''] });
    };

    const updateMaterial = (index: number, value: string) => {
        const newMaterials = [...formData.materials];
        newMaterials[index] = value;
        setFormData({ ...formData, materials: newMaterials });
    };

    const removeMaterial = (index: number) => {
        setFormData({ ...formData, materials: formData.materials.filter((_, i) => i !== index) });
    };

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
            <Toaster position="top-center" />

            <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/admin/prodotti" className="flex items-center hover:opacity-80 mb-6" style={{ color: 'var(--color-primary)' }}>
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Torna ai prodotti
                </Link>

                <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                    <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Nuovo Prodotto</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Notifica traduzioni automatiche */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-blue-800 mb-1">ðŸŒ Traduzioni Automatiche Attive</h3>
                                <p className="text-sm text-blue-700">
                                    Il prodotto verrÃ  tradotto automaticamente in <strong>8 lingue</strong>: Italiano, Inglese, Francese, Spagnolo, Tedesco, Portoghese, Russo e Cinese.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Nome Prodotto * <span className="text-sm font-normal text-gray-500">(in italiano)</span></label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                placeholder="es. Portachiavi Stella Dorata"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Descrizione * <span className="text-sm font-normal text-gray-500">(in italiano)</span></label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                placeholder="Descrizione dettagliata del prodotto"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Prezzo (â‚¬) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    placeholder="12.99"
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
                                    <option value="Colorati">Colorati</option>
                                    <option value="Eleganti">Eleganti</option>
                                    <option value="NovitÃ ">NovitÃ </option>
                                </select>
                            </div>
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

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Materiali</label>
                            {formData.materials.map((material, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-2">
                                    <input
                                        type="text"
                                        value={material}
                                        onChange={(e) => updateMaterial(index, e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="es. Metallo dorato"
                                    />
                                    {formData.materials.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMaterial(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Rimuovi
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addMaterial}
                                className="text-purple-600 hover:text-purple-700 text-sm mt-2"
                            >
                                + Aggiungi materiale
                            </button>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Immagini Prodotto</label>
                            {formData.images.map((image, index) => (
                                <div key={index} className="mb-4 border rounded-lg p-4" style={{ borderColor: 'var(--color-border)' }}>
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-1">
                                            <label className="block text-sm text-gray-600 mb-2">
                                                Opzione 1: Carica File
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, index)}
                                                disabled={uploadingImage}
                                                className="w-full text-sm"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">oppure</p>
                                            <label className="block text-sm text-gray-600 mt-2 mb-2">
                                                Opzione 2: URL Immagine
                                            </label>
                                            <input
                                                type="url"
                                                value={image.startsWith('data:') ? '' : image}
                                                onChange={(e) => updateImage(index, e.target.value)}
                                                disabled={image.startsWith('data:')}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                placeholder="https://esempio.com/immagine.jpg"
                                            />
                                            {image.startsWith('data:') && (
                                                <button
                                                    type="button"
                                                    onClick={() => updateImage(index, '')}
                                                    className="text-sm text-red-600 hover:text-red-800 mt-1"
                                                >
                                                    Rimuovi file e usa URL
                                                </button>
                                            )}
                                        </div>
                                        {image && (
                                            <div className="w-24 h-24 border rounded overflow-hidden">
                                                <img
                                                    src={image}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {formData.images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="text-red-600 hover:text-red-700 text-sm mt-2"
                                        >
                                            Rimuovi immagine
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addImage}
                                className="text-purple-600 hover:text-purple-700 text-sm"
                            >
                                + Aggiungi altra immagine
                            </button>
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="inStock"
                                checked={formData.inStock}
                                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                className="w-5 h-5 text-purple-600"
                            />
                            <label htmlFor="inStock" className="text-gray-700 font-semibold">
                                Prodotto disponibile
                            </label>
                        </div>
                        {/* Anteprima traduzioni */}
                        <TranslationPreview name={formData.name} description={formData.description} />
                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <Link
                                href="/admin/prodotti"
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Annulla
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center space-x-2 disabled:opacity-50"
                                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                            >
                                <Save className="w-5 h-5" />
                                <span>{loading ? 'Salvataggio...' : 'Salva Prodotto'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

