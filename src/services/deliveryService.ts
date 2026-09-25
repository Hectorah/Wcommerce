import { DeliverySettings, GeoDeliveryZone, GeoPoint } from '../types';

// Configuración por defecto: una ciudad (Valencia) con delivery de $1.
export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  deliveryEnabled: true,
  pickupEnabled: true,
  pickupNote: 'Retiro gratis en tu tienda más cercana. Te avisamos cuando esté listo.',
  zones: [
    {
      id: 'valencia',
      name: 'Valencia',
      city: 'Valencia, Carabobo',
      cost: 1,
      center: { lat: 10.1767, lng: -67.9972 },
      radiusKm: 10,
    },
  ],
};

export const DELIVERY_STORAGE_KEY = 'wcommerce_geolocalizacion';
const DELIVERY_DATA_URL = '/data/geolocalizacion.json';

function toNumber(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// Completa un objeto delivery cargado (archivo/localStorage) con los defaults.
export function normalizeDeliverySettings(value: unknown): DeliverySettings {
  const v = (value && typeof value === 'object' ? value : {}) as Partial<DeliverySettings>;
  return {
    deliveryEnabled: v.deliveryEnabled !== false,
    pickupEnabled: v.pickupEnabled !== false,
    pickupNote: typeof v.pickupNote === 'string' ? v.pickupNote : DEFAULT_DELIVERY_SETTINGS.pickupNote,
    zones: Array.isArray(v.zones)
      ? v.zones
          .filter((z): z is GeoDeliveryZone => !!z && typeof z === 'object')
          .map((z, i) => ({
            id: z.id || `zone-${i}`,
            name: z.name || `Zona ${i + 1}`,
            city: z.city || '',
            cost: toNumber(z.cost, 1),
            center: {
              lat: toNumber(z.center?.lat, 0),
              lng: toNumber(z.center?.lng, 0),
            },
            radiusKm: toNumber(z.radiusKm, 10),
          }))
      : DEFAULT_DELIVERY_SETTINGS.zones,
  };
}

export function readStoredDelivery(): DeliverySettings | null {
  try {
    const raw = localStorage.getItem(DELIVERY_STORAGE_KEY);
    if (!raw) return null;
    return normalizeDeliverySettings(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeStoredDelivery(settings: DeliverySettings): void {
  try {
    localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage lleno o bloqueado: seguimos sin persistir.
  }
}

// Carga el archivo /data/geolocalizacion.json y aplica el override de localStorage
// (ediciones del admin), igual que sucede con productos/settings por preset.
export async function fetchDeliverySettings(): Promise<DeliverySettings> {
  let settings = DEFAULT_DELIVERY_SETTINGS;
  try {
    const res = await fetch(DELIVERY_DATA_URL, { mode: 'cors' });
    if (res.ok) {
      settings = normalizeDeliverySettings(await res.json());
    }
  } catch {
    // Archivo no disponible: usamos defaults.
  }

  const stored = readStoredDelivery();
  if (stored) return stored;
  return settings;
}

export function getDefaultZone(settings: DeliverySettings): GeoDeliveryZone | null {
  return settings.zones.length > 0 ? settings.zones[0] : null;
}

// Distancia Haversine entre dos puntos en kilómetros.
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371; // Radio terrestre en km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Indica si una coordenada cae dentro de la zona de una ciudad.
export function isInsideZone(point: GeoPoint, zone: GeoDeliveryZone): boolean {
  if (!zone.center || !Number.isFinite(zone.center.lat) || !Number.isFinite(zone.center.lng)) return false;
  return haversineKm(point, zone.center) <= (zone.radiusKm || 0);
}