import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BcvRateResult, getBcvRate, usdToBs, formatBs } from '../services/bcvRateService';

type BcvStatus = 'loading' | 'ready' | 'unavailable';

interface BcvRateContextValue {
  rate: number | null;      // Tasa BCV (Bs por USD) o null si no hay
  fecha: string | null;     // Fecha de la tasa (YYYY-MM-DD)
  status: BcvStatus;
  stale: boolean;           // true si se usa un valor viejo por fallo de red
  usdToBs: (usd: number) => number;
  formatBs: (amount: number, maxFractionDigits?: number) => string;
}

const BcvRateContext = createContext<BcvRateContextValue | null>(null);

export function BcvRateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BcvRateResult | null>(null);
  const [status, setStatus] = useState<BcvStatus>('loading');

  useEffect(() => {
    let cancelled = false;
    getBcvRate()
      .then((result) => {
        if (cancelled) return;
        setState(result);
        setStatus(result ? 'ready' : 'unavailable');
      })
      .catch(() => {
        if (!cancelled) setStatus('unavailable');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const convert = useCallback(
    (usd: number) => usdToBs(usd, state?.rate),
    [state?.rate]
  );

  const value = useMemo<BcvRateContextValue>(
    () => ({
      rate: state?.rate ?? null,
      fecha: state?.fecha ?? null,
      status,
      stale: state?.stale ?? false,
      usdToBs: convert,
      formatBs,
    }),
    [state, status, convert]
  );

  return <BcvRateContext.Provider value={value}>{children}</BcvRateContext.Provider>;
}

export function useBcvRate(): BcvRateContextValue {
  const ctx = useContext(BcvRateContext);
  if (!ctx) {
    throw new Error('useBcvRate debe usarse dentro de <BcvRateProvider>');
  }
  return ctx;
}