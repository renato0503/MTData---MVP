import React, { useState, useEffect } from 'react';
import { Filter, Download, Sparkles, Info, ClipboardList, LayoutDashboard } from 'lucide-react';
import { KPIData, MotivationData, SpendData, LoadingState, EventProfile, OriginData } from './types';
import KPICard from './components/KPICard';
import ChartsSection from './components/ChartsSection';
import CollectionForm from './components/CollectionForm';
import { generateDashboardInsights } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

// --- MOCK DATABASE (DADOS REGIONALIZADOS MT) ---
const EVENT_DATABASE: Record<string, EventProfile> = {
  'guns-n-roses': {
    id: 'guns-n-roses',
    name: "Show Guns N' Roses - Arena Pantanal",
    city: 'Cuiabá',
    kpis: [
      { id: '1', label: 'Público Estimado', value: '32.500', change: 15.4, iconName: 'Users' },
      { id: '2', label: 'Gasto Médio Turista', value: 'R$ 1.450,00', change: 22.1, iconName: 'DollarSign' },
      { id: '3', label: '% Turistas de Fora', value: '42%', change: 12.5, iconName: 'MapPin' },
    ],
    motivations: [
      { reason: 'Show Exclusivo', percentage: 85 },
      { reason: 'Turismo/Lazer', percentage: 10 },
      { reason: 'Visita a Amigos', percentage: 5 },
    ],
    spending: [
      { category: 'Ingressos', amount: 650 },
      { category: 'Hospedagem', amount: 400 },
      { category: 'Alimentação', amount: 250 },
      { category: 'Transporte', amount: 150 },
    ],
    origins: [
      { state: 'Mato Grosso (Interior)', participants: 12500, avgSpend: 850, stayDays: 2.0 },
      { state: 'São Paulo', participants: 4200, avgSpend: 2100, stayDays: 3.5 },
      { state: 'Goiás', participants: 3100, avgSpend: 1200, stayDays: 2.5 },
      { state: 'Mato Grosso do Sul', participants: 2800, avgSpend: 1100, stayDays: 2.0 },
    ],
    analysis: {
        context: "Megaevento internacional realizado na Arena Pantanal, consolidando Cuiabá na rota de grandes turnês mundiais. O evento mobilizou infraestrutura de grande porte e atraiu um fluxo intenso de fãs de estados vizinhos.",
        financialImpact: "Alta ocupação hoteleira e impacto significativo no setor de serviços e transporte. O ticket médio elevado reflete um público com maior poder aquisitivo e disposição para gastos extras em turismo de experiência.",
        socialImpact: "Forte projeção da marca da cidade e geração massiva de empregos temporários na operação. O evento promoveu um senso de pertencimento e orgulho local ao receber uma atração de nível global."
    }
  },
  'stock-car': {
    id: 'stock-car',
    name: "Stock Car Pro Series",
    city: 'Cuiabá',
    kpis: [
      { id: '1', label: 'Público Circulante', value: '18.000', change: 5.2, iconName: 'Users' },
      { id: '2', label: 'Gasto Médio Turista', value: 'R$ 1.100,00', change: 3.8, iconName: 'DollarSign' },
      { id: '3', label: '% Corporativo/VIP', value: '28%', change: 8.4, iconName: 'MapPin' },
    ],
    motivations: [
      { reason: 'Evento Esportivo', percentage: 60 },
      { reason: 'Networking/Corporativo', percentage: 30 },
      { reason: 'Lazer', percentage: 10 },
    ],
    spending: [
      { category: 'Hospedagem', amount: 500 },
      { category: 'Alimentação', amount: 350 },
      { category: 'Transporte Local', amount: 150 },
      { category: 'Ingressos', amount: 100 },
    ],
    origins: [
      { state: 'Mato Grosso (Capital)', participants: 10000, avgSpend: 300, stayDays: 1.0 },
      { state: 'Paraná', participants: 1500, avgSpend: 1800, stayDays: 4.0 },
      { state: 'São Paulo', participants: 1200, avgSpend: 2200, stayDays: 3.0 },
      { state: 'Distrito Federal', participants: 800, avgSpend: 1500, stayDays: 2.5 },
    ],
    analysis: {
        context: "Etapa do maior campeonato de automobilismo da América Latina. O evento se destaca não apenas pela competição, mas pelo forte componente de relacionamento B2B e ativação de marcas.",
        financialImpact: "Movimentação financeira concentrada em hospitalidade de alto padrão e serviços corporativos. A presença de equipes, patrocinadores e imprensa gera uma demanda qualificada por hotelaria executiva.",
        socialImpact: "Estímulo ao turismo esportivo e visibilidade midiática nacional para Cuiabá. O evento fomenta a cultura automobilística local e envolve diversos prestadores de serviço especializados."
    }
  },
  'natanzinho': {
    id: 'natanzinho',
    name: "Show Natanzinho",
    city: 'Várzea Grande',
    kpis: [
      { id: '1', label: 'Público Total', value: '12.000', change: -2.1, iconName: 'Users' },
      { id: '2', label: 'Gasto Médio', value: 'R$ 450,00', change: -5.5, iconName: 'DollarSign' },
      { id: '3', label: '% Público Local', value: '85%', change: 4.2, iconName: 'MapPin' },
    ],
    motivations: [
      { reason: 'Fã do Artista', percentage: 70 },
      { reason: 'Diversão com Amigos', percentage: 25 },
      { reason: 'Outros', percentage: 5 },
    ],
    spending: [
      { category: 'Bebidas/Bar', amount: 200 },
      { category: 'Ingresso', amount: 120 },
      { category: 'Alimentação', amount: 80 },
      { category: 'Transporte App', amount: 50 },
    ],
    origins: [
      { state: 'Várzea Grande', participants: 6000, avgSpend: 250, stayDays: 1.0 },
      { state: 'Cuiabá', participants: 4500, avgSpend: 300, stayDays: 1.0 },
      { state: 'MT (Baixada Cuiabana)', participants: 1500, avgSpend: 500, stayDays: 1.5 },
      { state: 'Outros', participants: 0, avgSpend: 0, stayDays: 0 },
    ],
    analysis: {
        context: "Evento de grande apelo popular realizado em Várzea Grande, focando no público jovem e na cultura musical do momento (piseiro/forró). Caracterizado por alta densidade de público local.",
        financialImpact: "Impacto financeiro pulverizado no comércio local informal, bebidas e transporte por aplicativo. Embora o ticket médio seja menor, o volume de transações rápidas é alto, aquecendo a economia noturna.",
        socialImpact: "Importante opção de lazer e entretenimento acessível para a juventude da Baixada Cuiabana. Reforça a identidade cultural regional e promove a interação social intensa na comunidade."
    }
  },
  'gustavo-lima': {
    id: 'gustavo-lima',
    name: "Buteco do Gustavo Lima",
    city: 'Cuiabá',
    kpis: [
      { id: '1', label: 'Público Total', value: '25.000', change: 10.0, iconName: 'Users' },
      { id: '2', label: 'Gasto Médio', value: 'R$ 780,00', change: 4.1, iconName: 'DollarSign' },
      { id: '3', label: '% Interior MT', value: '45%', change: 15.2, iconName: 'MapPin' },
    ],
    motivations: [
      { reason: 'Show Sertanejo', percentage: 80 },
      { reason: 'Encontro Social', percentage: 15 },
      { reason: 'Negócios (Agro)', percentage: 5 },
    ],
    spending: [
      { category: 'Consumo Evento', amount: 350 },
      { category: 'Ingresso/Camarote', amount: 250 },
      { category: 'Hospedagem', amount: 100 },
      { category: 'Transporte', amount: 80 },
    ],
    origins: [
      { state: 'Cuiabá', participants: 10000, avgSpend: 400, stayDays: 1.0 },
      { state: 'Sorriso/Sinop', participants: 5000, avgSpend: 1200, stayDays: 2.0 },
      { state: 'Rondonópolis', participants: 4000, avgSpend: 900, stayDays: 1.5 },
      { state: 'Primavera do Leste', participants: 2500, avgSpend: 1000, stayDays: 2.0 },
    ],
    analysis: {
        context: "Festival de música sertaneja de grande proporção, atraindo caravanas de todo o interior do estado. O evento serve como ponto de encontro social e networking informal para o setor do agronegócio.",
        financialImpact: "Elevada injeção de recursos devido ao perfil de consumo ostentação nos camarotes e áreas VIP. Gera demanda significativa por vestuário, beleza e hospedagem para o público vindo do interior.",
        socialImpact: "Fortalecimento da cultura sertaneja como identidade estadual. O evento atua como um catalisador de integração entre a capital e os polos produtivos do interior de Mato Grosso."
    }
  },
  'cuiaba-flamengo': {
    id: 'cuiaba-flamengo',
    name: "Cuiabá EC x Flamengo (Brasileirão)",
    city: 'Cuiabá',
    kpis: [
      { id: '1', label: 'Público Pagante', value: '41.200', change: 35.0, iconName: 'Users' },
      { id: '2', label: 'Ticket Médio', value: 'R$ 320,00', change: -10.5, iconName: 'DollarSign' },
      { id: '3', label: '% Torcida Visitante', value: '35%', change: 20.0, iconName: 'MapPin' },
    ],
    motivations: [
      { reason: 'Paixão pelo Time', percentage: 90 },
      { reason: 'Lazer em Família', percentage: 8 },
      { reason: 'Conhecer a Arena', percentage: 2 },
    ],
    spending: [
      { category: 'Ingresso', amount: 150 },
      { category: 'Alimentação/Bebida', amount: 100 },
      { category: 'Transporte', amount: 40 },
      { category: 'Souvenirs/Camisas', amount: 30 },
    ],
    origins: [
      { state: 'Mato Grosso', participants: 35000, avgSpend: 200, stayDays: 1.0 },
      { state: 'Rio de Janeiro', participants: 2000, avgSpend: 1800, stayDays: 3.0 },
      { state: 'Rondônia/Acre', participants: 1500, avgSpend: 900, stayDays: 2.0 },
      { state: 'Outros Estados', participants: 2700, avgSpend: 1100, stayDays: 2.5 },
    ],
    analysis: {
        context: "Partida de alta demanda do Campeonato Brasileiro. A presença de um time de massa como o Flamengo mobiliza não apenas a torcida local, mas atrai fãs de estados vizinhos que não possuem times na Série A.",
        financialImpact: "Receita recorde de bilheteria e ocupação máxima da Arena Pantanal. O consumo é focado na experiência do dia do jogo (bares, ambulantes, transporte), com pico de vendas de artigos esportivos.",
        socialImpact: "Promoção do esporte e uso social da Arena Pantanal. O evento gera um ambiente de integração familiar e paixão nacional, embora exija grande operação de segurança e logística urbana."
    }
  },
  'festival-inverno': {
    id: 'festival-inverno',
    name: "Festival de Inverno",
    city: 'Chapada dos Guimarães',
    kpis: [
      { id: '1', label: 'Fluxo Turístico', value: '65.000', change: 5.0, iconName: 'Users' },
      { id: '2', label: 'Gasto Médio/Dia', value: 'R$ 550,00', change: 12.0, iconName: 'DollarSign' },
      { id: '3', label: 'Ocupação Hoteleira', value: '98%', change: 2.0, iconName: 'MapPin' },
    ],
    motivations: [
      { reason: 'Shows Nacionais', percentage: 50 },
      { reason: 'Clima/Natureza', percentage: 30 },
      { reason: 'Gastronomia', percentage: 20 },
    ],
    spending: [
      { category: 'Hospedagem (Pousadas/Casas)', amount: 250 },
      { category: 'Alimentação', amount: 150 },
      { category: 'Passeios', amount: 100 },
      { category: 'Artesanato/Compras', amount: 50 },
    ],
    origins: [
      { state: 'Cuiabá/Várzea Grande', participants: 45000, avgSpend: 300, stayDays: 1.5 },
      { state: 'Interior MT', participants: 10000, avgSpend: 800, stayDays: 2.5 },
      { state: 'Outros Estados', participants: 5000, avgSpend: 1500, stayDays: 4.0 },
      { state: 'Estrangeiros', participants: 100, avgSpend: 2500, stayDays: 5.0 },
    ],
    analysis: {
        context: "Principal evento turístico de inverno do estado, unindo atrações musicais nacionais, gastronomia e o cenário natural de Chapada dos Guimarães. Atrai um público diversificado em busca de experiência completa.",
        financialImpact: "Impacto profundo na economia local da cidade-sede, sustentando pousadas, restaurantes e comércio de artesanato por semanas. A alta permanência gera um ciclo virtuoso de consumo descentralizado.",
        socialImpact: "Valorização do patrimônio natural e cultural de Chapada. O festival democratiza o acesso à cultura com shows gratuitos e fomenta a consciência ambiental, apesar dos desafios de infraestrutura urbana."
    }
  }
};

