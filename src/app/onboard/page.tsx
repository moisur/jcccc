"use client"
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { OnboardingData, INITIAL_DATA, StepType } from './types';
import { Sparkles, Compass, Lightbulb, ArrowRight, CheckCircle, Brain, ChevronRight, ChevronDown, Gem, Target, User, Briefcase, DollarSign, Loader } from '@/components/Icons';
import { analyzeProfile } from '@/lib/geminiService';
import Markdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Styles & Animation Helpers ---

// Ajout de styles globaux pour l'animation de chargement
const globalStyles = `
  @keyframes scan {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-gradient-text {
    background: linear-gradient(90deg, #9333ea, #ec4899, #9333ea);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: scan 3s linear infinite;
  }
`;

const glassPanel = "bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";
const inputWrapperStyle = "relative group transition-all duration-300";
const inputStyle = "w-full bg-white/60 border border-gray-200 rounded-xl px-4 py-4 text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 focus:bg-white transition-all outline-none font-sans text-base placeholder-gray-400 group-hover:border-gray-300";
const labelStyle = "block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2 ml-1";

// --- Shared UI Components ---

const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-40 mt-[var(--header-height,0px)]">
      <div 
        className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 transition-all duration-700 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const TextArea = ({ label, value, onChange, placeholder, rows = 3, helpText }: any) => (
  <div className="mb-8 animate-fade-in-up">
    <label className={labelStyle}>{label}</label>
    <div className={inputWrapperStyle}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputStyle} resize-none`}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
    {helpText && <p className="text-xs text-gray-400 mt-2 font-medium ml-1 flex items-center gap-1"><Lightbulb className="w-3 h-3"/> {helpText}</p>}
  </div>
);

const Input = ({ label, value, onChange, placeholder, type = "text", icon: Icon }: any) => (
  <div className="mb-5 animate-fade-in-up w-full">
    <label className={labelStyle}>{label}</label>
    <div className={`${inputWrapperStyle} flex items-center`}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputStyle} ${Icon ? 'pl-11' : ''}`}
        placeholder={placeholder}
      />
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
      )}
    </div>
  </div>
);

const Card = ({ children, className = "" }: { children?: ReactNode, className?: string }) => (
  <div className={`${glassPanel} rounded-3xl p-8 md:p-10 transition-all duration-500 ${className}`}>
    {children}
  </div>
);

// --- Phases ---

const WelcomePhase = ({ data, updateData, next }: any) => {
  // On dérive le prénom pour l'affichage si besoin, mais on stocke tout
  // Note: Assure-toi que ton type OnboardingData contient ces champs ou utilise un Record<string, any>
  
  return (
  <div className="max-w-5xl mx-auto py-6 lg:py-12 animate-fade-in">
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center px-4 py-2 mb-6 rounded-full bg-purple-50 border border-purple-100">
        <Sparkles className="text-purple-600 w-4 h-4 mr-2" />
        <span className="text-xs font-bold text-purple-900 tracking-widest uppercase">Le Catalyseur de Clarté</span>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6 leading-tight tracking-tight">
        L'excellence ne demande pas de choisir,<br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">elle demande de s'aligner</span>.
      </h1>
      
      <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
        Entrez vos informations pour débuter votre profilage stratégique.
      </p>
    </div>
    
    <Card className="max-w-3xl mx-auto transform hover:shadow-2xl hover:shadow-purple-500/5 duration-500">
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-2">
        {/* Identité */}
        <Input 
          label="Prénom" 
          placeholder="ex: Camille" 
          value={data.firstName || ''} 
          onChange={(v: string) => updateData('firstName', v)}
          icon={User}
        />
        <Input 
          label="Nom" 
          placeholder="ex: Dupont" 
          value={data.lastName || ''} 
          onChange={(v: string) => updateData('lastName', v)} 
        />
        
        {/* Pro */}
        <Input 
          label="Âge" 
          type="number"
          placeholder="ex: 34" 
          value={data.age || ''} 
          onChange={(v: string) => updateData('age', v)} 
        />
        <Input 
          label="Poste / Rôle Actuel" 
          placeholder="ex: CEO, Freelance, Manager..." 
          value={data.currentPosition || ''} 
          onChange={(v: string) => updateData('currentPosition', v)}
          icon={Briefcase}
        />

        {/* Business */}
        <div className="md:col-span-2 grid md:grid-cols-2 gap-x-6">
           <Input 
            label="Chiffre d'Affaires / Revenus (Annuel)" 
            placeholder="ex: 80k€" 
            value={data.revenue || ''} 
            onChange={(v: string) => updateData('revenue', v)} 
            icon={DollarSign}
          />
           <Input 
            label="Email Professionnel" 
            type="email"
            placeholder="camille@company.com" 
            value={data.email} 
            onChange={(v: string) => updateData('email', v)} 
          />
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center">
        <button 
          onClick={() => {
            // Petit hack pour garder la compatibilité si le type n'est pas mis à jour
            updateData('clientName', data.firstName); 
            next();
          }}
          disabled={!data.firstName || !data.email}
          className="w-full md:w-auto min-w-[300px] bg-gray-900 hover:bg-black text-white font-medium py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Lancer l'analyse
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-xs text-gray-400 mt-4 text-center">
          100% Confidentiel. Vos données ne seront jamais partagées.
        </p>
      </div>
    </Card>
  </div>
  );
};

