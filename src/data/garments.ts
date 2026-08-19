export type GarmentCategoryFilter = 'all' | 'upper_body' | 'lower_body' | 'full_body';
//import pic1 from '/garments/testFit1.jpg'

export interface Garment {
  id: string;
  name: string;
  category: 'upper_body' | 'lower_body' | 'full_body';
  imageUrl: string;
  description: string;
  price: string;
  /** Present only for custom user-uploaded garments (blob: URL). Used to upload the file to YouCam. */
  localFile?: File;
}

/**
 * Sample garment catalog.
 * These use YouCam's publicly hosted sample images to work out of the box.
 * Replace with your own product images / CDN URLs for production.
 */
export const garments: Garment[] = [
  {
    id: 'g1',
    name: 'Custom Man United Jersey',
    category: 'full_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit6.jpg',
    description: 'A clean, minimalist jersey for everyday wear.',
    price: '$29.99',
  },
  {
    id: 'g2',
    name: 'Polo Shirt',
    category: 'upper_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit1.jpg',
    description: 'Classic polo shirt for a smart casual look.',
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
    name: 'Classic Dress Shirt with inner',
    category: 'upper_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit3.jpg',
    description: 'Elegant dress shirt for a formal look.',
    price: '$49.99',
  },
  {
    id: 'g5',
    name: 'Brown & white shirt with inner',
    category: 'full_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit4.jpg',
    description: 'Brown & white shirt with inner.',
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
  {
    id: 'g7',
    name: 'Shirt & Trouser',
    category: 'full_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit7.jpg',
    description: 'A clean, minimalist outfit.',
    price: '$56.99',
  },
  {
    id: 'g8',
    name: 'Normal Black Hoodie',
    category: 'upper_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit8.jpg',
    description: 'A clean, minimalist hoodie for everyday wear.',
    price: '$21.99',
  },
  {
    id: 'g9',
    name: 'Spider Hoddie',
    category: 'upper_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit9.jpg',
    description: 'A clean, minimalist hoodie for everyday wear.',
    price: '$32.99',
  },
  {
    id: 'g10',
    name: 'Agbada',
    category: 'full_body',
    imageUrl: 'https://drip-match.vercel.app/garments/testFit10.jpg',
    description: 'A native dress.',
    price: '$39.99',
  }
];
