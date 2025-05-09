'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import styles from './StakingCalculator.module.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const COIN_IDS: Record<string, string> = {
  ETH: 'ethereum',
  BNB: 'binancecoin',
  ADA: 'cardano',
  SOL: 'solana',
  DOT: 'polkadot',
};

const StakingCalculator = () => {
  const [crypto, setCrypto] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [apy, setApy] = useState('');
  const [days, setDays] = useState('');
  const [months, setMonths] = useState('');
  const [price, setPrice] = useState('');
  const [validatorFee, setValidatorFee] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [chartData, setChartData] = useState<{ day: number; profit: number }[]>([]);

  useEffect(() => {
    const fetchPrice = async () => {
      const id = COIN_IDS[crypto];
      if (!id) return;
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
        const data = await res.json();
        setPrice(data[id]?.usd?.toString() || '');
      } catch (error) {
        console.error('Ошибка при загрузке цены:', error);
      }
    };
    fetchPrice();
  }, [crypto]);

  const calculateProfit = () => {
    const principal = parseFloat(amount);
    const annualRate = parseFloat(apy) / 100;
    const coinPrice = parseFloat(price);
    const fee = parseFloat(validatorFee) || 0;
    const totalDays = parseInt(days || '0') + parseInt(months || '0') * 30;

    if (isNaN(principal) || isNaN(annualRate) || isNaN(coinPrice) || totalDays <= 0) {
      setResult(null);
      return;
    }

    const yearlyProfit = principal * annualRate;
    const dailyProfit = yearlyProfit / 365;
    const gross = dailyProfit * totalDays;
    const net = gross * (1 - fee / 100);
    setResult(net);

    const chart: { day: number; profit: number }[] = [];
    for (let i = 1; i <= totalDays; i++) {
      const dailyGross = dailyProfit * i;
      const dailyNet = dailyGross * (1 - fee / 100);
      chart.push({ day: i, profit: parseFloat((dailyNet).toFixed(2)) });
    }
    setChartData(chart);
  };

  // Функция для скачивания данных в CSV
  const downloadCSV = () => {
    if (result !== null) {
      const data = [
        { Параметр: 'Cryptocurrency', Значение: crypto },
        { Параметр: 'Stake Amount', Значение: amount },
        { Параметр: 'APY (%)', Значение: apy },
        { Параметр: 'Period (days/months)', Значение: `${days} / ${months}` },
        { Параметр: 'Coin Price ($)', Значение: price },
        { Параметр: 'Validator Fee (%)', Значение: validatorFee || '0' },
        { Параметр: 'Expected Profit ($)', Значение: result.toFixed(2) },
      ];

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'staking_result.csv');
      link.click();
    }
  };

  return (
    <div className={styles.stakingCalculator}>
      <h2>Калькулятор стейкинга</h2>

      <select value={crypto} onChange={(e) => setCrypto(e.target.value)}>
        {Object.keys(COIN_IDS).map((symbol) => (
          <option key={symbol} value={symbol}>{symbol}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="💰 Сумма стейка"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="number"
        placeholder="📈 APY (%)"
        value={apy}
        onChange={(e) => setApy(e.target.value)}
      />

      <div style={{ display: 'flex', gap: '1rem' }}>
        <input
          type="number"
          placeholder="📆 Дней"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
        <input
          type="number"
          placeholder="Месяцев"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
        />
      </div>

      <label className="block mb-1">💲 Цена монеты ($)</label>
      <input
        type="number"
        placeholder="💲 Цена монеты ($)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="⚙ Комиссия валидатора (%)"
        value={validatorFee}
        onChange={(e) => setValidatorFee(e.target.value)}
      />

      <button onClick={calculateProfit}>Рассчитать прибыль</button>

      {result !== null && (
        <div className={styles.result}>
          <p>Ожидаемая прибыль: <strong>${result.toFixed(2)}</strong></p>
          <button onClick={downloadCSV}>Скачать результат (CSV) 📥</button>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="day" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Line type="monotone" dataKey="profit" stroke="#00FF99" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <p style={{ marginTop: '2rem', color: '#888888', fontSize: '0.9rem' }}>
        Этот калькулятор поможет вам оценить потенциальную прибыль от стейкинга криптовалют с учётом APY, срока инвестирования и комиссии валидатора.
        Вы можете выбрать криптовалюту, указать сумму стейка, предполагаемый APY, длительность, а также отредактировать цену токена вручную.
      </p>
    </div>
  );
};

export default StakingCalculator;
