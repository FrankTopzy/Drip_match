export type GarmentCategoryFilter = 'all' | 'upper_body' | 'lower_body' | 'full_body';
//import pic1 from '/garments/testFit1.jpg'

export interface Garment {
  id: string;
  name: string;
  category: 'upper_body' | 'lower_body' | 'full_body';
  imageUrl: string;
  description: string;
  price: string;
}

/**
 * Sample garment catalog.
 * These use YouCam's publicly hosted sample images to work out of the box.
 * Replace with your own product images / CDN URLs for production.
 */
export const garments: Garment[] = [
  {
    id: 'g1',
    name: 'Classic White Tee',
    category: 'upper_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit6.jpg',
    description: 'A clean, minimalist white t-shirt for everyday wear.',
    price: '$29.99',
  },
  {
    id: 'g2',
    name: 'Denim Jacket',
    category: 'upper_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit1.jpg',
    description: 'Rugged denim jacket with a modern slim fit.',
    price: '$89.99',
  },
  {
    id: 'g3',
    name: 'Argentina Jersey',
    category: 'upper_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit2.jpg',
    description: 'Argentina FIFA World Cup 2026 Jersey',
    price: '$39.99',
  },
  {
    id: 'g4',
    name: 'Floral Blouse',
    category: 'upper_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit3.jpg',
    description: 'Elegant floral blouse with a relaxed silhouette.',
    price: '$49.99',
  },
  {
    id: 'g5',
    name: 'Graphic Hoodie',
    category: 'upper_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit4.jpg',
    description: 'Oversized graphic hoodie for streetwear looks.',
    price: '$59.99',
  },
  {
    id: 'g6',
    name: 'Linen Shirt',
    category: 'upper_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit5.jpg',
    description: 'Lightweight linen button-up, perfect for summer.',
    price: '$44.99',
  },
];
