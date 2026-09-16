export type ProductCategory = 'todas' | 'clubes-europa' | 'selecciones' | 'version-jugador' | 'retro';

export type JerseyVersion = 'Versión Jugador' | 'Versión Fan' | 'Edición Especial Retro';

export type JerseySize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface JerseyProduct {
  id: string;
  name: string;
  team: string;
  league: string;
  season: string;
  category: 'clubes-europa' | 'selecciones' | 'version-jugador' | 'retro';
  version: JerseyVersion;
  retailPrice: number;       // Precio al detal (ej: 25)
  wholesalePrice: number;    // Precio al mayor (ej: 18)
  image: string;            // Imagen principal
  images?: string[];         // Galería adicional de imágenes (opcional)
  badges: string[];          // ['Top Ventas', 'Nuevo 24/25', etc.]
  description: string;
  sizes: JerseySize[];
  popularPlayers?: string[]; // Dorsales sugeridos (ej: Vinicius 7, Bellingham 5)
  isFeatured?: boolean;
  inStock?: boolean;
  fabricTech?: string;       // ej: HEAT.RDY / Dri-FIT ADV / AeroReady
  video?: string;           // Video corto del artículo (máx 15 segundos)
}

export interface CartItem {
  cartItemId: string; // Unique ID for product + size + customization combination
  product: JerseyProduct;
  size: JerseySize;
  quantity: number;
  customName?: string;
  customNumber?: string;
}

export interface CustomerInfo {
  name: string;
  city: string;
  phone?: string;
  notes?: string;
}

export interface SiteSettings {
  heroVideoUrl: string; // URL for the TikTok video (MP4 or embed URL)
  whatsappNumbers: string[]; // Hasta 4 números para pedidos (rotación automática)

  // Identidad y textos de la tienda
  storeName: string;
  storeTagline: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;

  // Barra de anuncio superior
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink: string;

  // Redes y contacto
  whatsappChannelUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;

  // Tema de marca (colores)
  brandPrimaryColor: string;
  brandSuccessColor: string;

  // Sedes físicas
  stores: StoreLocation[];

  // Banners de portada
  banners: HomeBanner[];
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  mapsUrl: string;
  hours: string;
}

export interface HomeBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  link: string;
  active: boolean;
}
