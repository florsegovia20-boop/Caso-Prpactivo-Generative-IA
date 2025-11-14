import React, { useState, useCallback } from 'react';
import ItineraryForm from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { TripPreferences, Itinerary } from './types';
import { generateItinerary } from './services/geminiService';
import { Globe, Compass } from './components/Icons';

export default function App() {
  const [preferences, setPreferences] = useState<TripPreferences>({
    destination: '',
    duration: 7,
    budget: 1500,
    interests: [],
    specialRequirements: '',
  });
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = useCallback(async (submittedPreferences: TripPreferences) => {
    setLoading(true);
    setError(null);
    setItinerary(null);
    setSources([]);
    try {
      const result = await generateItinerary(submittedPreferences);
      if (result.itinerary) {
        setItinerary(result.itinerary);
      }
      if(result.sources) {
        setSources(result.sources);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const resetForm = () => {
    setItinerary(null);
    setError(null);
    setSources([]);
    setPreferences({
      destination: '',
      duration: 7,
      budget: 1500,
      interests: [],
      specialRequirements: '',
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="relative isolate overflow-hidden bg-gray-900 pb-16 pt-14 sm:pb-20">
        <img src="https://picsum.photos/1920/1080?grayscale&blur=5" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover"/>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl flex items-center justify-center gap-4">
                <Globe className="h-10 w-10 sm:h-14 sm:w-14" />
                Copiloto de Viajes AI
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Tu experto personal en logística para crear experiencias de viaje inolvidables y a medida.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-12 -mt-20">
        <div className="max-w-4xl mx-auto">
          {!itinerary && !loading && (
            <ItineraryForm
              preferences={preferences}
              setPreferences={setPreferences}
              onSubmit={handleFormSubmit}
              isLoading={loading}
            />
          )}

          {loading && (
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
              <LoadingSpinner />
              <h2 className="text-2xl font-semibold text-gray-700 mt-4">Creando tu Aventura...</h2>
              <p className="text-gray-500 mt-2">Nuestra IA está explorando las mejores opciones para ti. Esto puede tardar un momento.</p>
            </div>
          )}

          {error && (
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
              <h2 className="text-xl font-bold text-red-600">Error en la Generación</h2>
              <p className="text-gray-600 mt-2">{error}</p>
              <button
                onClick={resetForm}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Intentar de Nuevo
              </button>
            </div>
          )}

          {itinerary && !loading && (
            <>
              <ItineraryDisplay itinerary={itinerary} sources={sources} />
              <div className="text-center mt-8">
                <button
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-transform transform hover:scale-105"
                >
                  <Compass className="w-5 h-5" />
                  Planificar un Nuevo Viaje
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Copiloto de Viajes AI. Todos los derechos reservados.</p>
          <p className="mt-1">Impulsado por Google Gemini</p>
        </div>
      </footer>
    </div>
  );
}