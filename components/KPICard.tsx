import React from 'react';
import { Users, DollarSign, MapPin, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { KPIData } from '../types';

interface KPICardProps {
  data: KPIData;
}

const KPICard: React.FC<KPICardProps> = ({ data }) => {
  const getIcon = () => {
    switch (data.iconName) {
      case 'Users': return <Users className="w-6 h-6 text-emerald-400" />;
      case 'DollarSign': return <DollarSign className="w-6 h-6 text-blue-400" />;
      case 'MapPin': return <MapPin className="w-6 h-6 text-purple-400" />;
      default: return <Users className="w-6 h-6 text-gray-400" />;
    }
  };

  const isPositive = data.change >= 0;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg transition-transform hover:scale-[1.02] duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
          {getIcon()}
        </div>
        <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {Math.abs(data.change)}% vs. anterior
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{data.label}</p>
        <h3 className="text-3xl font-bold text-slate-100 mt-1">{data.value}</h3>
      </div>
    </div>
  );
};

export default KPICard;