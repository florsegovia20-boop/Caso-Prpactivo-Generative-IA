export type Interest = 'Aire libre' | 'Cultura' | 'Gastronomía' | 'Relajación' | 'Vida nocturna' | 'Aventura';

export interface TripPreferences {
  destination: string;
  duration: number;
  budget: number;
  interests: Interest[];
  specialRequirements: string;
}

export interface Activity {
  title: string;
  description: string;
  estimated_cost: string;
  justification: string;
}

export interface DailyPlan {
  day: number;
  theme: string;
  activities: Activity[];
}

export interface Itinerary {
  trip_title: string;
  total_estimated_cost: string;
  summary: string;
  daily_plans: DailyPlan[];
}