
export interface ProductImage {
    alt: string;
    url: string;
}

export interface ProductMaterial {
    id: string;
    name: string;
}

export interface ProductTag {
    id: string;
    name: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: ProductImage[];
    category: string;
    inStock: boolean;
    materials?: ProductMaterial[];
    tags?: ProductTag[];
    dimensions?: string;
}

export interface CartItem extends Product {
    quantity: number;
}
