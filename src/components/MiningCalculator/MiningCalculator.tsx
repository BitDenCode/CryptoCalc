'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import styles from './MiningCalculator.module.css';

interface Crypto {
  id: string;
  name: string;
  image: string;
}

const MiningCalculator = () => {
  const [hashrate, setHashrate] = useState('');
  const [powerConsumption, setPowerConsumption] = useState('');
  const [electricityCost, setElectricityCost] = useState('');
  const [cryptoPrice, setCryptoPrice] = useState<number | null>(null);
  const [dailyProfit, setDailyProfit] = useState<number | null>(null);
  const [dailyCost, setDailyCost] = useState<number | null>(null);
  const [profitability, setProfitability] = useState<number | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [blockReward, setBlockReward] = useState('');
  const [networkDifficulty, setNetworkDifficulty] = useState('');
  const [manualPrice, setManualPrice] = useState('');

  // Получаем список криптовалют
  useEffect(() => {
    const fetchCryptos = async () => {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
        },
      });
      setCryptos(response.data);
    };

    fetchCryptos();
  }, []);

  // Получаем цену выбранной криптовалюты
  useEffect(() => {
    const fetchCryptoPrice = async () => {
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: selectedCrypto,
          vs_currencies: 'usd',
        },
      });
      setCryptoPrice(response.data[selectedCrypto]?.usd || 0);
    };

    fetchCryptoPrice();
  }, [selectedCrypto]);

  // Рассчитываем прибыльность майнинга
  const calculateMiningProfitability = () => {
    const hashrateNum = parseFloat(hashrate);
    const powerNum = parseFloat(powerConsumption);
    const electricityNum = parseFloat(electricityCost);
    const reward = parseFloat(blockReward) || 6.25; // Default reward (for Bitcoin)
    const difficulty = parseFloat(networkDifficulty) || 1000000; // Default difficulty

    if (isNaN(hashrateNum) || isNaN(powerNum) || isNaN(electricityNum) || !cryptoPrice) {
      setDailyProfit(null);
      setDailyCost(null);
      setProfitability(null);
      return;
    }

    // Эмпирическая модель: вычисляем доходность майнинга
    const earningsPerDay = (hashrateNum * reward * 86400) / (difficulty * 1000000);
    const energyCostPerDay = (powerNum * 24) * (electricityNum / 1000); // Ватт в киловатт

    const profitPerDay = earningsPerDay * (manualPrice ? parseFloat(manualPrice) : cryptoPrice) - energyCostPerDay;

    setDailyProfit(profitPerDay);
    setDailyCost(energyCostPerDay);
    setProfitability((profitPerDay / energyCostPerDay) * 100); // ROI по затратам на энергию
  };

  // Функция для скачивания данных в CSV
  const downloadCSV = () => {
    if (dailyProfit !== null && dailyCost !== null && profitability !== null) {
      const data = [
        { Parameter: 'Selected cryptocurrency', Value: selectedCrypto },
        { Parameter: 'Profit for the day ($)', Value: dailyProfit.toFixed(2) },
        { Parameter: 'Energy costs ($)', Value: dailyCost.toFixed(2) },
        { Parameter: 'ROI (%)', Value: profitability.toFixed(2) },
        { Parameter: 'Net profit for the day ($)', Value: (dailyProfit - dailyCost).toFixed(2) },
      ];

      // Используем papaparse для генерации CSV
      const csv = Papa.unparse(data);
      
      // Создаём ссылку для скачивания
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Создаём ссылку и инициируем скачивание
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'mining_calculation.csv');
        link.click();
      }
    }
  };

  return (
    <div className={styles.miningCalculator}>
      <h2>Калькулятор майнинга</h2>

      <div className="space-y-4">
        <div>
          
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            className="w-full p-2 rounded bg-background border border-border text-text"
          >
            {cryptos.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          
          <input
            placeholder="📊 Хэшрейт (MH/s)"
            type="number"
            value={hashrate}
            onChange={(e) => setHashrate(e.target.value)}
            className="w-full p-2 rounded bg-background border border-border text-text"
          />
        </div>

        <div>
          
          <input
            placeholder="💡 Потребление энергии (Вт)"
            type="number"
            value={powerConsumption}
            onChange={(e) => setPowerConsumption(e.target.value)}
            className="w-full p-2 rounded bg-background border border-border text-text"
          />
        </div>

        <div>
          
          <input
            placeholder="💲 Стоимость электроэнергии ($/kWh)"
            type="number"
            value={electricityCost}
            onChange={(e) => setElectricityCost(e.target.value)}
            className="w-full p-2 rounded bg-background border border-border text-text"
          />
        </div>

        <div>
          
          <input
            placeholder="💰 Награда за блок (по умолчанию 6.25)"
            type="number"
            value={blockReward}
            onChange={(e) => setBlockReward(e.target.value)}
            className="w-full p-2 rounded bg-background border border-border text-text"
          />
        </div>

        <div>
          
          <input
            placeholder="🔧 Сложность сети"
            type="number"
            value={networkDifficulty}
            onChange={(e) => setNetworkDifficulty(e.target.value)}
            className="w-full p-2 rounded bg-background border border-border text-text"
          />
        </div>

        <div>
          <label className="block mb-1">💲 Цена монеты ($)</label>
          <input
            placeholder="💲 Цена монеты"
            type="number"
            value={manualPrice || cryptoPrice || ''}
            onChange={(e) => setManualPrice(e.target.value)}
            className="w-full p-2 rounded bg-background border border-border text-text"
            disabled={!manualPrice && !cryptoPrice}
          />
        </div>

        <button
          onClick={calculateMiningProfitability}
          className="bg-accent-green text-black px-4 py-2 rounded hover:opacity-90 transition"
        >
          Рассчитать
        </button>

        {dailyProfit !== null && dailyCost !== null && profitability !== null && (
          <div className="mt-4 space-y-2">
            <p>
              <span className="font-semibold">Прибыль за день:</span> ${dailyProfit.toFixed(2)}
            </p>
            <p>
              <span className="font-semibold">Затраты на электроэнергию:</span> ${dailyCost.toFixed(2)}
            </p>
            <p>
              <span className="font-semibold">ROI (по затратам на энергию):</span> {profitability.toFixed(2)}%
            </p>
            <p>
              <span className="font-semibold">Чистая прибыль за день:</span> ${(dailyProfit - dailyCost).toFixed(2)}
            </p>
          </div>
        )}

        <button
          onClick={downloadCSV}
          className="bg-accent-green text-black px-4 py-2 rounded hover:opacity-90 transition"
        >
          Скачать результат CSV 📥
        </button>

        <p style={{ marginTop: '2rem', color: '#888888', fontSize: '0.9rem' }}>
          Калькулятор автоматически подгружает актуальную цену выбранной криптовалюты и рассчитывает вашу чистую прибыль от майнинга с учётом затрат на электроэнергию и мощности оборудования.
        </p>
      </div>
    </div>
  );
};

export default MiningCalculator;


