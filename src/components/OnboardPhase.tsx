/* eslint-disable react/no-unescaped-entities */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { OnboardingData, INITIAL_DATA, StepType } from '../app/onboard/types';
import { Sparkles, Compass, Lightbulb, ArrowRight, CheckCircle, Brain, ChevronRight, ChevronDown, Gem, Target } from './Icons';
import { analyzeProfile } from '../lib/geminiService';
import Markdown from 'react-markdown';

// --- Shared UI Components ---

const TextArea = ({ label, value, onChange, placeholder, rows = 3, helpText }: any) => (
  <div className="mb-8 animate-fade-in group">
    <label className="block text-sm font-serif tracking-wide text-clarity-gold/80 mb-3">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-clarity-surface/50 backdrop-blur-md border border-slate-800 rounded-none border-l-2 border-l-slate-700 p-4 text-slate-100 focus:border-l-clarity-gold focus:ring-0 transition-all outline-none resize-none font-sans text-lg placeholder-slate-600"
      placeholder={placeholder}
      rows={rows}
    />
    {helpText && <p className="text-xs text-slate-500 mt-2 font-light">{helpText}</p>}
  </div>
);

const Input = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="mb-6 animate-fade-in">
    <label className="block text-sm font-serif tracking-wide text-clarity-gold/80 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-clarity-surface border-b border-slate-700 p-3 text-slate-100 focus:border-clarity-gold transition-all outline-none rounded-none placeholder-slate-600"
      placeholder={placeholder}
    />
  </div>
);

const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-clarity-surface/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

// --- Phases ---

const WelcomePhase = ({ data, updateData, next }: any) => (
  <div className="max-w-3xl mx-auto text-center py-10 animate-fade-in">
    <div className="flex justify-center mb-8">
      <div className="bg-gradient-to-br from-clarity-gold to-orange-600 p-[1px] rounded-full">
        <div className="bg-clarity-base p-4 rounded-full">
          <Sparkles className="text-clarity-gold w-10 h-10" />
        </div>
      </div>
    </div>
    
    <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">
      Devenez un multipotentiel <span className="text-transparent bg-clip-text bg-gradient-to-r from-clarity-gold to-amber-600">assumé</span>
    </h1>
    
    <p className="text-slate-400 mb-12 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
      Vous êtes tiraillé entre vos nombreux talents ? Freiné par le doute ? 
      Il est temps de transformer cette tempête intérieure en force motrice.
      <br/><span className="text-clarity-gold/70 text-sm mt-4 block uppercase tracking-widest">Le Catalyseur de Clarté</span>
    </p>
    
    <Card className="text-left max-w-lg mx-auto transform hover:-translate-y-1 transition-transform duration-500">
      <div className="space-y-4">
        <Input 
          label="Votre Prénom" 
          placeholder="ex: Camille" 
          value={data.clientName} 
          onChange={(v: string) => updateData('clientName', v)} 
        />
        <Input 
          label="Votre Email" 
          type="email"
          placeholder="camille@email.com" 
          value={data.email} 
          onChange={(v: string) => updateData('email', v)} 
        />
      </div>
      <div className="mt-8">
        <button 
          onClick={next}
          disabled={!data.clientName}
          className="w-full bg-gradient-to-r from-clarity-gold to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black font-semibold py-4 px-6 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide uppercase text-sm"
        >
          Commencer ma transformation <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  </div>
);

