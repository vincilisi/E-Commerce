'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Calendar, Eye, ArrowRight, Tag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    image: string | null
    author: string
    tags: string | null
    views: number
    createdAt: string
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/blog?published=true')
            const data = await res.json()
            setPosts(data)
        } catch (error) {
            console.error('Errore:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const getTags = (tagsJson: string | null) => {
        try {
            return tagsJson ? JSON.parse(tagsJson) : []
        } catch {
            return []
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <BookOpen className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />
                        <h1 className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                            Blog
                        </h1>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Scopri le ultime novità, tutorial creativi e consigli per i tuoi acquisti artigianali.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                            Nessun articolo ancora
                        </h2>
                        <p className="text-gray-500">
                            Torna presto per leggere i nostri articoli!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition-shadow"
                            >
                                {/* Image */}
                                <div className="relative aspect-video bg-gray-100">
                                    {post.image ? (
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <BookOpen className="w-12 h-12 text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {getTags(post.tags).slice(0, 2).map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full"
                                                style={{
                                                    backgroundColor: 'var(--color-primary)',
                                                    color: 'white',
                                                    opacity: 0.8
                                                }}
                                            >
                                                <Tag className="w-3 h-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <Link href={`/blog/${post.slug}`}>
                                        <h2 className="text-xl font-bold mb-2 group-hover:underline line-clamp-2" style={{ color: 'var(--color-text)' }}>
                                            {post.title}
                                        </h2>
                                    </Link>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(post.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {post.views} letture
                                        </div>
                                    </div>

                                    {/* Read More */}
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="mt-4 inline-flex items-center gap-2 font-medium group-hover:gap-3 transition-all"
                                        style={{ color: 'var(--color-primary)' }}
                                    >
                                        Leggi tutto
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
