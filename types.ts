
export interface CalculationResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  yearlyData: ChartDataPoint[];
}

export interface ChartDataPoint {
  year: number;
  invested: number;
  total: number;
}

export interface AIAdvice {
  summary: string;
  milestones: string[];
  tips: string[];
}
