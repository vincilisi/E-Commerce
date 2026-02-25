'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Calendar, MapPin, Users, Euro, Edit, Trash2, Star, Eye, EyeOff } from 'lucide-react';

interface Event {
    id: string;
    title: string;
    description: string;
    image: string | null;
    date: string;
    endDate: string | null;
    location: string | null;
    price: number;
    maxAttendees: number | null;
    attendees: number;
    active: boolean;
    featured: boolean;
    createdAt: string;
}

export default function EventiAdmin() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        date: '',
        endDate: '',
        location: '',
        price: 0,
        maxAttendees: '',
        active: true,
        featured: false,
    });
    const router = useRouter();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/admin/events');
            const data = await res.json();
            if (Array.isArray(data)) {
                setEvents(data);
            } else {
                console.error('API did not return an array:', data);
                setEvents([]);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingEvent
                ? `/api/admin/events/${editingEvent.id}`
                : '/api/admin/events';

            const method = editingEvent ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
                }),
            });

            if (res.ok) {
                fetchEvents();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Sei sicuro di voler eliminare questo evento?')) return;

        try {
            const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchEvents();
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            image: event.image || '',
            date: event.date.split('T')[0],
            endDate: event.endDate ? event.endDate.split('T')[0] : '',
            location: event.location || '',
            price: event.price,
            maxAttendees: event.maxAttendees?.toString() || '',
            active: event.active,
            featured: event.featured,
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            image: '',
            date: '',
            endDate: '',
            location: '',
            price: 0,
            maxAttendees: '',
            active: true,
            featured: false,
        });
        setEditingEvent(null);
        setShowForm(false);
    };

    const toggleActive = async (event: Event) => {
        try {
            await fetch(`/api/admin/events/${event.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...event, active: !event.active }),
            });
            fetchEvents();
        } catch (error) {
            console.error('Error toggling event:', error);
        }
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
                        🎉 Gestione Eventi
                    </h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        Nuovo Evento
                    </button>
                </div>

                {/* Form Creazione/Modifica */}
                {showForm && (
                    <div className="rounded-lg shadow-md p-6 mb-8" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                            {editingEvent ? '✏️ Modifica Evento' : '➕ Nuovo Evento'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                        Titolo *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-2 rounded border"
                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                        Luogo
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full p-2 rounded border"
                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                        placeholder="es. Milano, Via Roma 1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                    Descrizione *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2 rounded border"
                                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                    URL Immagine
                                </label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full p-2 rounded border"
                                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                        Data Inizio *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full p-2 rounded border"
                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                        Data Fine
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full p-2 rounded border"
                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                        Prezzo (€)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                        className="w-full p-2 rounded border"
                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                                        Max Partecipanti
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.maxAttendees}
                                        onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                                        className="w-full p-2 rounded border"
                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                                        min="0"
                                        placeholder="Illimitato"
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
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <span style={{ color: 'var(--color-text)' }}>⭐ In Evidenza</span>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg text-white"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                    {editingEvent ? 'Salva Modifiche' : 'Crea Evento'}
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

                {/* Lista Eventi */}
                {events.length === 0 ? (
                    <div className="rounded-lg shadow-md p-12 text-center" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: 'var(--color-text)' }} />
                        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Nessun evento</h3>
                        <p className="text-gray-500 mb-4">Crea il tuo primo evento per iniziare</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-2 rounded-lg text-white"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            Crea Evento
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className={`rounded-lg shadow-md overflow-hidden ${!event.active ? 'opacity-60' : ''}`}
                                style={{ backgroundColor: 'var(--color-card-bg)', border: event.featured ? '2px solid var(--color-accent)' : '1px solid var(--color-border)' }}
                            >
                                {event.image && (
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-40 object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                                            {event.featured && <span className="text-yellow-500 mr-1">⭐</span>}
                                            {event.title}
                                        </h3>
                                        <span
                                            className={`px-2 py-0.5 text-xs rounded-full ${event.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                        >
                                            {event.active ? 'Attivo' : 'Bozza'}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>

                                    <div className="space-y-1 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(event.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        {event.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                {event.location}
                                            </div>
                                        )}
                                        {event.maxAttendees && (
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                {event.attendees}/{event.maxAttendees} partecipanti
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Euro className="w-4 h-4" />
                                            {event.price === 0 ? 'Gratuito' : `€${event.price.toFixed(2)}`}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-sm border"
                                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                                        >
                                            <Edit className="w-4 h-4" />
                                            Modifica
                                        </button>
                                        <button
                                            onClick={() => toggleActive(event)}
                                            className="px-3 py-2 rounded text-sm border"
                                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                                            title={event.active ? 'Disattiva' : 'Attiva'}
                                        >
                                            {event.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="px-3 py-2 rounded text-sm bg-red-100 text-red-600 hover:bg-red-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
