import { useEffect, useState } from 'react';

const useCryptoPrices = (ids: string[], vsCurrency: string = 'usd') => {
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const idsParam = ids.join(',');
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=${vsCurrency}`);
        const data = await response.json();
        const formattedPrices: Record<string, number> = {};
        ids.forEach(id => {
          formattedPrices[id] = data[id]?.[vsCurrency] || 0;
        });
        setPrices(formattedPrices);
      } catch (error) {
        console.error('Ошибка при получении цен:', error);
      }
    };

    fetchPrices();
  }, [ids, vsCurrency]);

  return prices;
};

export default useCryptoPrices;
