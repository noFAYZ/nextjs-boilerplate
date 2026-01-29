import { useMemo } from 'react';
import type { Merchant } from '@/components/modules/transactions/components/card-view/types';

export function useMerchantsMap(merchantsResponse: any): Map<string, Merchant> {
  return useMemo(() => {
    const merchants = Array.isArray(merchantsResponse)
      ? merchantsResponse
      : merchantsResponse?.data || [];

    const map = new Map<string, Merchant>();
    merchants.forEach((m: any) => {
      map.set(m.id, {
        id: m.id,
        name: m.name,
        logo: m.logo,
      });
    });
    return map;
  }, [merchantsResponse]);
}
