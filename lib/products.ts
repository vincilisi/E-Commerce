import { Product } from '@/types/product';

export const products: Product[] = [
    {
        id: '1',
        name: 'Portachiavi Stella Dorata',
        description: 'Elegante portachiavi fatto a mano con stella dorata e perline cristallo',
        price: 12.99,
        images: ['/products/stella-dorata.jpg'],
        category: 'Classici',
        inStock: true,
        materials: ['Metallo dorato', 'Perline cristallo', 'Catena'],
        dimensions: '8cm x 3cm'
    },
    {
        id: '2',
        name: 'Portachiavi Luna Argentata',
        description: 'Portachiavi artigianale con ciondolo luna e charm stelline',
        price: 10.99,
        images: ['/products/luna-argentata.jpg'],
        category: 'Classici',
        inStock: true,
        materials: ['Metallo argentato', 'Charm decorativi'],
        dimensions: '7cm x 3cm'
    },
    {
        id: '3',
        name: 'Portachiavi Costellazione',
        description: 'Design unico con perline che formano una costellazione personalizzabile',
        price: 15.99,
        images: ['/products/costellazione.jpg'],
        category: 'Personalizzati',
        inStock: true,
        materials: ['Perline vetro', 'Filo metallico', 'Moschettone'],
        dimensions: '10cm x 4cm'
    },
    {
        id: '4',
        name: 'Portachiavi Stelle Colorate',
        description: 'Set di mini stelle colorate con dettagli brillanti',
        price: 9.99,
        images: ['/products/stelle-colorate.jpg'],
        category: 'Colorati',
        inStock: true,
        materials: ['Resina colorata', 'Glitter', 'Anello portachiavi'],
        dimensions: '6cm x 2.5cm'
    }
];

export function getProductById(id: string): Product | undefined {
    return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
    return products.filter(p => p.category === category);
}
