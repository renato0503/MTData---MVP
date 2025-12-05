import React, { useState } from 'react';
import { MapPin, DollarSign, Star, CheckCircle, User, ArrowRight, Save, RotateCcw } from 'lucide-react';

interface CollectionFormProps {
  eventName: string;
  city: string;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ eventName, city }) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    origin: '',
    ageGroup: '',
    motivation: '',
    transportSpend: 0,
    foodSpend: 0,
    lodgingSpend: 0,
    rating: 0
  });

  const handleSelect = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Reset after success view
      setTimeout(() => {
        setSuccess(false);
        setStep(1);
        setFormData({
          origin: '',
          ageGroup: '',
          motivation: '',
          transportSpend: 0,
          foodSpend: 0,
          lodgingSpend: 0,
          rating: 0
        });
      }, 2500);
    }, 1000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-slate-800 rounded-2xl border border-emerald-500/30 p-8 text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Dados Salvos!</h2>
        <p className="text-slate-400 text-lg">Entrevista #3842 registrada com sucesso.</p>
        <p className="text-emerald-400 mt-4 text-sm font-semibold uppercase tracking-widest">Aguardando próxima coleta...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header do Coletor */}
      <div className="bg-slate-800 border-b border-slate-700 p-6 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            Coleta em Tempo Real
          </h2>
          <p className="text-slate-400 text-sm mt-1">{eventName} • {city}</p>
        </div>
        <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
          <span className="text-xs text-slate-500 uppercase font-bold">Pesquisador</span>
          <div className="text-slate-200 font-medium">Acadêmico UFMT</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 border-t-0 rounded-b-2xl p-6 md:p-8 shadow-2xl">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs font-semibold uppercase text-slate-500 tracking-wider">
            <span className={step >= 1 ? 'text-emerald-400' : ''}>1. Perfil</span>
            <span className={step >= 2 ? 'text-emerald-400' : ''}>2. Gastos</span>
            <span className={step >= 3 ? 'text-emerald-400' : ''}>3. Avaliação</span>
          </div>
        </div>

        {/* STEP 1: PERFIL */}
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="space-y-3">
              <label className="text-slate-300 font-semibold text-lg flex items-center gap-2">
                <MapPin className="text-emerald-500" /> Origem do Visitante
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Cuiabá/Várzea Grande', 'Interior MT', 'Outros Estados', 'Estrangeiro'].map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => handleSelect('origin', opt)}
                    className={`p-4 rounded-xl border text-left font-medium transition-all ${
                      formData.origin === opt 
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-slate-300 font-semibold text-lg flex items-center gap-2">
                <User className="text-blue-500" /> Faixa Etária
              </label>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {['18-24', '25-34', '35-44', '45-59', '60+'].map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => handleSelect('ageGroup', opt)}
                    className={`flex-1 py-3 px-4 rounded-lg border font-medium whitespace-nowrap transition-all ${
                      formData.ageGroup === opt 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

             <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.origin || !formData.ageGroup}
                className="flex items-center bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próximo <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GASTOS & MOTIVAÇÃO */}
        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="space-y-3">
              <label className="text-slate-300 font-semibold text-lg flex items-center gap-2">
                <CheckCircle className="text-purple-500" /> Motivação Principal
              </label>
              <select 
                value={formData.motivation}
                onChange={(e) => handleSelect('motivation', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">Selecione...</option>
                <option value="show">O Evento/Show (Exclusivo)</option>
                <option value="lazer">Turismo/Lazer Geral</option>
                <option value="amigos">Visita a Amigos/Parentes</option>
                <option value="negocios">Trabalho/Negócios</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-slate-300 font-semibold text-lg flex items-center gap-2">
                <DollarSign className="text-yellow-500" /> Estimativa de Gastos (R$)
              </label>
              
              {[
                { label: 'Transporte (Passagem/Combustível/App)', key: 'transportSpend' },
                { label: 'Alimentação & Bebidas', key: 'foodSpend' },
                { label: 'Hospedagem', key: 'lodgingSpend' }
              ].map((item) => (
                <div key={item.key} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>{item.label}</span>
                    <span className="text-yellow-400 font-mono font-bold">R$ {formData[item.key as keyof typeof formData]}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    step="50"
                    value={formData[item.key as keyof typeof formData]}
                    onChange={(e) => handleSelect(item.key, parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>R$ 0</span>
                    <span>R$ 1.000</span>
                    <span>R$ 2.000+</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-400 hover:text-white font-medium px-4"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Próximo <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AVALIAÇÃO FINAL */}
        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="text-center py-6">
              <label className="text-slate-300 font-semibold text-xl block mb-6">
                Como você avalia sua experiência até agora?
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleSelect('rating', star)}
                    className="group focus:outline-none transition-transform active:scale-90"
                  >
                    <Star 
                      className={`w-12 h-12 transition-colors ${
                        formData.rating >= star 
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' 
                          : 'text-slate-600 group-hover:text-slate-500'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              <p className="text-slate-500 mt-4 text-sm font-medium">
                {formData.rating === 1 && "Muito Insatisfeito"}
                {formData.rating === 2 && "Insatisfeito"}
                {formData.rating === 3 && "Neutro"}
                {formData.rating === 4 && "Satisfeito"}
                {formData.rating === 5 && "Muito Satisfeito!"}
                {!formData.rating && "Toque nas estrelas"}
              </p>
            </div>

            <div className="pt-6 flex justify-between items-center border-t border-slate-800">
               <button
                type="button"
                onClick={() => setStep(2)}
                className="text-slate-400 hover:text-white font-medium px-4"
              >
                Voltar
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || formData.rating === 0}
                className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-emerald-900/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Salvando...</>
                ) : (
                  <>
                    <Save className="mr-2 w-5 h-5" /> Finalizar Coleta
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Footer Dica */}
      <div className="mt-6 text-center">
        <p className="text-slate-500 text-xs flex items-center justify-center gap-2">
          <RotateCcw className="w-3 h-3" />
          Os dados são sincronizados automaticamente quando houver conexão.
        </p>
      </div>
    </div>
  );
};

export default CollectionForm;