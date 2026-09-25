import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DeliverySettings } from '../types';
import {
  DEFAULT_DELIVERY_SETTINGS,
  fetchDeliverySettings,
  writeStoredDelivery,
} from '../services/deliveryService';

interface DeliveryContextValue {
  settings: DeliverySettings;
  isLoading: boolean;
  save: (next: DeliverySettings) => void;
}

const DeliveryContext = createContext<DeliveryContextValue | null>(null);

export function DeliveryProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<DeliverySettings>(DEFAULT_DELIVERY_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchDeliverySettings()
      .then((loaded) => {
        if (!cancelled) setSettings(loaded);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback((next: DeliverySettings) => {
    writeStoredDelivery(next);
    setSettings(next);
  }, []);

  const value = useMemo<DeliveryContextValue>(
    () => ({ settings, isLoading, save }),
    [settings, isLoading, save]
  );

  return <DeliveryContext.Provider value={value}>{children}</DeliveryContext.Provider>;
}

export function useDelivery(): DeliveryContextValue {
  const ctx = useContext(DeliveryContext);
  if (!ctx) {
    throw new Error('useDelivery debe usarse dentro de <DeliveryProvider>');
  }
  return ctx;
}