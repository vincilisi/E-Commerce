'use client'

import { useState, useEffect, use } from 'react'
import { Calendar, User, Eye, ArrowLeft, Tag, Share2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface BlogPost {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string
    image: string | null
    author: string
    tags: string | null
    views: number
    createdAt: string
}

<<<<<<< HEAD
export default function BlogPostPage({ params }: { params: { slug: string } }) {
=======
export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params)
>>>>>>> master
    const [post, setPost] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        fetchPost()
<<<<<<< HEAD
    }, [params.slug])
    
    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/blog?slug=${params.slug}`)
=======
    }, [resolvedParams.slug])
    
    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/blog?slug=${resolvedParams.slug}`)
>>>>>>> master
            const data = await res.json()
            setPost(data)
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
    
    const sharePost = () => {
        if (navigator.share) {
            navigator.share({
                title: post?.title,
                url: window.location.href
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            alert('Link copiato!')
        }
    }
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }
    
    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Articolo non trovato</h1>
                <Link href="/blog" className="text-purple-600 hover:underline">
                    Torna al Blog
                </Link>
            </div>
        )
    }

    return (
<<<<<<< HEAD
        <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--color-background)' }}>
=======
        <div className="min-h-screen py-12 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.08),transparent_34%),linear-gradient(180deg,#fff_0%,#faf7ff_40%,#fff_100%)]" style={{ backgroundColor: 'var(--color-background)' }}>
>>>>>>> master
            <article className="max-w-4xl mx-auto px-4">
                {/* Back Link */}
                <Link 
                    href="/blog"
<<<<<<< HEAD
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
=======
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 rounded-full px-4 py-2 bg-white/80 border border-gray-100 shadow-sm"
>>>>>>> master
                >
                    <ArrowLeft className="w-4 h-4" />
                    Torna al Blog
                </Link>
                
                {/* Header */}
<<<<<<< HEAD
                <header className="mb-8">
=======
                <header className="mb-8 rounded-4xl border border-white/70 bg-white/85 backdrop-blur-xl shadow-[0_20px_55px_rgba(31,41,55,0.08)] p-6 md:p-8">
>>>>>>> master
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {getTags(post.tags).map((tag: string) => (
                            <span 
                                key={tag}
                                className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                                style={{ 
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white'
                                }}
                            >
                                <Tag className="w-3 h-3" />
                                {tag}
                            </span>
                        ))}
                    </div>
                    
<<<<<<< HEAD
                    <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
=======
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6" style={{ color: 'var(--color-text)' }}>
>>>>>>> master
                        {post.title}
                    </h1>
                    
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {post.author}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.createdAt)}
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {post.views} letture
                        </div>
                        <button 
                            onClick={sharePost}
                            className="flex items-center gap-2 hover:text-purple-600 transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            Condividi
                        </button>
                    </div>
                </header>
                
                {/* Featured Image */}
                {post.image && (
<<<<<<< HEAD
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-10">
=======
                    <div className="relative aspect-video rounded-4xl overflow-hidden mb-10 shadow-[0_20px_55px_rgba(31,41,55,0.15)] border border-white/70">
>>>>>>> master
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                
                {/* Content */}
                <div 
<<<<<<< HEAD
                    className="prose prose-lg max-w-none"
=======
                    className="prose prose-lg max-w-none rounded-4xl border border-white/70 bg-white/85 backdrop-blur-xl shadow-[0_20px_55px_rgba(31,41,55,0.08)] p-6 md:p-8"
>>>>>>> master
                    style={{ color: 'var(--color-text)' }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                {/* Share */}
<<<<<<< HEAD
                <div className="mt-12 pt-8 border-t flex items-center justify-between">
                    <span className="text-gray-600">Ti è piaciuto questo articolo?</span>
                    <button 
                        onClick={sharePost}
                        className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-all hover:scale-105"
=======
                <div className="mt-12 pt-8 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-gray-600">Ti è piaciuto questo articolo?</span>
                    <button 
                        onClick={sharePost}
                        className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-all hover:scale-105 shadow-lg"
>>>>>>> master
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Share2 className="w-4 h-4" />
                        Condividi
                    </button>
                </div>
            </article>
        </div>
    )
}
