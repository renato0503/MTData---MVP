import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { MotivationData, SpendData } from '../types';
import { TrendingUp, Users } from 'lucide-react';

interface ChartsSectionProps {
  motivationData: MotivationData[];
  spendData: SpendData[];
  socialAnalysis: string;
  financialAnalysis: string;
}

const COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#fbbf24'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl">
        <p className="text-slate-200 font-semibold">{`${label || payload[0].name} : ${payload[0].value}${typeof payload[0].value === 'number' && payload[0].value > 100 ? '' : '%'}`}</p>
      </div>
    );
  }
  return null;
};

const ChartsSection: React.FC<ChartsSectionProps> = ({ motivationData, spendData, socialAnalysis, financialAnalysis }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Chart 1: Motivation & Social Analysis */}
      <div className="flex flex-col h-full bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-slate-100 mb-6 flex items-center">
          <span className="w-1 h-6 bg-emerald-500 rounded mr-3"></span>
          Motivação Principal da Viagem
        </h4>
        <div className="h-64 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={motivationData}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis 
                type="category" 
                dataKey="reason" 
                stroke="#f8fafc" 
                width={120} 
                tick={{fontSize: 12}}
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#334155', opacity: 0.4}} />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                {motivationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-700">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-900/50 rounded-lg">
                    <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                    <h5 className="text-sm font-semibold text-slate-200 mb-1">Impacto Social & Comportamental</h5>
                    <p className="text-sm text-slate-400 leading-relaxed">{socialAnalysis}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Chart 2: Spend Distribution & Financial Analysis */}
      <div className="flex flex-col h-full bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-slate-100 mb-6 flex items-center">
          <span className="w-1 h-6 bg-blue-500 rounded mr-3"></span>
          Distribuição de Gastos (R$)
        </h4>
        <div className="h-64 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="amount"
                nameKey="category"
              >
                {spendData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="middle" 
                align="right" 
                layout="vertical"
                wrapperStyle={{ color: '#94a3b8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-700">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-900/50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                    <h5 className="text-sm font-semibold text-slate-200 mb-1">Impacto Financeiro Direto</h5>
                    <p className="text-sm text-slate-400 leading-relaxed">{financialAnalysis}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;