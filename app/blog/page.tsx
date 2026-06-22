'use client'

import { useState, useEffect } from 'react'
<<<<<<< HEAD
import { BookOpen, Calendar, Eye, ArrowRight, Tag } from 'lucide-react'
=======
import { BookOpen, Calendar, Eye, ArrowRight, Tag, Sparkles } from 'lucide-react'
>>>>>>> master
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
<<<<<<< HEAD
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
=======
        <div className="min-h-screen py-12 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.08),transparent_34%),linear-gradient(180deg,#fff_0%,#faf7ff_40%,#fff_100%)]" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 animate-slideUp">
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">Editorial curated</p>
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <BookOpen className="w-12 h-12" style={{ color: 'var(--color-primary)' }} />
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>
                            Blog
                        </h1>
                    </div>
                    <div className="w-24 h-1 mx-auto rounded-full mb-6" style={{ backgroundColor: 'var(--color-accent)' }}></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                        Storie, consigli e approfondimenti su artigianalità, qualità e lifestyle. Leggi come trasformiamo passione in prodotto.
                    </p>
                </div>

                <div className="rounded-4xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_55px_rgba(31,41,55,0.08)] p-6 md:p-8 mb-14 animate-slideUp animation-delay-150 flex items-center justify-center gap-3 text-base font-semibold text-gray-700">
                    <Sparkles className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                    Contenuti che raccontano il brand e guidano le scelte consapevoli
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-16 bg-white/90 rounded-4xl shadow-[0_20px_55px_rgba(31,41,55,0.08)] border border-white/70 backdrop-blur-xl">
>>>>>>> master
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                            Nessun articolo ancora
                        </h2>
                        <p className="text-gray-500">
                            Torna presto per leggere i nostri articoli!
                        </p>
                    </div>
                ) : (
<<<<<<< HEAD
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition-shadow"
                            >
                                {/* Image */}
                                <div className="relative aspect-video bg-gray-100">
=======
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
                        {posts.map((post, index) => (
                            <article
                                key={post.id}
                                className="group bg-white/90 rounded-4xl shadow-[0_18px_45px_rgba(31,41,55,0.08)] border border-white/70 overflow-hidden hover:shadow-[0_28px_75px_rgba(31,41,55,0.16)] hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl animate-fadeIn flex flex-col"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Image */}
                                <div className="relative aspect-video bg-linear-to-br from-purple-50 to-indigo-50 overflow-hidden">
>>>>>>> master
                                    {post.image ? (
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
<<<<<<< HEAD
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
=======
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <BookOpen className="w-16 h-16 text-gray-200" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="p-7 flex flex-col flex-1">
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {getTags(post.tags).slice(0, 2).map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-purple-200/70"
                                                style={{
                                                    backgroundColor: 'var(--color-primary)',
                                                    color: 'white',
                                                    opacity: 0.85
>>>>>>> master
                                                }}
                                            >
                                                <Tag className="w-3 h-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <Link href={`/blog/${post.slug}`}>
<<<<<<< HEAD
                                        <h2 className="text-xl font-bold mb-2 group-hover:underline line-clamp-2" style={{ color: 'var(--color-text)' }}>
=======
                                        <h2 className="text-lg md:text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:bg-clip-text transition-all line-clamp-2" style={{ color: 'var(--color-text)' }}>
>>>>>>> master
                                            {post.title}
                                        </h2>
                                    </Link>

<<<<<<< HEAD
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
=======
                                    <p className="text-gray-600 text-sm md:text-base mb-6 line-clamp-3 flex-1 leading-relaxed">
>>>>>>> master
                                        {post.excerpt}
                                    </p>

                                    {/* Meta */}
<<<<<<< HEAD
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(post.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {post.views} letture
=======
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-t border-gray-200/50">
                                        <div className="flex items-center gap-2 mt-4">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-medium">{formatDate(post.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4">
                                            <Eye className="w-4 h-4" />
                                            <span className="font-medium">{post.views}</span>
>>>>>>> master
                                        </div>
                                    </div>

                                    {/* Read More */}
                                    <Link
                                        href={`/blog/${post.slug}`}
<<<<<<< HEAD
                                        className="mt-4 inline-flex items-center gap-2 font-medium group-hover:gap-3 transition-all"
                                        style={{ color: 'var(--color-primary)' }}
                                    >
                                        Leggi tutto
=======
                                        className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all text-sm"
                                        style={{ color: 'var(--color-primary)' }}
                                    >
                                        Leggi articolo
>>>>>>> master
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
