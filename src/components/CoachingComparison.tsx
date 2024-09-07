/* eslint-disable react/no-unescaped-entities */


import React from 'react';

interface CoachingComparisonProps {
  coachingDuration: number;  // Durée du coaching en mois
  selfLearningDuration: number;  // Durée d'apprentissage en mois sans coaching
  monthlySalary: number;  // Salaire mensuel moyen d'un multipotentiel
  coachingCost: number;  // Coût du coaching
}

const CoachingComparison: React.FC<CoachingComparisonProps> = ({
  coachingDuration,
  selfLearningDuration,
  monthlySalary,
  coachingCost,
}) => {
  const salaryLostWithoutCoaching = selfLearningDuration * monthlySalary;
  const salaryGainedWithCoaching = (selfLearningDuration - coachingDuration) * monthlySalary;
  const netGainWithCoaching = salaryGainedWithCoaching - coachingCost;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="border border-gray-200 p-6 mb-8 rounded-lg bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Sans le coaching de JC...
        </h2>
        <p>Temps pour te former seul : <strong>{selfLearningDuration} mois</strong></p>
        <p>Salaire moyen mensuel d'un multipotentiel : <strong>{monthlySalary.toLocaleString()} €</strong></p>
        <p>Total ({monthlySalary.toLocaleString()} € * {selfLearningDuration}) : 
          <strong className="text-red-600"> {salaryLostWithoutCoaching.toLocaleString()} € (PERDU)</strong>
        </p>
      </div>

      <h2 className="text-center text-3xl font-bold text-gray-700 my-8">VS</h2>

      <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Avec le coaching de JC...
        </h2>
        <p>Temps pour te former avec JC : <strong>{coachingDuration} mois</strong></p>
        <p>Mois gagnés par rapport à te former seul : <strong>{selfLearningDuration - coachingDuration} mois</strong></p>
        <p>Prix du coaching : <strong className="text-red-600">-{coachingCost.toLocaleString()} €</strong></p>
        <p>Total ({monthlySalary.toLocaleString()} € * {selfLearningDuration - coachingDuration} - {coachingCost.toLocaleString()}) : 
          <strong className="text-green-600"> {netGainWithCoaching.toLocaleString()} € (GAGNÉ)</strong>
        </p>
      </div>
    </div>
  );
};

export default CoachingComparison;
