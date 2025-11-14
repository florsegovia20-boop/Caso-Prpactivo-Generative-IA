import React, { useState } from 'react';
import { Itinerary } from '../types';
import { ChevronDown, MapPin, Tag, Award, LinkIcon } from './Icons';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  sources: any[];
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, sources }) => {
  const [openDay, setOpenDay] = useState<number | null>(1);

  const toggleDay = (day: number) => {
    setOpenDay(openDay === day ? null : day);
  };
  
  const hasSources = sources && sources.length > 0;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-200 text-center animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600">{itinerary.trip_title}</h1>
        <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">{itinerary.summary}</p>
        <div className="mt-4 inline-block bg-indigo-100 text-indigo-800 text-lg font-semibold px-4 py-2 rounded-full">
          Costo Total Estimado: {itinerary.total_estimated_cost}
        </div>
      </div>

      <div className="space-y-4">
        {itinerary.daily_plans.map((plan) => (
          <div key={plan.day} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-500 animate-slide-up" style={{ animationDelay: `${plan.day * 100}ms` }}>
            <button
              onClick={() => toggleDay(plan.day)}
              className="w-full flex justify-between items-center p-4 sm:p-5 text-left bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                 <div className="flex-shrink-0 bg-indigo-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">
                    {plan.day}
                 </div>
                 <div>
                    <h2 className="text-xl font-semibold text-gray-800">Día {plan.day}: {plan.theme}</h2>
                 </div>
              </div>
              <ChevronDown className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${openDay === plan.day ? 'rotate-180' : ''}`} />
            </button>
            {openDay === plan.day && (
              <div className="p-4 sm:p-6 border-t border-gray-200 animate-fade-in-slow">
                <div className="space-y-6">
                  {plan.activities.map((activity, index) => (
                    <div key={index} className="pl-4 border-l-4 border-indigo-300">
                        <div className="flex justify-between items-start">
                           <h3 className="text-lg font-semibold text-indigo-700">{activity.title}</h3>
                           <span className="text-sm font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{activity.estimated_cost}</span>
                        </div>
                        <p className="mt-1 text-gray-600">{activity.description}</p>
                        <div className="mt-3 bg-indigo-50 p-3 rounded-lg flex items-start gap-3">
                           <Award className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-1" />
                           <div>
                              <h4 className="font-semibold text-sm text-indigo-800">Justificación</h4>
                              <p className="text-sm text-indigo-700">{activity.justification}</p>
                           </div>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {hasSources && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 animate-fade-in">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Fuentes de Datos</h3>
          <p className="text-sm text-gray-500 mb-4">Este itinerario se generó utilizando información actualizada de la web. Estas son algunas de las fuentes utilizadas:</p>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              source.web && (
                <li key={index} className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 hover:underline text-sm truncate">
                    {source.web.title || source.web.uri}
                  </a>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ItineraryDisplay;