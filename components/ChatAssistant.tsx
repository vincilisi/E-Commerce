'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatAssistant() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false); // ✅ SPOSTATO QUI
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const sendMessage = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.reply ?? 'Errore nella risposta',
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Errore di connessione.',
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full border rounded-lg">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`max-w-[80%] px-4 py-2 rounded-lg ${
                            msg.role === 'user'
                                ? 'bg-black text-white ml-auto'
                                : 'bg-gray-100 text-black'
                        }`}
                    >
                        {msg.content}
                    </div>
                ))}

                {isTyping && (
                    <div className="flex items-center space-x-2 text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sta scrivendo…</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center border-t p-3 gap-2">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Scrivi un messaggio…"
                    className="flex-1 border rounded px-3 py-2"
                />
                <button
                    onClick={sendMessage}
                    disabled={isTyping}
                    className="p-2 rounded bg-black text-white disabled:opacity-50"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}