const DiagnosisPhase = ({ data, updateData }: any) => (
  <div className="animate-slide-up">
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-serif text-white mb-3">Identification des Causes Profondes</h2>
      <p className="text-slate-400 font-light">"La vérité, c'est que votre multipotentialité est votre super pouvoir... une fois maîtrisée."</p>
    </div>

    <div className="grid md:grid-cols-2 gap-12">
      <div className="space-y-6">
        <TextArea 
          label="Quel est votre blocage n°1 aujourd'hui ?" 
          placeholder="ex: Je commence 10 projets sans en finir aucun, fatigue décisionnelle, syndrome de l'imposteur..."
          value={data.mainStruggle}
          onChange={(v: string) => updateData('mainStruggle', v)}
        />
        
        <TextArea 
          label="Pourquoi chercher de l'aide maintenant ?" 
          helpText="Y a-t-il eu un événement déclencheur récent ?"
          placeholder="ex: Je viens de refuser une opportunité par peur, je suis au bord du burnout..."
          value={data.triggerEvent}
          onChange={(v: string) => updateData('triggerEvent', v)}
        />
      </div>

      <div className="bg-slate-900/50 p-6 border-l border-clarity-gold/30">
        <h4 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
          <Brain className="text-clarity-gold w-5 h-5"/> Ce que vous ressentez peut-être
        </h4>
        <ul className="space-y-4 text-slate-400 text-sm font-light">
          <li className="flex gap-3">
            <span className="text-red-400">✕</span>
            Impression de courir dans tous les sens sans avancer
          </li>
          <li className="flex gap-3">
            <span className="text-red-400">✕</span>
            Peur de devoir "choisir une seule chose"
          </li>
          <li className="flex gap-3">
            <span className="text-red-400">✕</span>
            Auto-sabotage dès que le succès approche
          </li>
        </ul>
        <div className="mt-8 pt-8 border-t border-slate-800">
           <h4 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Compass className="text-green-400 w-5 h-5"/> Ce que je propose
          </h4>
           <ul className="space-y-4 text-slate-300 text-sm font-light">
            <li className="flex gap-3">
              <CheckCircle className="text-clarity-gold w-4 h-4"/>
              Silence intérieur & Focus
            </li>
            <li className="flex gap-3">
              <CheckCircle className="text-clarity-gold w-4 h-4"/>
              Confiance inébranlable
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const DeepDivePhase = ({ data, updateData }: any) => {
   const levels = [
    { key: 'level1', label: 'Surface', q: "Pourquoi est-ce un problème pour vous aujourd'hui ?" },
    { key: 'level2', label: 'Impact Pro', q: "Comment cela affecte-t-il votre business ou votre carrière concrètement ?" },
    { key: 'level3', label: 'Douleur', q: "Si rien ne change dans 6 mois, quelles seront les conséquences ?" },
    { key: 'level4', label: 'Impact Perso', q: "Comment cela vous pèse-t-il personnellement (stress, famille, estime) ?" },
    { key: 'level5', label: 'Opportunité', q: "Imaginez que c'est résolu. Qu'est-ce que vous pourriez enfin faire ?" },
    { key: 'level6', label: 'Émotion', q: "Pourquoi est-ce si important pour vous de réaliser cela maintenant ?" },
    { key: 'level7', label: 'Vérité', q: "Au fond, quel est le véritable but derrière tout ça (Liberté, Reconnaissance, Paix) ?" },
  ];

  const [activeLevel, setActiveLevel] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateWhy = (key: string, val: string) => {
    updateData('whys', { ...data.whys, [key]: val });
  };

  const handleNext = (idx: number) => {
    if (idx < levels.length - 1) {
      setActiveLevel(idx + 1);
      // Small delay to allow render then scroll
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  return (
    <div className="animate-slide-up max-w-3xl mx-auto">
      <div className="mb-8 p-4 border-l-2 border-clarity-gold bg-clarity-gold/5">
        <h3 className="font-serif text-2xl text-white mb-2">Exploration en Profondeur</h3>
        <p className="text-slate-400 text-sm">Nous allons creuser au-delà de la surface pour trouver votre véritable moteur.</p>
      </div>

      <div className="space-y-6 relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-800 -z-10"></div>

        {levels.map((level, idx) => {
          const isActive = activeLevel === idx;
          const isCompleted = idx < activeLevel;
          const hasContent = data.whys[level.key]?.length > 0;

          // Hide future levels
          if (idx > activeLevel) return null;

          return (
            <div 
              key={level.key} 
              className={`transition-all duration-500 ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-80'}`}
              ref={isActive ? scrollRef : null}
            >
              <div className="flex gap-6">
                
                {/* Status Indicator */}
                <div className="flex flex-col items-center">
                   <div 
                     onClick={() => isCompleted && setActiveLevel(idx)}
                     className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors cursor-pointer z-10 bg-clarity-base
                       ${isActive ? 'border-clarity-gold text-clarity-gold' :
                         isCompleted ? 'border-green-500 bg-green-900/20 text-green-500 hover:bg-green-900/40' : 'border-slate-700 text-slate-700'}
                     `}
                   >
                     {isCompleted && <CheckCircle className="w-4 h-4" />}
                     {isActive && <div className="w-1.5 h-1.5 rounded-full bg-clarity-gold animate-pulse" />}
                   </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  {isCompleted ? (
                    // Collapsed View for Completed Items
                    <div 
                      onClick={() => setActiveLevel(idx)}
                      className="cursor-pointer group animate-fade-in"
                    >
                      <h4 className="text-slate-500 text-sm font-medium mb-1 group-hover:text-clarity-gold transition-colors">{level.label}</h4>
                      <p className="text-slate-300 text-lg font-serif line-clamp-1 italic border-l-2 border-slate-800 pl-4 py-1 group-hover:border-clarity-gold/50 transition-colors">
                        "{data.whys[level.key]}"
                      </p>
                    </div>
                  ) : (
                    // Active Expanded Card
                    <div className="bg-slate-900/80 border border-clarity-gold/30 p-6 shadow-2xl animate-fade-in backdrop-blur-sm rounded-sm">
                      <span className="text-xs uppercase tracking-widest text-clarity-gold font-bold mb-2 block">{level.label}</span>
                      <h4 className="font-serif text-2xl text-white mb-6 leading-tight">
                        {level.q}
                      </h4>
                      <textarea
                        autoFocus
                        value={data.whys[level.key]}
                        onChange={(e) => updateWhy(level.key, e.target.value)}
                        className="w-full bg-black/40 border border-slate-700 p-4 text-white focus:border-clarity-gold outline-none h-40 resize-none font-sans text-lg leading-relaxed placeholder-slate-700"
                        placeholder="Prenez le temps de répondre sincèrement..."
                      />
                      {idx < levels.length - 1 && (
                        <div className="flex justify-end mt-4">
                          <button 
                            onClick={() => handleNext(idx)}
                            disabled={!hasContent}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 px-6 py-2 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-widest font-bold"
                          >
                            Continuer <ChevronDown className="w-3 h-3" />
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
    <div className="animate-slide-up max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-white mb-4">Investissez en vous-même</h2>
        
        {/* The Math Component */}
        <div className="bg-slate-900/50 inline-block p-6 border border-slate-800 rounded-lg max-w-2xl mx-auto text-left">
          <h4 className="text-red-400 font-bold uppercase text-xs tracking-widest mb-4">Le coût de l'inaction (1 an)</h4>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="opacity-50">
              <p>Se former seul</p>
              <p className="text-2xl font-serif text-white">12 mois</p>
              <p className="mt-2 text-red-500">Perte estimée: 39 600€</p>
            </div>
            <div>
              <p className="text-clarity-gold font-bold">Avec JC</p>
              <p className="text-2xl font-serif text-white">1 mois</p>
              <p className="mt-2 text-green-500">Gain estimé: +11 mois de vie</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-xl mx-auto">
        <label className="block text-center text-sm font-serif text-slate-400 mb-4">Budget Engagement</label>
        <input 
          type="text"
          placeholder="Est-ce que cet investissement est envisageable pour vous ?"
          value={data.budgetCommitment}
          onChange={(e) => updateData('budgetCommitment', e.target.value)}
          className="w-full bg-transparent border-b border-slate-700 text-center py-2 text-white focus:border-clarity-gold outline-none"
        />
      </div>
    </div>
  );
};

const BlueprintPhase = ({ data, updateData }: any) => {
  const [loading, setLoading] = useState(false);

  const handleAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const result = await analyzeProfile(data);
      if (result) updateData('aiAnalysis', result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [data, updateData]);

  useEffect(() => {
    if (!data.aiAnalysis && process.env.API_KEY) {
      handleAnalysis();
    }
  }, [data.aiAnalysis, handleAnalysis]);

  return (
    <div className="animate-slide-up max-w-4xl mx-auto space-y-8">
      <div className="text-center print:hidden">
        <h2 className="text-4xl font-serif text-white mb-2">Votre Feuille de Route</h2>
        <p className="text-slate-400">Basée sur votre profil multipotentiel unique.</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Sparkles className="w-12 h-12 text-clarity-gold mx-auto animate-spin mb-4" />
          <p className="text-clarity-gold animate-pulse">JC analyse votre profil...</p>
        </div>
      ) : data.aiAnalysis ? (
        <div className="space-y-6">
          {/* Header visible uniquement à l'impression */}
          <div className="hidden print:block mb-8 border-b pb-4">
             <h1 className="text-2xl font-bold mb-2">Dossier d'analyse : {data.clientName}</h1>
             <p className="text-sm text-gray-500">Généré par JC - Le Catalyseur de Clarté</p>
          </div>

          {/* Archetype Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-8 border border-clarity-gold/20 flex flex-col md:flex-row items-center gap-6 print:border print:bg-white print:p-4">
            <div className="bg-clarity-gold/10 p-4 rounded-full print:hidden">
              <Gem className="text-clarity-gold w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm text-clarity-gold uppercase tracking-widest font-bold mb-1 print:text-black">Votre Archétype</h3>
              <p className="text-2xl text-white font-serif print:text-black">{data.aiAnalysis.archetype}</p>
            </div>
          </div>

          {/* Strategy & Message Grid */}
          <div className="grid md:grid-cols-2 gap-6 print:block print:space-y-6">
            <div className="bg-slate-900/50 p-8 border border-slate-800 print:bg-white print:border print:p-4">
               <h3 className="text-lg font-serif text-white mb-4 flex items-center gap-2 print:text-black">
                 <Compass className="text-blue-400 print:hidden"/> Stratégie Recommandée
               </h3>
               <p className="text-slate-300 leading-relaxed whitespace-pre-line print:text-black">{data.aiAnalysis.strategy}</p>
            </div>
            
            <div className="bg-slate-900/50 p-8 border border-slate-800 relative print:bg-white print:border print:p-4">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-clarity-gold to-transparent print:hidden"></div>
               <h3 className="text-lg font-serif text-white mb-4 flex items-center gap-2 print:text-black">
                 <span className="text-clarity-gold print:text-black">❝</span> Le mot de JC
               </h3>
               <p className="text-slate-300 italic leading-relaxed print:text-black">
                 {data.aiAnalysis.personalizedMessage}
               </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center mt-12 gap-4 print:hidden">
             <button onClick={() => window.print()} className="px-6 py-3 border border-slate-700 text-slate-300 hover:text-white hover:border-white transition-colors uppercase text-sm tracking-wider">
               Télécharger mon profil (PDF)
             </button>
             <a 
               href="https://calendly.com/yervantj/30min"
               target="_blank"
               rel="noopener noreferrer" 
               className="px-6 py-3 bg-clarity-gold text-black hover:bg-amber-400 transition-colors uppercase text-sm tracking-wider font-bold inline-block text-center pt-3 shadow-lg hover:shadow-clarity-gold/50"
             >
               Réserver mon appel ({data.selectedOfferInterest === 'CLARITY' ? 'Pack Clarté' : "L'Appel Déclic"})
             </a>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-400">
          Erreur de connexion avec l'assistant. Veuillez vérifier la clé API.
          <button onClick={handleAnalysis} className="block mx-auto mt-4 text-white underline">Réessayer</button>
        </div>
      )}
    </div>
  );
};


// --- Main Layout ---

const OnboardPhaseComponent = () => {
    const [markdownContent, setMarkdownContent] = useState<string>('');
  
    useEffect(() => {
      fetch('/docs/mcp_content.md')
        .then((response) => response.text())
        .then((text) => setMarkdownContent(text));
    }, []);
  
    return (
      <div className="p-4 h-full w-full markdown-wrapper">
        <Markdown>{markdownContent}</Markdown>
      </div>
    );
}

export default OnboardPhaseComponent;