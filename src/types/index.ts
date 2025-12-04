export interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  conference: 'Eastern' | 'Western';
  division: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  wins: number;
  losses: number;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  jerseyNumber: number;
  teamId: string;
  height: string;
  weight: string;
  birthDate: string;
  photoUrl: string;
  stats: PlayerStats;
}

export interface PlayerStats {
  ppg: number;
  rpg: number;
  apg: number;
  fg_percentage: number;
  three_percentage: number;
  ft_percentage: number;
}

export interface RosterPlayer extends Player {
  status: 'starter' | 'bench' | 'injured';
}

export interface Game {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'live';
  homeScore?: number;
  awayScore?: number;
  venue: string;
}

export interface CBARule {
  id: string;
  title: string;
  category: 'salary-cap' | 'luxury-tax' | 'contracts' | 'trades';
  description: string;
  details: string[];
  examples?: string[];
}
