// Sistema di traduzione automatica per i prodotti
// Questo servizio traduce automaticamente nome e descrizione del prodotto in tutte le lingue supportate

export interface ProductTranslations {
    name: {
        it: string;
        en: string;
        fr: string;
        es: string;
        de: string;
        pt: string;
        ru: string;
        zh: string;
    };
    description: {
        it: string;
        en: string;
        fr: string;
        es: string;
        de: string;
        pt: string;
        ru: string;
        zh: string;
    };
}

// Dizionario di traduzioni comuni per portachiavi
const commonTranslations: Record<string, Record<string, string>> = {
    // Materiali
    'resina': {
        it: 'resina',
        en: 'resin',
        fr: 'résine',
        es: 'resina',
        de: 'Harz',
        pt: 'resina',
        ru: 'смола',
        zh: '树脂'
    },
    'acciaio': {
        it: 'acciaio',
        en: 'steel',
        fr: 'acier',
        es: 'acero',
        de: 'Stahl',
        pt: 'aço',
        ru: 'сталь',
        zh: '钢'
    },
    'metallo': {
        it: 'metallo',
        en: 'metal',
        fr: 'métal',
        es: 'metal',
        de: 'Metall',
        pt: 'metal',
        ru: 'металл',
        zh: '金属'
    },
    'cuoio': {
        it: 'cuoio',
        en: 'leather',
        fr: 'cuir',
        es: 'cuero',
        de: 'Leder',
        pt: 'couro',
        ru: 'кожа',
        zh: '皮革'
    },
    'legno': {
        it: 'legno',
        en: 'wood',
        fr: 'bois',
        es: 'madera',
        de: 'Holz',
        pt: 'madeira',
        ru: 'дерево',
        zh: '木材'
    },
    'argento': {
        it: 'argento',
        en: 'silver',
        fr: 'argent',
        es: 'plata',
        de: 'Silber',
        pt: 'prata',
        ru: 'серебро',
        zh: '银'
    },
    'ottone': {
        it: 'ottone',
        en: 'brass',
        fr: 'laiton',
        es: 'latón',
        de: 'Messing',
        pt: 'latão',
        ru: 'латунь',
        zh: '黄铜'
    },

    // Colori
    'rosso': {
        it: 'rosso',
        en: 'red',
        fr: 'rouge',
        es: 'rojo',
        de: 'rot',
        pt: 'vermelho',
        ru: 'красный',
        zh: '红色'
    },
    'blu': {
        it: 'blu',
        en: 'blue',
        fr: 'bleu',
        es: 'azul',
        de: 'blau',
        pt: 'azul',
        ru: 'синий',
        zh: '蓝色'
    },
    'verde': {
        it: 'verde',
        en: 'green',
        fr: 'vert',
        es: 'verde',
        de: 'grün',
        pt: 'verde',
        ru: 'зеленый',
        zh: '绿色'
    },
    'nero': {
        it: 'nero',
        en: 'black',
        fr: 'noir',
        es: 'negro',
        de: 'schwarz',
        pt: 'preto',
        ru: 'черный',
        zh: '黑色'
    },
    'bianco': {
        it: 'bianco',
        en: 'white',
        fr: 'blanc',
        es: 'blanco',
        de: 'weiß',
        pt: 'branco',
        ru: 'белый',
        zh: '白色'
    },
    'oro': {
        it: 'oro',
        en: 'gold',
        fr: 'or',
        es: 'oro',
        de: 'gold',
        pt: 'ouro',
        ru: 'золотой',
        zh: '金色'
    },

    // Parole comuni
    'portachiavi': {
        it: 'portachiavi',
        en: 'keychain',
        fr: 'porte-clés',
        es: 'llavero',
        de: 'Schlüsselanhänger',
        pt: 'chaveiro',
        ru: 'брелок',
        zh: '钥匙扣'
    },
    'fatto a mano': {
        it: 'fatto a mano',
        en: 'handmade',
        fr: 'fait à la main',
        es: 'hecho a mano',
        de: 'handgefertigt',
        pt: 'feito à mão',
        ru: 'ручной работы',
        zh: '手工制作'
    },
    'artigianale': {
        it: 'artigianale',
        en: 'artisan',
        fr: 'artisanal',
        es: 'artesanal',
        de: 'handwerklich',
        pt: 'artesanal',
        ru: 'ремесленный',
        zh: '手工艺'
    },
    'elegante': {
        it: 'elegante',
        en: 'elegant',
        fr: 'élégant',
        es: 'elegante',
        de: 'elegant',
        pt: 'elegante',
        ru: 'элегантный',
        zh: '优雅'
    },
    'moderno': {
        it: 'moderno',
        en: 'modern',
        fr: 'moderne',
        es: 'moderno',
        de: 'modern',
        pt: 'moderno',
        ru: 'современный',
        zh: '现代'
    },
    'classico': {
        it: 'classico',
        en: 'classic',
        fr: 'classique',
        es: 'clásico',
        de: 'klassisch',
        pt: 'clássico',
        ru: 'классический',
        zh: '经典'
    },
    'vintage': {
        it: 'vintage',
        en: 'vintage',
        fr: 'vintage',
        es: 'vintage',
        de: 'vintage',
        pt: 'vintage',
        ru: 'винтажный',
        zh: '复古'
    },
    'unico': {
        it: 'unico',
        en: 'unique',
        fr: 'unique',
        es: 'único',
        de: 'einzigartig',
        pt: 'único',
        ru: 'уникальный',
        zh: '独特'
    },
};

/**
 * Traduce automaticamente un testo usando il dizionario delle traduzioni comuni
 * Se una parola non è nel dizionario, la lascia invariata
 */
function translateText(text: string, targetLang: keyof ProductTranslations['name']): string {
    if (targetLang === 'it') return text; // Testo originale già in italiano

    let translated = text;

    // Sostituisce le parole conosciute con le loro traduzioni
    Object.entries(commonTranslations).forEach(([italian, translations]) => {
        const regex = new RegExp(`\\b${italian}\\b`, 'gi');
        translated = translated.replace(regex, translations[targetLang] || italian);
    });

    return translated;
}

/**
 * Genera automaticamente tutte le traduzioni per un prodotto
 * @param name Nome del prodotto in italiano
 * @param description Descrizione del prodotto in italiano
 * @returns Oggetto con tutte le traduzioni
 */
export function autoTranslateProduct(name: string, description: string): ProductTranslations {
    const languages: Array<keyof ProductTranslations['name']> = ['it', 'en', 'fr', 'es', 'de', 'pt', 'ru', 'zh'];

    const nameTranslations = {} as ProductTranslations['name'];
    const descriptionTranslations = {} as ProductTranslations['description'];

    languages.forEach(lang => {
        nameTranslations[lang] = translateText(name, lang);
        descriptionTranslations[lang] = translateText(description, lang);
    });

    return {
        name: nameTranslations,
        description: descriptionTranslations
    };
}

/**
 * Aggiunge una nuova traduzione al dizionario
 * Utile per espandere il vocabolario nel tempo
 */
export function addTranslation(italian: string, translations: Record<string, string>) {
    commonTranslations[italian.toLowerCase()] = {
        it: italian,
        ...translations
    };
}

/**
 * Ottiene tutte le traduzioni disponibili (per debug/admin)
 */
export function getAvailableTranslations(): typeof commonTranslations {
    return commonTranslations;
}
