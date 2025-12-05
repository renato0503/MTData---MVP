export interface KPIData {
  id: string;
  label: string;
  value: string | number;
  change: number; // Percentage change (positive or negative)
  iconName: 'Users' | 'DollarSign' | 'MapPin';
}

export interface MotivationData {
  reason: string;
  percentage: number;
}

export interface SpendData {
  category: string;
  amount: number;
}

export interface OriginData {
  state: string;
  participants: number;
  avgSpend: number;
  stayDays: number;
}

export interface EventProfile {
  id: string;
  name: string;
  city: string;
  kpis: KPIData[];
  motivations: MotivationData[];
  spending: SpendData[];
  origins: OriginData[];
}

export interface DashboardState {
  event: string;
  city: string;
  period: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}