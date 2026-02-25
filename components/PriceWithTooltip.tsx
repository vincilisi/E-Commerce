'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { Info } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PriceWithTooltipProps {
    priceInEuro: number;
    className?: string;
    showIcon?: boolean;
}

export default function PriceWithTooltip({ priceInEuro, className = '', showIcon = true }: PriceWithTooltipProps) {
    const { formatPrice, currency, lastRatesUpdate } = useLanguage();
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number; position: 'above' | 'below'; ready: boolean }>({ top: 0, left: 0, position: 'above', ready: false });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const formattedDate = lastRatesUpdate
        ? new Date(lastRatesUpdate).toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : 'N/A';

    // Calcola la posizione assoluta del tooltip
    const updateTooltipPosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;
            const tooltipHeight = 180;
            const tooltipWidth = 300;

            let top: number;
            let left = rect.left + rect.width / 2 - tooltipWidth / 2;
            let position: 'above' | 'below' = 'above';

            // Assicurati che il tooltip non esca dallo schermo orizzontalmente
            if (left < 10) left = 10;
            if (left + tooltipWidth > window.innerWidth - 10) {
                left = window.innerWidth - tooltipWidth - 10;
            }

            if (spaceAbove < tooltipHeight + 20 && spaceBelow > spaceAbove) {
                // Mostra sotto
                top = rect.bottom + 8;
                position = 'below';
            } else {
                // Mostra sopra
                top = rect.top - tooltipHeight - 8;
                position = 'above';
            }

            setTooltipPosition({ top, left, position, ready: true });
        }
    };

    useEffect(() => {
        if (showTooltip) {
            updateTooltipPosition();
            window.addEventListener('scroll', updateTooltipPosition, true);
            window.addEventListener('resize', updateTooltipPosition);
        } else {
            setTooltipPosition(prev => ({ ...prev, ready: false }));
        }
        return () => {
            window.removeEventListener('scroll', updateTooltipPosition, true);
            window.removeEventListener('resize', updateTooltipPosition);
        };
    }, [showTooltip]);

    // Chiudi tooltip quando si clicca fuori
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setShowTooltip(false);
            }
        };

        if (showTooltip) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showTooltip]);

    const convertedPrice = (priceInEuro * currency.rate).toFixed(2);

    const tooltipContent = (
        <div
            style={{
                position: 'fixed',
                top: tooltipPosition.top,
                left: tooltipPosition.left,
                zIndex: 99999,
                width: 300,
                opacity: 1,
                transition: 'opacity 0.2s ease-in-out',
            }}
        >
            <div className="bg-gray-900 text-white rounded-xl px-4 py-3 shadow-2xl border border-gray-700" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                {/* Header */}
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-600">
                    <span className="text-lg">💱</span>
                    <span className="font-bold text-sm sm:text-base">Conversione Valuta</span>
                </div>

                {/* Content */}
                <div className="space-y-1.5 text-xs sm:text-sm">
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-gray-400">Prezzo originale:</span>
                        <span className="font-semibold text-white">€{priceInEuro.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-gray-400">Tasso di cambio:</span>
                        <span className="font-mono text-emerald-400">1 EUR = {currency.rate.toFixed(4)} {currency.code}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4 pt-1.5 border-t border-gray-600">
                        <span className="text-gray-400">Prezzo convertito:</span>
                        <span className="font-bold text-lg text-yellow-400">{currency.symbol}{convertedPrice}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-2 pt-2 border-t border-gray-700 flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
                    <span>🕐</span>
                    <span>Aggiornato: {formattedDate}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative inline-flex items-center gap-1 sm:gap-1.5">
            <span className={className}>{formatPrice(priceInEuro)}</span>

            {currency.code !== 'EUR' && showIcon && (
                <>
                    <button
                        ref={buttonRef}
                        type="button"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowTooltip(!showTooltip);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-full hover:bg-gray-100"
                        aria-label="Informazioni conversione valuta"
                    >
                        <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>

                    {showTooltip && isMounted && tooltipPosition.ready && createPortal(tooltipContent, document.body)}
                </>
            )}
        </div>
    );
}
