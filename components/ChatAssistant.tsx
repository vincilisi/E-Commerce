'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    isBot: boolean;
    timestamp: Date;
}

interface AssistantSettings {
    assistantEnabled: boolean;
    assistantName: string;
    assistantColor: string;
    assistantTextColor: string;
    assistantWelcome: string;
    assistantPosition: string;
}

export default function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [settings, setSettings] = useState<AssistantSettings>({
        assistantEnabled: true,
        assistantName: 'Assistente Virtuale',
        assistantColor: '#9333ea',
        assistantTextColor: '#ffffff',
        assistantWelcome: '👋 Ciao! Sono il tuo assistente virtuale. Come posso aiutarti oggi?',
        assistantPosition: 'right'
    });
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Carica le impostazioni dell'assistente
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    setSettings({
                        assistantEnabled: data.settings.assistantEnabled ?? true,
                        assistantName: data.settings.assistantName || 'Assistente Virtuale',
                        assistantColor: data.settings.assistantColor || '#9333ea',
                        assistantTextColor: data.settings.assistantTextColor || '#ffffff',
                        assistantWelcome: data.settings.assistantWelcome || '👋 Ciao! Sono il tuo assistente virtuale. Come posso aiutarti oggi?',
                        assistantPosition: data.settings.assistantPosition || 'right'
                    });
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const texts = {
        help: 'Serve aiuto?',
        online: 'Online ora',
        placeholder: 'Scrivi un messaggio...',
        quickQuestions: 'Domande frequenti:',
        shipping: 'Spedizione',
        shippingAnswer: 'Spediamo in tutta Italia in 3-5 giorni lavorativi. Spedizione gratuita per ordini superiori a €50!',
        returns: 'Resi',
        returnsAnswer: 'Hai 30 giorni di tempo per restituire qualsiasi prodotto. Il reso è gratuito e riceverai un rimborso completo.',
        payment: 'Pagamenti',
        paymentAnswer: 'Accettiamo tutte le principali carte di credito e debito tramite Stripe. I pagamenti sono sicuri e protetti.',
        custom: 'Personalizzazioni',
        customAnswer: 'Offriamo personalizzazioni su molti prodotti! Contattaci per ricevere un preventivo personalizzato.',
        genericAnswer: 'Grazie per la tua domanda! Per assistenza specifica, contattaci via email o chiama il nostro servizio clienti.',
    };

    const quickQuestions = [
        { id: 1, question: texts.shipping, answer: texts.shippingAnswer },
        { id: 2, question: texts.returns, answer: texts.returnsAnswer },
        { id: 3, question: texts.payment, answer: texts.paymentAnswer },
        { id: 4, question: texts.custom, answer: texts.customAnswer },
    ];

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleQuickQuestion = async (question: string) => {
        // Aggiungi domanda utente
        const userMessage: Message = {
            id: Date.now(),
            text: question,
            isBot: false,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // Chiama l'API per la risposta
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: question })
            });

            const data = await res.json();

            const botMessage: Message = {
                id: Date.now() + 1,
                text: data.response || texts.genericAnswer,
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch {
            const botMessage: Message = {
                id: Date.now() + 1,
                text: texts.genericAnswer,
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            text: inputValue,
            isBot: false,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        const messageToSend = inputValue;
        setInputValue('');
        setIsTyping(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageToSend })
            });

            const data = await res.json();

            const botMessage: Message = {
                id: Date.now() + 1,
                text: data.response || texts.genericAnswer,
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch {
            const botMessage: Message = {
                id: Date.now() + 1,
                text: texts.genericAnswer,
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    // Non mostrare se disabilitato o ancora in caricamento
    if (loading || !settings.assistantEnabled) {
        return null;
    }

    const positionClass = settings.assistantPosition === 'left' ? 'left-6' : 'right-6';

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => {
                        console.log('Opening chat assistant');
                        setIsOpen(true);
                    }}
                    className={`fixed bottom-6 ${positionClass} z-50 p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center space-x-2 group`}
                    style={{ backgroundColor: settings.assistantColor }}
                >
                    <MessageCircle className="w-6 h-6" style={{ color: settings.assistantTextColor }} />
                    <span className="hidden group-hover:inline font-semibold pr-2 animate-fadeIn" style={{ color: settings.assistantTextColor }}>
                        {texts.help}
                    </span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={`fixed bottom-6 ${positionClass} z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp`}
                    style={{ maxHeight: '600px' }}
                >
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between" style={{ backgroundColor: settings.assistantColor }}>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                <Bot className="w-6 h-6" style={{ color: settings.assistantColor }} />
                            </div>
                            <div>
                                <h3 className="font-bold" style={{ color: settings.assistantTextColor }}>{settings.assistantName}</h3>
                                <p className="text-xs opacity-80" style={{ color: settings.assistantTextColor }}>{texts.online}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                console.log('Closing chat assistant');
                                setIsOpen(false);
                            }}
                            className="hover:bg-white/20 p-2 rounded-lg transition"
                            style={{ color: settings.assistantTextColor }}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Welcome Message */}
                    {messages.length === 0 && (
                        <div className="p-4 bg-gray-50">
                            <div className="flex items-start space-x-2">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${settings.assistantColor}20` }}>
                                    <Bot className="w-5 h-5" style={{ color: settings.assistantColor }} />
                                </div>
                                <div className="p-3 rounded-2xl bg-white text-gray-800 rounded-tl-none shadow-sm">
                                    <p className="text-sm">{settings.assistantWelcome}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto max-h-96 bg-gray-50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`mb-4 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: message.isBot ? `${settings.assistantColor}20` : '#fce7f3' }}
                                    >
                                        {message.isBot ? (
                                            <Bot className="w-5 h-5" style={{ color: settings.assistantColor }} />
                                        ) : (
                                            <User className="w-5 h-5 text-pink-600" />
                                        )}
                                    </div>
                                    <div>
                                        <div
                                            className={`p-3 rounded-2xl ${message.isBot ? 'bg-white text-gray-800 rounded-tl-none shadow-sm' : 'rounded-tr-none'}`}
                                            style={!message.isBot ? { backgroundColor: settings.assistantColor, color: settings.assistantTextColor } : {}}
                                        >
                                            <p className="text-sm">{message.text}</p>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 px-2">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="mb-4 flex justify-start">
                                <div className="flex items-start space-x-2">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${settings.assistantColor}20` }}
                                    >
                                        <Bot className="w-5 h-5" style={{ color: settings.assistantColor }} />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white text-gray-800 rounded-tl-none shadow-sm">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {messages.length <= 1 && !isTyping && (
                        <div className="p-3 bg-white border-t">
                            <p className="text-xs text-gray-500 mb-2 font-semibold">{texts.quickQuestions}</p>
                            <div className="flex flex-wrap gap-2">
                                {quickQuestions.map((q) => (
                                    <button
                                        key={q.id}
                                        onClick={() => handleQuickQuestion(q.question)}
                                        className="px-3 py-1.5 text-xs rounded-full transition hover:opacity-80"
                                        style={{
                                            backgroundColor: `${settings.assistantColor}15`,
                                            color: settings.assistantColor
                                        }}
                                    >
                                        {q.question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 bg-white border-t flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                            placeholder={texts.placeholder}
                            disabled={isTyping}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 text-sm disabled:opacity-50"
                            style={{ '--tw-ring-color': settings.assistantColor } as any}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isTyping}
                            className="p-2 rounded-full hover:opacity-90 transition disabled:opacity-50"
                            style={{ backgroundColor: settings.assistantColor, color: settings.assistantTextColor }}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
