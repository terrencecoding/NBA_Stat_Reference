import { Team, Player, Game, RosterPlayer, CBARule } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/nba-api-proxy`;

interface SportsDataTeam {
  TeamID: number;
  Key: string;
  City: string;
  Name: string;
  Conference: string | null;
  Division: string | null;
  PrimaryColor: string | null;
  SecondaryColor: string | null;
  WikipediaLogoUrl: string | null;
}

interface SportsDataPlayer {
  PlayerID: number;
  FirstName: string;
  LastName: string;
  Position: string;
  Jersey: number;
  TeamID: number;
  Height: number;
  Weight: number;
  BirthDate: string;
  PhotoUrl: string;
  Status: string;
}

interface SportsDataGame {
  GameID: number;
  HomeTeamID: number;
  AwayTeamID: number;
  DateTime: string;
  Status: string;
  HomeTeamScore: number | null;
  AwayTeamScore: number | null;
  StadiumID: number;
}

interface SportsDataPlayerStats {
  PlayerID: number;
  Games: number;
  Points: number;
  Rebounds: number;
  Assists: number;
  FieldGoalsPercentage: number;
  ThreePointersPercentage: number;
  FreeThrowsPercentage: number;
}

class ApiService {
  private async fetchWithErrorHandling<T>(endpoint: string): Promise<T> {
    try {
      const url = `${EDGE_FUNCTION_URL}?endpoint=${encodeURIComponent(endpoint)}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  private teamsCache: Team[] | null = null;

  async getTeams(): Promise<Team[]> {
    if (this.teamsCache) {
      return this.teamsCache;
    }

    const data = await this.fetchWithErrorHandling<SportsDataTeam[]>('AllTeams');
    this.teamsCache = data.map(team => ({
      id: String(team.TeamID),
      name: team.Name,
      city: team.City,
      abbreviation: team.Key,
      conference: (team.Conference as 'Eastern' | 'Western') || 'Eastern',
      division: team.Division || 'Unknown',
      logoUrl: team.WikipediaLogoUrl || '',
      primaryColor: team.PrimaryColor || '#000000',
      secondaryColor: team.SecondaryColor || '#FFFFFF',
      wins: 0,
      losses: 0
    }));
    return this.teamsCache;
  }

  async getTeam(id: string): Promise<Team> {
    const teams = await this.getTeams();
    const team = teams.find(t => t.id === id);
    if (!team) {
      throw new Error(`Team with id ${id} not found`);
    }
    return team;
  }

  private playersCache: Player[] | null = null;
  private statsCache: Map<number, SportsDataPlayerStats> | null = null;

  private async getPlayerStats(): Promise<Map<number, SportsDataPlayerStats>> {
    if (this.statsCache) {
      return this.statsCache;
    }

    try {
      const statsData = await this.fetchWithErrorHandling<SportsDataPlayerStats[]>('PlayerSeasonStats/2025');
      this.statsCache = new Map();
      statsData.forEach(stat => {
        this.statsCache!.set(stat.PlayerID, stat);
      });
      return this.statsCache;
    } catch (error) {
      console.error('Failed to fetch player stats:', error);
      return new Map();
    }
  }

  async getPlayers(): Promise<Player[]> {
    if (this.playersCache) {
      return this.playersCache;
    }

    const [playerData, statsMap] = await Promise.all([
      this.fetchWithErrorHandling<SportsDataPlayer[]>('Players'),
      this.getPlayerStats()
    ]);

    this.playersCache = playerData
      .filter(player => player.Status === 'Active')
      .map(player => {
        const stats = statsMap.get(player.PlayerID);
        const games = stats?.Games || 0;

        return {
          id: String(player.PlayerID),
          firstName: player.FirstName,
          lastName: player.LastName,
          position: (player.Position || 'PG') as 'PG' | 'SG' | 'SF' | 'PF' | 'C',
          jerseyNumber: player.Jersey || 0,
          teamId: String(player.TeamID),
          height: player.Height ? `${Math.floor(player.Height / 12)}'${player.Height % 12}"` : "6'0\"",
          weight: String(player.Weight) || '200',
          birthDate: player.BirthDate || '',
          photoUrl: player.PhotoUrl || '',
          stats: {
            ppg: games > 0 ? Math.round((stats!.Points / games) * 10) / 10 : 0,
            rpg: games > 0 ? Math.round((stats!.Rebounds / games) * 10) / 10 : 0,
            apg: games > 0 ? Math.round((stats!.Assists / games) * 10) / 10 : 0,
            fg_percentage: stats?.FieldGoalsPercentage || 0,
            three_percentage: stats?.ThreePointersPercentage || 0,
            ft_percentage: stats?.FreeThrowsPercentage || 0
          }
        };
      });
    return this.playersCache;
  }

  async getPlayer(id: string): Promise<Player> {
    const players = await this.getPlayers();
    const player = players.find(p => p.id === id);
    if (!player) {
      throw new Error(`Player with id ${id} not found`);
    }
    return player;
  }

  async getRoster(teamId: string): Promise<RosterPlayer[]> {
    const players = await this.getPlayers();
    const rosterPlayers = players
      .filter(p => p.teamId === teamId)
      .map((player, index) => ({
        ...player,
        status: (index < 5 ? 'starter' : 'bench') as 'starter' | 'bench'
      }));

    return rosterPlayers;
  }

  async getSchedule(teamId?: string): Promise<Game[]> {
    const season = '2025REG';

    const data = await this.fetchWithErrorHandling<SportsDataGame[]>(`SchedulesBasic/${season}`);
    const teams = await this.getTeams();

    return data.map(game => {
      const gameDate = new Date(game.DateTime);
      const homeTeam = teams.find(t => t.id === String(game.HomeTeamID));

      let status: 'scheduled' | 'completed' | 'live' = 'scheduled';
      if (game.Status === 'Final') {
        status = 'completed';
      } else if (game.Status === 'InProgress') {
        status = 'live';
      }

      return {
        id: String(game.GameID),
        homeTeamId: String(game.HomeTeamID),
        awayTeamId: String(game.AwayTeamID),
        date: gameDate.toISOString().split('T')[0],
        time: gameDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        status,
        homeScore: game.HomeTeamScore || undefined,
        awayScore: game.AwayTeamScore || undefined,
        venue: homeTeam ? `${homeTeam.city} Arena` : 'TBD'
      };
    }).filter(game => {
      if (!teamId) return true;
      return game.homeTeamId === teamId || game.awayTeamId === teamId;
    });
  }

  async getCBARules(): Promise<CBARule[]> {
    return [
      {
        id: '1',
        title: 'Salary Cap',
        category: 'salary-cap',
        description: 'The salary cap is a limit on the total amount of money that NBA teams can spend on player salaries.',
        details: [
          'For the 2023-24 season, the salary cap is set at $136 million',
          'Teams can exceed the cap using various exceptions',
          'The cap is calculated based on Basketball Related Income (BRI)'
        ],
        examples: ['Teams can use the Mid-Level Exception to sign players even when over the cap']
      },
      {
        id: '2',
        title: 'Luxury Tax',
        category: 'luxury-tax',
        description: 'Teams that exceed the luxury tax threshold must pay a tax on the excess amount.',
        details: [
          'The luxury tax threshold for 2023-24 is $165 million',
          'Tax payments increase incrementally for each dollar over the threshold',
          'Repeat offenders pay higher tax rates'
        ]
      },
      {
        id: '3',
        title: 'Max Contracts',
        category: 'contracts',
        description: 'Maximum salary rules limit how much a player can earn based on years of service.',
        details: [
          '0-6 years: 25% of salary cap',
          '7-9 years: 30% of salary cap',
          '10+ years: 35% of salary cap'
        ]
      },
      {
        id: '4',
        title: 'Trade Rules',
        category: 'trades',
        description: 'NBA trades must follow specific salary matching requirements.',
        details: [
          'Teams over the cap must match salaries within specific thresholds',
          'Recently signed players may have trade restrictions',
          'Draft picks can be included in trades with limitations'
        ]
      }
    ];
  }
}

export const apiService = new ApiService();
