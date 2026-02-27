// types/product.ts

export type ProductImage = {
    url: string;
    alt: string;
};

export type ProductMaterial =
    | 'Metallo dorato'
    | 'Perline cristallo'
    | 'Catena'
    | 'Metallo argentato'
    | 'Charm decorativi'
    | 'Perline vetro'
    | 'Filo metallico'
    | 'Moschettone'
    | 'Resina colorata'
    | 'Glitter'
    | 'Anello portachiavi';

export type ProductCategory = 'Classici' | 'Personalizzati' | 'Colorati';

export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    images: ProductImage[];
    category: ProductCategory;
    inStock: boolean;
    materials: ProductMaterial[];
    dimensions: string;
};