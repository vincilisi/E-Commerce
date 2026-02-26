import { formatPrice } from '@/lib/utils';
import { render, screen } from '@testing-library/react';
import ProductCard from '../components/ProductCard';
import { LanguageProvider } from '../lib/LanguageContext';

describe('ProductCard', () => {
  it('renders product name and price', () => {
    render(
      <LanguageProvider>
        <ProductCard product={{
          id: '1',
          name: 'Test Product',
          description: 'desc',
          price: 10,
          images: [],
          category: 'cat',
          inStock: true,
          materials: [],
          tags: [],
          dimensions: ''
        }} />
      </LanguageProvider>
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    // Cerca un elemento che contenga un numero (prezzo) in qualsiasi valuta
    const priceElement = screen.getByText((content, node) => {
      return /\d+[\.,]?\d*/.test(content);
    });
    expect(priceElement).toBeInTheDocument();
  });
});

