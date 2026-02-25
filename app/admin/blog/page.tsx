'use client'

import { useState, useEffect } from 'react'
import {
    BookOpen, Plus, Edit2, Trash2, Eye, EyeOff,
    Star, Calendar, Save, X, Image as ImageIcon
} from 'lucide-react'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    image: string | null
    author: string
    tags: string | null
    published: boolean
    featured: boolean
    views: number
    createdAt: string
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null)

    // Form state
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [image, setImage] = useState('')
    const [tags, setTags] = useState('')
    const [published, setPublished] = useState(false)
    const [featured, setFeatured] = useState(false)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/blog')
            const data = await res.json()
            setPosts(data)
        } catch (error) {
            console.error('Errore:', error)
        } finally {
            setLoading(false)
        }
    }

    const openModal = (post?: BlogPost) => {
        if (post) {
            setEditingPost(post)
            setTitle(post.title)
            setContent(post.content)
            setExcerpt(post.excerpt || '')
            setImage(post.image || '')
            setTags(post.tags ? JSON.parse(post.tags).join(', ') : '')
            setPublished(post.published)
            setFeatured(post.featured)
        } else {
            setEditingPost(null)
            setTitle('')
            setContent('')
            setExcerpt('')
            setImage('')
            setTags('')
            setPublished(false)
            setFeatured(false)
        }
        setShowModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const postData = {
            title,
            content,
            excerpt,
            image: image || null,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            published,
            featured
        }

        try {
            if (editingPost) {
                await fetch(`/api/blog/${editingPost.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData)
                })
            } else {
                await fetch('/api/blog', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData)
                })
            }

            setShowModal(false)
            fetchPosts()
        } catch (error) {
            console.error('Errore:', error)
        }
    }

    const deletePost = async (id: string) => {
        if (!confirm('Eliminare questo articolo?')) return

        try {
            await fetch(`/api/blog/${id}`, { method: 'DELETE' })
            fetchPosts()
        } catch (error) {
            console.error('Errore:', error)
        }
    }

    const togglePublished = async (post: BlogPost) => {
        try {
            await fetch(`/api/blog/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: !post.published })
            })
            fetchPosts()
        } catch (error) {
            console.error('Errore:', error)
        }
    }

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                            Gestione Blog
                        </h1>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus className="w-5 h-5" />
                        Nuovo Articolo
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">Nessun articolo ancora</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-6 py-4 font-medium text-gray-500">Titolo</th>
                                    <th className="text-left px-6 py-4 font-medium text-gray-500">Stato</th>
                                    <th className="text-left px-6 py-4 font-medium text-gray-500">Views</th>
                                    <th className="text-left px-6 py-4 font-medium text-gray-500">Data</th>
                                    <th className="text-right px-6 py-4 font-medium text-gray-500">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {post.featured && (
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                )}
                                                <div>
                                                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                                                        {post.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500">/{post.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => togglePublished(post)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${post.published
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {post.published ? 'Pubblicato' : 'Bozza'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {post.views}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(post.createdAt).toLocaleDateString('it-IT')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(post)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                                    title="Modifica"
                                                >
                                                    <Edit2 className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button
                                                    onClick={() => deletePost(post.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg"
                                                    title="Elimina"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                                {editingPost ? 'Modifica Articolo' : 'Nuovo Articolo'}
                            </h2>
                            <button onClick={() => setShowModal(false)}>
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Titolo *</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full border rounded-lg px-4 py-2"
                                    style={{ borderColor: 'var(--color-border)' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Estratto</label>
                                <textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    rows={2}
                                    className="w-full border rounded-lg px-4 py-2"
                                    style={{ borderColor: 'var(--color-border)' }}
                                    placeholder="Breve descrizione (max 160 caratteri)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Contenuto *</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    rows={10}
                                    className="w-full border rounded-lg px-4 py-2"
                                    style={{ borderColor: 'var(--color-border)' }}
                                    placeholder="Supporta HTML..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">URL Immagine</label>
                                <input
                                    type="url"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="w-full border rounded-lg px-4 py-2"
                                    style={{ borderColor: 'var(--color-border)' }}
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Tags (separati da virgola)</label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="w-full border rounded-lg px-4 py-2"
                                    style={{ borderColor: 'var(--color-border)' }}
                                    placeholder="tutorial, idee, novità"
                                />
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={published}
                                        onChange={(e) => setPublished(e.target.checked)}
                                        className="w-4 h-4 rounded"
                                    />
                                    <span className="text-sm">Pubblicato</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={featured}
                                        onChange={(e) => setFeatured(e.target.checked)}
                                        className="w-4 h-4 rounded"
                                    />
                                    <span className="text-sm">In Evidenza ⭐</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                    <Save className="w-4 h-4" />
                                    Salva
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
