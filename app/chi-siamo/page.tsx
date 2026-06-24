import { Heart, Star, Sparkles } from 'lucide-react';

export default function ChiSiamoPage() {
    return (
        <div className="min-h-screen py-12 md:py-20" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 animate-slideUp">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                            Chi Siamo
                        </h1>
                        <div className="w-24 h-1 mx-auto rounded-full mb-8" style={{ backgroundColor: 'var(--color-accent)' }}></div>
                    </div>

                    {/* Hero Card */}
                    <div className="text-white rounded-3xl p-8 md:p-12 mb-16 text-center shadow-2xl animate-slideUp animation-delay-200" style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }}>
                        <div className="transform hover:scale-110 transition-transform duration-500 inline-block mb-6">
                            <Star className="w-16 h-16 md:w-20 md:h-20 mx-auto drop-shadow-2xl" style={{ fill: 'var(--color-accent)', color: 'var(--color-accent)' }} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Il Desiderio di una Stella</h2>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Dove ogni portachiavi racconta una storia unica ✨
                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="space-y-8 md:space-y-12">
                        {/* La Nostra Storia */}
                        <div className="rounded-3xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-fadeIn" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                            <div className="flex items-center mb-6">
                                <div className="p-3 rounded-2xl mr-4" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}>
                                    <Heart className="w-8 h-8 md:w-10 md:h-10" style={{ color: 'var(--color-primary)' }} />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>La Nostra Storia</h2>
                            </div>
                            <p className="leading-relaxed mb-6 text-base md:text-lg" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
                                Il Desiderio di una Stella nasce dalla passione per l'artigianato e dalla voglia di creare
                                oggetti unici che possano accompagnare le persone nella loro vita quotidiana. Ogni portachiavi
                                è realizzato a mano con cura, attenzione ai dettagli e tanto amore.
                            </p>
                            <p className="leading-relaxed text-base md:text-lg" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
                                Crediamo che anche i piccoli oggetti possano portare gioia e bellezza nella vita di tutti i giorni.
                                Per questo, ogni nostro prodotto è pensato per essere non solo funzionale, ma anche un piccolo
                                tesoro da custodire.
                            </p>
                        </div>

                        {/* I Nostri Valori */}
                        <div className="rounded-3xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-fadeIn animation-delay-200" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                            <div className="flex items-center mb-6">
                                <div className="p-3 rounded-2xl mr-4" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}>
                                    <Sparkles className="w-8 h-8 md:w-10 md:h-10" style={{ color: 'var(--color-primary)' }} />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>I Nostri Valori</h2>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-5 rounded-2xl hover:scale-105 transition-transform duration-300" style={{ backgroundColor: 'var(--color-background)' }}>
                                    <div className="text-3xl mb-3">🎨</div>
                                    <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>Artigianalità</h3>
                                    <p className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                                        Ogni pezzo è fatto a mano con tecniche tradizionali
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl hover:scale-105 transition-transform duration-300" style={{ backgroundColor: 'var(--color-background)' }}>
                                    <div className="text-3xl mb-3">💎</div>
                                    <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>Qualità</h3>
                                    <p className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                                        Utilizziamo solo materiali selezionati e duraturi
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl hover:scale-105 transition-transform duration-300" style={{ backgroundColor: 'var(--color-background)' }}>
                                    <div className="text-3xl mb-3">⭐</div>
                                    <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>Unicità</h3>
                                    <p className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                                        Ogni portachiavi è un pezzo unico e irripetibile
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl hover:scale-105 transition-transform duration-300" style={{ backgroundColor: 'var(--color-background)' }}>
                                    <div className="text-3xl mb-3">🌱</div>
                                    <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>Sostenibilità</h3>
                                    <p className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                                        Attenzione all'ambiente in ogni fase della produzione
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="rounded-3xl p-8 md:p-12 text-center shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fadeIn animation-delay-400" style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }}>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                                Vuoi saperne di più?
                            </h2>
                            <p className="mb-8 text-white/90 max-w-2xl mx-auto text-sm md:text-base">
                                Contattaci per richieste personalizzate o per qualsiasi domanda.<br className="hidden sm:block" />
                                Siamo qui per realizzare il tuo portachiavi dei sogni! 🌟
                            </p>
                            <a
                                href="/contatti"
                                className="px-8 md:px-10 py-3 md:py-4 rounded-full hover:scale-105 hover:shadow-2xl transition-all duration-300 inline-block font-semibold text-sm md:text-base shadow-xl"
                                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text)' }}
                            >
                                Contattaci →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
