// Servicio de tasa BCV (dólar oficial).
// Consulta la tasa una vez al día a la API pública de DolarApi (fuente BCV),
// la cachea en localStorage y, si la red falla, reutiliza el último valor conocido.

export interface BcvRateResult {
  rate: number;        // Tasa oficial BCV (promedio) en Bs por USD
  fecha: string;       // Fecha de actualización de la tasa (YYYY-MM-DD)
  source: 'api' | 'cache';
  stale: boolean;      // true si viene de cache viejo por fallo de red
}

interface BcvRateCache {
  rate: number;
  fecha: string;
  fetchedAt: string;   // Fecha local en que se guardó (YYYY-MM-DD)
}

const API_URL = 'https://ve.dolarapi.com/v1/dolares/oficial';
const CACHE_KEY = 'wcommerce_bcv_rate';

const intlCache = new Map<string, Intl.NumberFormat>();

// Single-flight: si dos componentes piden la tasa a la vez, solo hacemos un fetch.
let inFlight: Promise<BcvRateResult | null> | null = null;

function cacheKeyDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function readCache(): BcvRateCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BcvRateCache;
    if (typeof parsed?.rate !== 'number' || parsed.rate <= 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(cache: BcvRateCache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Si localStorage está lleno o bloqueado, seguimos sin cache.
  }
}

async function fetchRateFromApi(): Promise<BcvRateResult | null> {
  const res = await fetch(API_URL, { mode: 'cors' });
  if (!res.ok) throw new Error(`BCV rate HTTP ${res.status}`);
  const data = await res.json();
  const rate = Number(data?.promedio);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error('BCV rate inválido');
  const fecha = cacheKeyDate(new Date(data?.fechaActualizacion || Date.now()));
  return { rate, fecha, source: 'api', stale: false };
}

// Devuelve la tasa del día. Prioridad: cache del día → API → último cache.
export async function getBcvRate(): Promise<BcvRateResult | null> {
  const cached = readCache();
  const today = cacheKeyDate(new Date());

  // Cache fresco del día: responder sin red.
  if (cached && cached.fetchedAt === today) {
    return { rate: cached.rate, fecha: cached.fecha, source: 'cache', stale: false };
  }

  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const result = await fetchRateFromApi();
      if (result) {
        writeCache({ rate: result.rate, fecha: result.fecha, fetchedAt: today });
      }
      return result;
    } catch {
      // Offline o API caída: reutilizar el último valor conocido.
      return cached
        ? { rate: cached.rate, fecha: cached.fecha, source: 'cache', stale: true }
        : null;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

// Convierte un monto en USD a Bolívares usando una tasa dada (o la del servicio).
export function usdToBs(usd: number, rate: number | null | undefined): number {
  if (!rate || !Number.isFinite(usd)) return 0;
  return usd * rate;
}

// Formatea un monto en Bs con el formato local venezolano (ej: Bs 21.361,59).
export function formatBs(amount: number, maxFractionDigits = 2): string {
  let formatter = intlCache.get(String(maxFractionDigits));
  if (!formatter) {
    formatter = new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      maximumFractionDigits: maxFractionDigits,
      minimumFractionDigits: maxFractionDigits > 0 ? 2 : 0,
    });
    intlCache.set(String(maxFractionDigits), formatter);
  }
  return formatter.format(amount);
}