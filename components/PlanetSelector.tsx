
import React from 'react';
import type { Planet } from '../types';
import { PLANETS } from '../constants';

interface PlanetSelectorProps {
  onSelectPlanet: (planet: Planet) => void;
}

const PlanetSelector: React.FC<PlanetSelectorProps> = ({ onSelectPlanet }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {PLANETS.map((planet) => (
        <div
          key={planet.nameEn}
          onClick={() => onSelectPlanet(planet)}
          className="bg-gray-800/50 rounded-3xl p-4 shadow-lg border-2 border-transparent hover:border-yellow-400 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col items-center text-center group"
        >
          <div className="w-full aspect-square rounded-full overflow-hidden mb-4 border-4 border-gray-700 group-hover:border-yellow-400 transition-colors">
            <img src={planet.image} alt={planet.name} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display text-white mb-2">{planet.name}</h2>
          <p className="text-gray-300 text-sm flex-grow">{planet.description}</p>
        </div>
      ))}
    </div>
  );
};

export default PlanetSelector;
