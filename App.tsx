
import React, { useState, useMemo, useEffect } from 'react';
import Logo from './components/Logo';
import SliderInput from './components/SliderInput';
import WealthChart from './components/WealthChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { CalculationResult, AIAdvice } from './types';
import { getFinancialAdvice } from './services/geminiService';

type Frequency = 'Daily' | 'Monthly' | 'Quarterly' | 'Lump Sum';

const App: React.FC = () => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(5000);
  const [frequency, setFrequency] = useState<Frequency>('Daily');
  const [rateOfInterest, setRateOfInterest] = useState<number>(12);
  const [tenure, setTenure] = useState<number>(10);
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);

  const results: CalculationResult = useMemo(() => {
    const P = investmentAmount;
    const r = rateOfInterest / 100;
    const t = tenure;

    let totalValue = 0;
    let investedAmount = 0;
    const yearlyData = [];

    if (frequency === 'Lump Sum') {
      investedAmount = P;
      totalValue = P * Math.pow(1 + r, t);
      
      for (let year = 1; year <= t; year++) {
        yearlyData.push({
          year: year,
          invested: P,
          total: Math.round(P * Math.pow(1 + r, year)),
        });
      }
    } else {
      let f = 12; // periods per year
      if (frequency === 'Daily') f = 365;
      if (frequency === 'Quarterly') f = 4;
      
      const i = r / f;
      const n = t * f;

      // FV = P * [ ((1+i)^n - 1) / i ] * (1+i)
      totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      investedAmount = P * n;

      for (let year = 1; year <= t; year++) {
        const periods = year * f;
        const currentTotal = P * ((Math.pow(1 + i, periods) - 1) / i) * (1 + i);
        yearlyData.push({
          year: year,
          invested: P * periods,
          total: Math.round(currentTotal),
        });
      }
    }

    return {
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(totalValue - investedAmount),
      totalValue: Math.round(totalValue),
      yearlyData
    };
  }, [investmentAmount, frequency, rateOfInterest, tenure]);

  const pieData = [
    { name: 'Invested', value: results.investedAmount, color: '#d946ef' },
    { name