const App: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string>('guns-n-roses');
  const [data, setData] = useState<EventProfile>(EVENT_DATABASE['guns-n-roses']);
  const [viewMode, setViewMode] = useState<'dashboard' | 'collection'>('dashboard');

  const [aiInsights, setAiInsights] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<LoadingState>(LoadingState.IDLE);

  // Update dashboard data when selection changes
  useEffect(() => {
    setData(EVENT_DATABASE[selectedEventId]);
    setAiInsights(''); // Clear previous insights
    setAiLoading(LoadingState.IDLE);
  }, [selectedEventId]);

  const handleExport = () => {
    alert(`Simulação: Exportando relatório PDF completo para: ${data.name.toUpperCase()}`);
  };

  const handleGenerateInsights = async () => {
    if (!process.env.API_KEY) {
        alert("API Key not configured in environment.");
        return;
    }
    setAiLoading(LoadingState.LOADING);
    const insights = await generateDashboardInsights(data.kpis, data.motivations, data.spending, data.name);
    setAiInsights(insights);
    setAiLoading(LoadingState.SUCCESS);
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-900 text-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div>
              {/* LOGO REPLACEMENT */}
              <img 
                src="/logo.png" 
                alt="MTData Intelligence" 
                className="h-16 w-auto object-contain cursor-pointer"
                onClick={() => setViewMode('dashboard')}
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = document.getElementById('logo-fallback');
                    if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <div id="logo-fallback" className="hidden cursor-pointer" onClick={() => setViewMode('dashboard')}>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    MTData
                  </h1>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                    Intelligence • Eventos Mato Grosso
                  </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              {/* View Switcher */}
              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button
                    onClick={() => setViewMode('dashboard')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'dashboard' 
                        ? 'bg-slate-700 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                </button>
                <button
                    onClick={() => setViewMode('collection')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'collection' 
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Coletar Dados
                </button>
              </div>

              {viewMode === 'dashboard' && (
                <button 
                    onClick={handleExport}
                    className="hidden sm:flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                </button>
              )}
              
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-lg ring-2 ring-slate-900 ml-2">
                MT
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* RENDERIZAÇÃO CONDICIONAL: DASHBOARD OU COLETA */}
        {viewMode === 'dashboard' ? (
            <>
                {/* FILTERS BAR */}
                <section className="bg-slate-800 rounded-xl p-4 mb-6 shadow-sm border border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <Filter className="w-5 h-5 text-emerald-500" />
                    <span>Selecione o Evento para Análise:</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-2/3">
                    <select 
                    className="bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    >
                    <option value="guns-n-roses">Show Guns N' Roses (Arena Pantanal)</option>
                    <option value="cuiaba-flamengo">Cuiabá EC x Flamengo (Série A)</option>
                    <option value="gustavo-lima">Buteco Gustavo Lima (Expoagro)</option>
                    <option value="festival-inverno">Festival de Inverno (Chapada)</option>
                    <option value="stock-car">Stock Car Pro Series</option>
                    <option value="natanzinho">Show Natanzinho (VG)</option>
                    </select>

                    <div className="flex items-center px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-400 text-sm">
                        <span className="mr-2 text-emerald-500 font-semibold">Local:</span>
                        {data.city}
                    </div>
                </div>
                </section>

                {/* CONTEXT CARD */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-md font-bold text-slate-100 mb-1">Contexto do Evento</h3>
                            <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
                                {data.analysis.context}
                            </p>
                        </div>
                    </div>
                </div>

                {/* AI INSIGHTS TRIGGER */}
                <div className="flex justify-end mb-6">
                <button 
                    onClick={handleGenerateInsights}
                    disabled={aiLoading === LoadingState.LOADING}
                    className={`
                        flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg
                        ${aiLoading === LoadingState.LOADING 
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'}
                    `}
                    >
                    <Sparkles className={`w-4 h-4 mr-2 ${aiLoading === LoadingState.LOADING ? 'animate-spin' : ''}`} />
                    {aiLoading === LoadingState.LOADING ? 'Processando...' : `Gerar Análise IA: ${data.name}`}
                    </button>
                </div>

                {/* AI INSIGHTS RESULT */}
                {aiInsights && (
                <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center mb-4">
                        <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
                        <h3 className="text-lg font-bold text-slate-100">Insights Estratégicos (Gemini 2.5)</h3>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                        <ReactMarkdown>{aiInsights}</ReactMarkdown>
                    </div>
                </div>
                )}

                {/* KPIs GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {data.kpis.map((kpi) => (
                    <KPICard key={kpi.id} data={kpi} />
                ))}
                </div>

                {/* CHARTS WITH ANALYSIS */}
                <ChartsSection 
                    motivationData={data.motivations} 
                    spendData={data.spending} 
                    socialAnalysis={data.analysis.socialImpact}
                    financialAnalysis={data.analysis.financialImpact}
                />

                {/* TABLE SECTION */}
                <section className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden mb-12">
                <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-100">Fluxo por Origem e Permanência</h3>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Dados consolidados</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-slate-300 uppercase bg-slate-900/50">
                        <tr>
                        <th scope="col" className="px-6 py-3">Origem Principal</th>
                        <th scope="col" className="px-6 py-3">Participantes Est.</th>
                        <th scope="col" className="px-6 py-3">Gasto Médio (Total)</th>
                        <th scope="col" className="px-6 py-3">Permanência Média</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.origins.map((origin, idx) => (
                        <tr key={idx} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-100">{origin.state}</td>
                            <td className="px-6 py-4">{origin.participants.toLocaleString('pt-BR')}</td>
                            <td className="px-6 py-4">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(origin.avgSpend)}
                            </td>
                            <td className="px-6 py-4">
                            <div className="flex items-center">
                                <span className="w-16 bg-slate-700 rounded-full h-1.5 mr-2">
                                <span className="bg-emerald-500 h-1.5 rounded-full block" style={{width: `${(origin.stayDays / 7) * 100}%`}}></span>
                                </span>
                                {origin.stayDays.toFixed(1)} dias
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </section>
            </>
        ) : (
            // --- MODO COLETA ---
            <div className="animate-in fade-in duration-300">
                 {/* Seletor Rápido de Evento para o Coletor */}
                 <div className="mb-6 flex justify-center">
                     <select 
                        className="bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 max-w-sm"
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                    >
                        <option value="guns-n-roses">Show Guns N' Roses</option>
                        <option value="cuiaba-flamengo">Cuiabá x Flamengo</option>
                        <option value="gustavo-lima">Buteco Gustavo Lima</option>
                        <option value="festival-inverno">Festival de Inverno</option>
                        <option value="stock-car">Stock Car</option>
                        <option value="natanzinho">Show Natanzinho</option>
                    </select>
                 </div>
                 
                 <CollectionForm eventName={data.name} city={data.city} />
            </div>
        )}

      </main>

      <footer className="max-w-7xl mx-auto px-6 mt-12 text-center text-slate-500 text-sm">
        <p>© 2024 MTData Intelligence. Todos os direitos reservados.</p>
        <p className="mt-1 text-xs">Simulação de Dashboard para Análise de Turismo em Eventos (Mato Grosso).</p>
      </footer>
    </div>
  );
};

export default App;