'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './ROICalculator.module.css';

// Типы для криптовалют и точек ROI
type Crypto = {
  id: string;
  name: string;
  image: string;
  symbol: string;
  current_price: number;
};

type RoiPoint = {
  price: string;
  roi: number;
  profit: number;
};

const ROICalculator = () => {
  const [investment, setInvestment] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [roi, setRoi] = useState<number | null>(null);
  const [profit, setProfit] = useState<number | null>(null);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('bitcoin');
  const [roiData, setRoiData] = useState<RoiPoint[]>([]);
  const [holdDays, setHoldDays] = useState('');
  const [holdMonths, setHoldMonths] = useState('');
  const [monthlyInvestment, setMonthlyInvestment] = useState('');

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

  useEffect(() => {
    const fetchPrice = async () => {
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: selectedCrypto,
          vs_currencies: 'usd',
        },
      });
      setBuyPrice(response.data[selectedCrypto]?.usd.toString() || '');
    };
    fetchPrice();
  }, [selectedCrypto]);

  const calculateROI = () => {
    const invest = parseFloat(investment);
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);

    if (isNaN(invest) || isNaN(buy) || isNaN(sell) || buy === 0) {
      setRoi(null);
      setProfit(null);
      setRoiData([]);
      return;
    }

    const amount = invest / buy;
    const roiResult = ((sell - buy) / buy) * 100;
    const profitResult = (sell - buy) * amount;

    setRoi(roiResult);
    setProfit(profitResult);

    const simulatedData: RoiPoint[] = [];
    for (let p = buy * 0.5; p <= buy * 2.5; p += (buy * 0.1)) {
      const r = ((p - buy) / buy) * 100;
      const pr = (p - buy) * amount;
      simulatedData.push({ price: p.toFixed(2), roi: parseFloat(r.toFixed(2)), profit: parseFloat(pr.toFixed(2)) });
    }
    setRoiData(simulatedData);
  };

  // Функция для скачивания данных в CSV
  const downloadCSV = () => {
    if (roi === null || profit === null) return;

    const csvContent = `Investments ($): ${investment} ($),\n Buy Price ($): ${buyPrice} ($),\n Sell Price ($): ${sellPrice} ($),\n ROI (%): ${roi.toFixed(2)}(%),\n Profit ($): ${profit.toFixed(2)} ($).`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'roi-result.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.roiCalculator}>
      <h2>ROI-калькулятор криптовалют</h2>

      <select value={selectedCrypto} onChange={(e) => setSelectedCrypto(e.target.value)}>
        {cryptos.map((crypto) => (
          <option key={crypto.id} value={crypto.id}>
            {crypto.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="💸 Сумма инвестиций ($)"
        value={investment}
        onChange={(e) => setInvestment(e.target.value)}
      />

      <label className="block mb-1">💲 Начальная цена монеты ($)</label>
      <input
        type="number"
        placeholder="📉 Начальная цена актива ($)"
        value={buyPrice || ''}
        onChange={(e) => setBuyPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="📈 Текущая/будущая цена ($)"
        value={sellPrice}
        onChange={(e) => setSellPrice(e.target.value)}
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="number"
          placeholder="📆 Период удержания (дней)"
          value={holdDays}
          onChange={(e) => setHoldDays(e.target.value)}
        />

        <input
          type="number"
          placeholder="месяцев"
          value={holdMonths}
          onChange={(e) => setHoldMonths(e.target.value)}
        />
      </div>

      <input
        type="number"
        placeholder="➕ Ежемесячные вложения ($)"
        value={monthlyInvestment}
        onChange={(e) => setMonthlyInvestment(e.target.value)}
      />

      <button onClick={calculateROI}>Рассчитать прибыль</button>

      {roi !== null && profit !== null && (
        <div className={styles.result}>
          <p>📌 ROI: {roi.toFixed(2)}%</p>
          <p>📌 Прибыль: ${profit.toFixed(2)}</p>
          <button onClick={downloadCSV}>📥 Скачать CSV</button>
        </div>
      )}

      {roiData.length > 0 && (
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="price" label={{ value: 'Цена продажи ($)', position: 'insideBottomRight', offset: -5 }} />
              <YAxis yAxisId="left" orientation="left" stroke="#00FF99" label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#FFD700" label={{ value: 'Прибыль ($)', angle: -90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="roi" stroke="#00FF99" name="ROI (%)" />
              <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#FFD700" name="Прибыль ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <p style={{ marginTop: '2rem', color: '#888888', fontSize: '0.9rem' }}>
        Калькулятор позволяет рассчитать потенциальную доходность инвестиций в криптовалюту на основе начальной цены, предполагаемой цены продажи и вложенной суммы. Можно указать ежемесячные вложения и срок удержания, чтобы смоделировать инвестиционный сценарий.
      </p>
    </div>
  );
};

export default ROICalculator;
