'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface Message {
    id: number;
    text: string;
    isBot: boolean;
}

const STORE_HOURS = {
    lunedi: { open: '09:00', close: '18:00' },
    martedi: { open: '09:00', close: '18:00' },
    mercoledi: { open: '09:00', close: '18:00' },
    giovedi: { open: '09:00', close: '18:00' },
    venerdi: { open: '09:00', close: '18:00' },
    sabato: { open: '10:00', close: '14:00' },
    domenica: null,
};

const CONTACT_INFO = {
    phone: '+39 02 1234 5678',
    email: 'info@ildesiderio.it',
};

export default function ChatAssistantSimple() {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showOperatorBtn, setShowOperatorBtn] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isStoreOpen = () => {
        const now = new Date();
        const days = ['domenica', 'lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato'];
        const day = days[now.getDay()] as keyof typeof STORE_HOURS;
        const hours = STORE_HOURS[day];

        if (!hours) return false;

        const time = now.getHours() * 60 + now.getMinutes();
        const [oh, om] = hours.open.split(':').map(Number);
        const [ch, cm] = hours.close.split(':').map(Number);

        return time >= (oh * 60 + om) && time < (ch * 60 + cm);
    };

    const schedule = `📅 ${t('assistant.scheduleTitle')}:

${t('assistant.mondayFriday')}: 09:00 - 18:00
${t('assistant.saturday')}: 10:00 - 14:00
${t('assistant.sunday')}: ${t('assistant.closed')}

📞 ${t('assistant.urgentContacts')}:
${t('assistant.phone')}: ${CONTACT_INFO.phone}
Email: ${CONTACT_INFO.email}`;

    const questions = [
        { id: 1, q: t('assistant.shipping'), a: t('assistant.shippingAnswer') },
        { id: 2, q: t('assistant.returns'), a: t('assistant.returnsAnswer') },
        { id: 3, q: t('assistant.payment'), a: t('assistant.paymentAnswer') },
        { id: 4, q: t('assistant.scheduleBtn'), a: schedule, special: true },
    ];

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ id: Date.now(), text: t('assistant.welcome'), isBot: true }]);
        }
    }, [isOpen, messages.length, t]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const askQuestion = (q: string, a: string, special?: boolean) => {
        setMessages(prev => [...prev, { id: Date.now(), text: q, isBot: false }]);
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: a, isBot: true }]);
            if (special) setShowOperatorBtn(true);
        }, 500);
    };

    const sendMsg = () => {
        if (!inputValue.trim()) return;
        setMessages(prev => [...prev, { id: Date.now(), text: inputValue, isBot: false }]);
        setInputValue('');
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: t('assistant.genericAnswer'),
                isBot: true
            }]);
        }, 500);
    };

    const contactOp = () => {
        setMessages(prev => [...prev, { id: Date.now(), text: t('assistant.contactOperator'), isBot: false }]);
        setTimeout(() => {
            const msg = isStoreOpen()
                ? t('assistant.requestSent')
                : `${t('assistant.storeClosed')}\n\n${schedule}`;
            setShowOperatorBtn(false);
        }, 500);
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-[9999] p-4 rounded-full shadow-2xl bg-purple-600 hover:bg-purple-700 transition-all hover:scale-110"
                >
                    <MessageCircle className="w-6 h-6 text-white" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-6 right-6 z-[9999] w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col" style={{ height: '600px' }}>
                    <div className="bg-purple-600 p-4 flex items-center justify-between rounded-t-2xl">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                <Bot className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">{t('assistant.title')}</h3>
                                <p className="text-white/80 text-xs">{t('assistant.online')}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:bg-purple-700 p-2 rounded">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`mb-4 flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`flex items-start space-x-2 max-w-[80%] ${msg.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.isBot ? 'bg-purple-100' : 'bg-pink-100'}`}>
                                        {msg.isBot ? <Bot className="w-5 h-5 text-purple-600" /> : <User className="w-5 h-5 text-pink-600" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl ${msg.isBot ? 'bg-white text-gray-800 rounded-tl-none' : 'bg-purple-600 text-white rounded-tr-none'}`}>
                                        <p className="text-sm whitespace-pre-line">{msg.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {messages.length <= 1 && (
                        <div className="p-3 bg-white border-t">
                            <p className="text-xs text-gray-500 mb-2 font-semibold">{t('assistant.quickQuestions')}</p>
                            <div className="flex flex-wrap gap-2">
                                {questions.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => askQuestion(item.q, item.a, item.special)}
                                        className="px-3 py-1.5 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full transition"
                                    >
                                        {item.q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {showOperatorBtn && (
                        <div className="p-3 bg-purple-50 border-t">
                            <button
                                onClick={contactOp}
                                className={`w-full py-2 px-4 rounded-lg font-semibold transition flex items-center justify-center space-x-2 ${isStoreOpen() ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-400 hover:bg-gray-500 text-white'
                                    }`}
                            >
                                {isStoreOpen() ? (
                                    <>
                                        <User className="w-4 h-4" />
                                        <span>🟢 {t('assistant.talkToOperator')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-4 h-4" />
                                        <span>🔴 {t('assistant.storeClosed')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    <div className="p-3 bg-white border-t rounded-b-2xl flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
                            placeholder={t('assistant.placeholder')}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                        />
                        <button onClick={sendMsg} className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
