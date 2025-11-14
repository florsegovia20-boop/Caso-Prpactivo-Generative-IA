import React from 'react';
import { TripPreferences, Interest } from '../types';
import { Plane, Calendar, DollarSign, Heart, Edit3, Compass } from './Icons';

interface ItineraryFormProps {
  preferences: TripPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<TripPreferences>>;
  onSubmit: (preferences: TripPreferences) => void;
  isLoading: boolean;
}

const interests: Interest[] = ['Aire libre', 'Cultura', 'Gastronomía', 'Relajación', 'Vida nocturna', 'Aventura'];

const ItineraryForm: React.FC<ItineraryFormProps> = ({ preferences, setPreferences, onSubmit, isLoading }) => {
  const handleInterestChange = (interest: Interest) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Planifica Tu Escapada Perfecta</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="destination" className="block text-sm font-medium leading-6 text-gray-900">
              Destino
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Plane className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="destination"
                id="destination"
                className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Ej: Kioto, Japón"
                value={preferences.destination}
                onChange={(e) => setPreferences({ ...preferences, destination: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium leading-6 text-gray-900">
                Duración (días)
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="number"
                  name="duration"
                  id="duration"
                  className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  value={preferences.duration}
                  onChange={(e) => setPreferences({ ...preferences, duration: parseInt(e.target.value) || 1 })}
                  min="1"
                  max="30"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium leading-6 text-gray-900">
                Presupuesto (USD)
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="number"
                  name="budget"
                  id="budget"
                  className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  value={preferences.budget}
                  onChange={(e) => setPreferences({ ...preferences, budget: parseInt(e.target.value) || 0 })}
                  min="100"
                  step="100"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Intereses</label>
           <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {interests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestChange(interest)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  preferences.interests.includes(interest)
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="specialRequirements" className="block text-sm font-medium leading-6 text-gray-900">
            Requisitos Especiales / Comentarios Adicionales
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Edit3 className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <textarea
              name="specialRequirements"
              id="specialRequirements"
              rows={3}
              className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Ej: apto para vegetarianos, necesidades de accesibilidad, ritmo preferido..."
              value={preferences.specialRequirements}
              onChange={(e) => setPreferences({ ...preferences, specialRequirements: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando Itinerario...
              </>
            ) : (
                <>
                <Compass className="w-5 h-5" />
                Generar Mi Itinerario
                </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// FIX: Corrected component name in export statement from ItinerarioForm to ItineraryForm.
export default ItineraryForm;