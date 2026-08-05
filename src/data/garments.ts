export type GarmentCategoryFilter = 'all' | 'upper_body' | 'lower_body' | 'full_body';
import pic1 from '/garments/testFit1.jpg'

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
    imageUrl:
      'https://plugins-media.makeupar.com/strapi/assets/clothes_01_10be1e1a9b.png',
    description: 'A clean, minimalist white t-shirt for everyday wear.',
    price: '$29.99',
  },
  {
    id: 'g2',
    name: 'Denim Jacket',
    category: 'upper_body',
    imageUrl: pic1,
    description: 'Rugged denim jacket with a modern slim fit.',
    price: '$89.99',
  },
  {
    id: 'g3',
    name: 'Striped Polo',
    category: 'upper_body',
    imageUrl:
      'https://plugins-media.makeupar.com/strapi/assets/clothes_03_88c2bf9b73.png',
    description: 'Casual striped polo shirt, breathable cotton blend.',
    price: '$39.99',
  },
  {
    id: 'g4',
    name: 'Floral Blouse',
    category: 'upper_body',
    imageUrl:
      'https://plugins-media.makeupar.com/strapi/assets/clothes_04_02e0302a54.png',
    description: 'Elegant floral blouse with a relaxed silhouette.',
    price: '$49.99',
  },
  {
    id: 'g5',
    name: 'Graphic Hoodie',
    category: 'upper_body',
    imageUrl:
      'https://plugins-media.makeupar.com/strapi/assets/clothes_05_c5cfcdded5.png',
    description: 'Oversized graphic hoodie for streetwear looks.',
    price: '$59.99',
  },
  {
    id: 'g6',
    name: 'Linen Shirt',
    category: 'upper_body',
    imageUrl:
      'https://plugins-media.makeupar.com/strapi/assets/clothes_06_59f971eab9.png',
    description: 'Lightweight linen button-up, perfect for summer.',
    price: '$44.99',
  },
];

/**
 * Sample reference / model photos.
 * Users can also upload their own.
 */
export const sampleReferencePhotos = [
  {
    id: 'ref1',
    label: 'Model — Full Body',
    url: 'https://plugins-media.makeupar.com/strapi/assets/clothes_reference_full_body_01_8190f45a28.png',
  },
  {
    id: 'ref2',
    label: 'Model — Half Body',
    url: 'https://plugins-media.makeupar.com/strapi/assets/clothes_reference_half_body_01_61a1c9b8a0.png',
  },
];