const DiagnosisPhase = ({ data, updateData }: any) => (
  <div className="animate-slide-up max-w-5xl mx-auto">
    <div className="mb-12 text-center">
      <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4">Diagnostic Initial</h2>
      <p className="text-gray-500">Identifions les points de friction pour libérer votre élan.</p>
    </div>

    <div className="grid md:grid-cols-12 gap-8">
      <div className="md:col-span-7 space-y-2">
        <Card>
          <TextArea 
            label="Le Blocage Principal" 
            placeholder="Décrivez ce qui vous empêche d'avancer aujourd'hui..."
            value={data.mainStruggle}
            onChange={(v: string) => updateData('mainStruggle', v)}
            rows={5}
          />
          <div className="h-4"></div>
          <TextArea 
            label="L'Élément Déclencheur" 
            helpText="Pourquoi est-ce urgent de régler ça maintenant ?"
            placeholder="Un événement récent, une prise de conscience..."
            value={data.triggerEvent}
            onChange={(v: string) => updateData('triggerEvent', v)}
            rows={3}
          />
        </Card>
      </div>

      <div className="md:col-span-5 space-y-6">
        <div className="bg-purple-50/50 p-8 rounded-3xl border border-purple-100 h-full flex flex-col justify-center">
          <h4 className="font-serif text-xl text-purple-900 mb-6 flex items-center gap-3">
            <Brain className="text-purple-600 w-6 h-6"/> Signaux d'alerte
          </h4>
          <ul className="space-y-4 mb-8">
            {["Dispersion constante", "Fatigue décisionnelle", "Projets inachevés", "Syndrome de l'imposteur"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-purple-900/70 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                {item}
              </li>
            ))}
          </ul>
           <h4 className="font-serif text-xl text-green-800 mb-6 flex items-center gap-3">
            <Target className="text-green-600 w-6 h-6"/> Ce que vous visez
          </h4>
           <ul className="space-y-4">
             {["Focus Stratégique", "Clarté Mentale", "Exécution Rapide"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-green-900/70 text-sm font-medium">
                <CheckCircle className="w-4 h-4 text-green-500"/>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const DeepDivePhase = ({ data, updateData }: any) => {
   const levels = [
    { key: 'level1', label: 'Surface', q: "Pourquoi est-ce un problème pour vous aujourd'hui ?" },
    { key: 'level2', label: 'Impact Pro', q: "Quel est l'impact concret sur votre carrière/business ?" },
    { key: 'level3', label: 'Douleur', q: "Si rien ne change dans 6 mois, que se passera-t-il ?" },
    { key: 'level4', label: 'Impact Perso', q: "Comment cela affecte-t-il votre vie personnelle ?" },
    { key: 'level5', label: 'Opportunité', q: "Une fois résolu, que pourrez-vous enfin accomplir ?" },
    { key: 'level6', label: 'Émotion', q: "Pourquoi est-ce vital émotionnellement ?" },
    { key: 'level7', label: 'Vérité', q: "Quel est le but ultime (Liberté, Paix, Reconnaissance) ?" },
  ];

  const [activeLevel, setActiveLevel] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateWhy = (key: string, val: string) => {
    updateData('whys', { ...data.whys, [key]: val });
  };

  const handleNext = (idx: number) => {
    if (idx < levels.length - 1) {
      setActiveLevel(idx + 1);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  return (
    <div className="animate-slide-up max-w-4xl mx-auto pb-20">
      <div className="mb-10 text-center">
         <span className="text-purple-600 font-bold tracking-widest text-[10px] uppercase mb-3 block border border-purple-200 rounded-full py-1 px-3 w-fit mx-auto bg-purple-50">Méthode Deep Dive</span>
         <h3 className="font-serif text-3xl text-gray-800">Exploration en Profondeur</h3>
      </div>

      <div className="space-y-8 relative pl-4 md:pl-0">
        <div className="absolute left-8 md:left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-purple-200 to-transparent -z-10"></div>

        {levels.map((level, idx) => {
          const isActive = activeLevel === idx;
          const isCompleted = idx < activeLevel;
          const hasContent = data.whys[level.key]?.length > 0;

          if (idx > activeLevel) return null;

          return (
            <div 
              key={level.key} 
              className={`transition-all duration-700 ease-out ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-80'}`}
              ref={isActive ? scrollRef : null}
            >
              <div className="flex gap-6 md:gap-8">
                
                <div className="flex flex-col items-center pt-2">
                   <div 
                     onClick={() => isCompleted && setActiveLevel(idx)}
                     className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-all cursor-pointer z-10
                       ${isActive ? 'bg-gray-900 border-gray-900 text-white shadow-purple-500/30' : 
                         isCompleted ? 'bg-white border-green-400 text-green-500 scale-90' : 'bg-white border-gray-200 text-gray-300'}
                     `}
                   >
                     {isCompleted ? <CheckCircle className="w-6 h-6" /> : <span className="text-lg font-serif">{idx + 1}</span>}
                   </div>
                </div>

                <div className="flex-1">
                  {isCompleted ? (
                    <div 
                      onClick={() => setActiveLevel(idx)}
                      className="cursor-pointer group py-4 pr-4 border-b border-gray-100 hover:border-purple-200 transition-colors"
                    >
                      <h4 className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">{level.label}</h4>
                      <p className="text-gray-600 font-serif italic opacity-80 group-hover:opacity-100 pl-4 border-l-2 border-transparent group-hover:border-purple-300 transition-all">
                        "{data.whys[level.key]}"
                      </p>
                    </div>
                  ) : (
                    <div className={`${glassPanel} rounded-2xl rounded-tl-none p-6 md:p-8 animate-fade-in-up ring-1 ring-gray-900/5`}>
                      <span className="text-[10px] uppercase tracking-widest text-purple-600 font-bold mb-3 block opacity-80">{level.label}</span>
                      <h4 className="font-serif text-xl md:text-2xl text-gray-800 mb-6 leading-tight">
                        {level.q}
                      </h4>
                      <div className="relative">
                        <textarea
                            autoFocus
                            value={data.whys[level.key]}
                            onChange={(e) => updateWhy(level.key, e.target.value)}
                            className="w-full bg-gray-50/50 border-b-2 border-gray-200 focus:border-purple-600 p-4 outline-none min-h-[120px] resize-none font-sans text-lg text-gray-700 placeholder-gray-300 transition-colors rounded-t-lg"
                            placeholder="Prenez le temps de réfléchir..."
                        />
                         <div className="absolute bottom-2 right-2 text-xs text-gray-300 pointer-events-none">Shift + Enter pour sauter une ligne</div>
                      </div>
                     
                      {idx < levels.length - 1 && (
                        <div className="flex justify-end mt-6">
                          <button 
                            onClick={() => handleNext(idx)}
                            disabled={!hasContent}
                            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                          >
                            Continuer <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OfferPhase = ({ data, updateData }: any) => {
  return (
    <div className="animate-slide-up max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif text-gray-900 mb-6">L'Investissement</h2>
        <p className="text-gray-500 max-w-xl mx-auto">
            Le vrai coût n'est pas ce que vous dépensez, mais ce que vous perdez chaque jour à ne pas être aligné.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100 text-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
           <h4 className="text-red-400 font-bold uppercase text-[10px] tracking-widest mb-6">Le coût de l'inaction (1 an)</h4>
           <div className="space-y-2">
             <p className="text-sm">Essais & Erreurs</p>
             <p className="text-4xl font-serif text-gray-800">12 mois</p>
             <p className="text-red-500 font-medium text-sm">Perdus à jamais</p>
           </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl shadow-purple-900/10 text-center transform scale-105 ring-1 ring-purple-50">
           <h4 className="text-purple-600 font-bold uppercase text-[10px] tracking-widest mb-6">Avec Accompagnement</h4>
           <div className="space-y-2">
             <p className="text-sm text-gray-500">Accélération</p>
             <p className="text-4xl font-serif text-gray-900">30 Jours</p>
             <p className="text-green-500 font-medium text-sm">Pour une clarté totale</p>
           </div>
        </div>
      </div>

      <div className="mt-16 max-w-md mx-auto">
        <div className="relative group">
          <label className="block text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Votre Budget Engagement</label>
          <input 
            type="text"
            placeholder="Est-ce envisageable pour vous ?"
            value={data.budgetCommitment}
            onChange={(e) => updateData('budgetCommitment', e.target.value)}
            className="w-full bg-transparent border-b border-gray-300 text-center py-4 text-2xl font-serif text-gray-800 focus:border-purple-600 outline-none transition-colors placeholder:text-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

// --- Loading Component (High End) ---

const LoadingScreen = () => {
  const [textIndex, setTextIndex] = useState(0);
  const loadingTexts = [
    "Analyse de vos schémas de pensée...",
    "Détection des points de friction...",
    "Corrélation de vos talents...",
    "Génération de la stratégie...",
    "Finalisation du plan d'action..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
      {/* Visual Animation */}
      <div className="relative w-32 h-32 mb-12">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-purple-100 scale-150 opacity-20 animate-pulse"></div>
        <div className="absolute inset-0 rounded-full border border-purple-200 scale-125 opacity-30 animate-pulse" style={{ animationDelay: '0.5s'}}></div>
        
        {/* Spinning Gradients */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-transparent animate-spin duration-3000"></div>
        <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center shadow-lg z-10">
           <Gem className="w-10 h-10 text-purple-600 animate-pulse" />
        </div>
        
        {/* Orbiting Dot */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="h-3 w-3 bg-purple-600 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_15px_rgba(147,51,234,0.5)]"></div>
        </div>
      </div>

      {/* Text Animation */}
      <div className="text-center h-20">
        <p className="text-xl font-serif text-gray-800 mb-2 transition-all duration-500 animate-slide-up key-{textIndex}">
          {loadingTexts[textIndex]}
        </p>
        <div className="w-48 h-1 bg-gray-100 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-purple-600 animate-loading-bar rounded-full"></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

const BlueprintPhase = ({ data, updateData }: any) => {
  const [loading, setLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data.aiAnalysis && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      handleAnalysis();
    }
  }, []);

  const handleAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzeProfile(data);
      if (result) updateData('aiAnalysis', result);
    } catch (e) {
      console.error(e);
    } finally {
      // Fake delay to show the nice animation if API is too fast
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const handleDownloadPdf = () => {
    const input = reportRef.current;
    if (!input) {
        console.error("Report element not found");
        return;
    }

    html2canvas(input, { scale: 2, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        const ratio = canvasWidth / canvasHeight;
        const imgHeightInPdf = pdfWidth / ratio;

        let heightLeft = imgHeightInPdf;
        let position = 0;
        let page = 1;

        // Add the first page
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInPdf);
        heightLeft -= pdfHeight;

        // Add new pages if needed
        while (heightLeft > 0) {
            position = -pdfHeight * page;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInPdf);
            heightLeft -= pdfHeight;
            page++;
        }

        pdf.save(`Feuille_de_Route_${data.firstName}_${data.lastName}.pdf`);
    });
  };

  return (
    <div className="animate-slide-up max-w-4xl mx-auto space-y-12">
      <div className="text-center print:hidden">
        <h2 className="text-4xl font-serif text-gray-900 mb-3 animate-gradient-text">Votre Feuille de Route</h2>
        <p className="text-gray-500">Synthèse stratégique générée par JC.</p>
      </div>

      {loading ? (
        <LoadingScreen />
      ) : data.aiAnalysis ? (
        <>
          <div ref={reportRef} className="bg-white shadow-2xl rounded-3xl overflow-hidden print:shadow-none print:rounded-none ring-1 ring-black/5">
            {/* Header Report */}
            <div className="bg-[#1a1a1a] text-white p-10 print:bg-white print:text-black print:border-b print:p-0 print:mb-8">
               <div className="flex justify-between items-start">
                 <div>
                    <h1 className="text-3xl font-serif mb-2">{data.firstName} {data.lastName}</h1>
                    <div className="flex gap-4 text-xs text-gray-400 uppercase tracking-widest mt-4">
                      <span>{data.currentPosition}</span>
                      <span>•</span>
                      <span>Analyse du {new Date().toLocaleDateString()}</span>
                    </div>
                 </div>
                 <Gem className="text-purple-400 w-8 h-8 print:hidden" />
               </div>
            </div>

            <div className="p-10 space-y-10 print:p-0">
              {/* Archetype Section */}
              <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 p-8 rounded-2xl border border-gray-100 print:bg-white print:border-0 print:p-0">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm print:hidden ring-4 ring-purple-50">
                  <Target className="text-purple-600 w-8 h-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-[10px] text-purple-600 uppercase tracking-widest font-bold mb-2">Votre Archétype Dominant</h3>
                  <p className="text-3xl text-gray-900 font-serif">{data.aiAnalysis.archetype}</p>
                </div>
              </div>

              {/* User Data Section */}
              <div className="px-10">
                <h3 className="text-lg font-serif text-gray-900 mb-4 border-b border-gray-100 pb-2">
                  Synthèse de vos réponses
                </h3>
                <div className="space-y-6 text-sm text-gray-700">
                  <div>
                    <p className="font-bold text-gray-500 text-xs uppercase tracking-wider">Blocage Principal</p>
                    <p className="mt-1 italic">"{data.mainStruggle}"</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-500 text-xs uppercase tracking-wider">Élément Déclencheur</p>
                    <p className="mt-1 italic">"{data.triggerEvent}"</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-500 text-xs uppercase tracking-wider">Exploration "Deep Dive"</p>
                    <ul className="mt-2 space-y-2 list-disc list-inside">
                      {data.whys && Object.entries(data.whys).map(([key, value]) => (
                        <li key={key}><span className="font-semibold">{key.replace('level', 'Niveau ')}:</span> {String(value)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div>
                   <h3 className="text-lg font-serif text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                     <Compass className="text-purple-500 w-5 h-5"/> Stratégie Recommandée
                   </h3>
                   <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line text-justify">{data.aiAnalysis.strategy}</p>
                </div>
                
                <div className="bg-purple-50/50 p-8 rounded-2xl relative print:bg-white print:p-0">
                   <h3 className="text-lg font-serif text-purple-900 mb-4 flex items-center gap-2">
                     <span className="text-purple-400 text-3xl font-serif leading-none mr-2">❝</span> Note de JC
                   </h3>
                   <p className="text-gray-700 italic leading-relaxed text-sm">
                     {data.aiAnalysis.personalizedMessage}
                   </p>
                   <div className="mt-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                          {/* Placeholder for coach avatar */}
                          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                      </div>
                      <span className="text-xs font-bold text-purple-900">JC</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-4 pt-8 print:hidden border-t border-gray-100">
             <button onClick={handleDownloadPdf} className="px-8 py-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-bold uppercase tracking-wide">
               Télécharger PDF
             </button>
             <a 
               href="https://calendly.com/yervantj/30min"
               target="_blank"
               rel="noopener noreferrer" 
               className="px-8 py-4 rounded-xl bg-gray-900 text-white hover:bg-purple-600 transition-all shadow-xl hover:shadow-purple-500/30 text-sm font-bold tracking-wide flex items-center justify-center gap-3 uppercase"
             >
               Réserver l'Appel <ArrowRight className="w-4 h-4" />
             </a>
          </div>
        </>
      ) : (
        <div className="text-center p-10 bg-red-50 rounded-2xl border border-red-100">
          <p className="text-red-500 mb-4">Erreur de connexion avec l'assistant.</p>
          <button onClick={handleAnalysis} className="text-gray-900 underline font-medium">Réessayer l'analyse</button>
        </div>
      )}
    </div>
  );
};

const OnboardPhase = () => {
    const [markdownContent, setMarkdownContent] = useState<string>('');
  
    useEffect(() => {
      fetch('/docs/mcp_content.md')
        .then((response) => response.text())
        .then((text) => setMarkdownContent(text));
    }, []);
  
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl min-h-[60vh] prose prose-purple lg:prose-xl">
        <Markdown>{markdownContent}</Markdown>
      </div>
    );
}

// --- Main Layout ---

export default function App() {
  const [step, setStep] = useState<StepType>(StepType.WELCOME);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);

  useEffect(() => {
    const saved = localStorage.getItem('jc_onboarding_data');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jc_onboarding_data', JSON.stringify(data));
  }, [data]);

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    { id: StepType.WELCOME, label: 'Accueil' },
    { id: StepType.DIAGNOSIS, label: 'Diagnostic' },
    { id: StepType.DEEP_DIVE, label: 'Profondeur' },
    { id: StepType.OFFER_FIT, label: 'Solutions' },
    { id: StepType.BLUEPRINT, label: 'Votre Plan' },
    { id: StepType.ONBOARD, label: 'ONBOARD' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setStep(steps[currentStepIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderStep = () => {
    switch(step) {
      case StepType.WELCOME: return <WelcomePhase data={data} updateData={updateData} next={nextStep} />;
      case StepType.DIAGNOSIS: return <DiagnosisPhase data={data} updateData={updateData} />;
      case StepType.DEEP_DIVE: return <DeepDivePhase data={data} updateData={updateData} />;
      case StepType.OFFER_FIT: return <OfferPhase data={data} updateData={updateData} />;
      case StepType.BLUEPRINT: return <BlueprintPhase data={data} updateData={updateData} />;
      case StepType.ONBOARD: return <OnboardPhase />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFD] text-gray-800 font-sans selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden">
        {/* Inject Styles */}
        <style dangerouslySetInnerHTML={{__html: globalStyles}} />

        {/* Background Ambient Elements */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-100/40 rounded-full blur-[120px] animate-pulse" style={{animationDuration: '10s'}}></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px]" ></div>
        </div>

        {/* Progress Bar (Skipped on Welcome) */}
        {step !== StepType.WELCOME && (
          <ProgressBar currentStep={currentStepIndex} totalSteps={steps.length} />
        )}

        {/* Main Content Container */}
        <div className="container mx-auto px-4 py-4 md:py-8 relative z-10 min-h-screen flex flex-col">
          
          <div className="flex-grow transition-all duration-500 ease-in-out">
            {renderStep()}
          </div>

          {/* Navigation Footer */}
          {step !== StepType.WELCOME && step !== StepType.BLUEPRINT && step !== StepType.ONBOARD && (
            <div className="max-w-4xl mx-auto w-full mt-12 flex justify-between items-center animate-fade-in px-4 md:px-0">
              <button 
                onClick={prevStep}
                className="group flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-colors text-xs font-bold uppercase tracking-widest py-3"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Retour
              </button>

              <button 
                onClick={nextStep}
                className="bg-gray-900 text-white hover:bg-purple-600 px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-3 uppercase tracking-wider text-xs shadow-xl shadow-gray-200 hover:shadow-purple-500/20 hover:-translate-y-1"
              >
                Étape Suivante <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
    </div>
  );
};