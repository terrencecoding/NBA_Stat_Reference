import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Game, Team } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Calendar, MapPin, Clock } from 'lucide-react';

export const SchedulePage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'completed' | 'upcoming'>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  const loadSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      const [gamesData, teamsData] = await Promise.all([
        apiService.getSchedule(),
        apiService.getTeams()
      ]);
      setGames(gamesData);
      setTeams(teamsData);
    } catch (err) {
      setError('Failed to load schedule. Please check your API connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const getTeamById = (id: string) => teams.find(t => t.id === id);

  const filteredGames = games.filter(game => {
    if (viewMode === 'completed' && game.status !== 'completed') return false;
    if (viewMode === 'upcoming' && game.status === 'completed') return false;
    if (selectedTeam !== 'all' && game.homeTeamId !== selectedTeam && game.awayTeamId !== selectedTeam) return false;
    return true;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadSchedule} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">NBA Schedule</h1>
          <p className="text-gray-600">View games, scores, and upcoming matchups</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Games
              </button>
              <button
                onClick={() => setViewMode('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setViewMode('upcoming')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'upcoming'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
            </div>

            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.city} {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {sortedGames.map((game) => {
            const homeTeam = getTeamById(game.homeTeamId);
            const awayTeam = getTeamById(game.awayTeamId);

            if (!homeTeam || !awayTeam) return null;

            return (
              <div key={game.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(game.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                    <Clock className="w-4 h-4 ml-3" />
                    <span>{game.time}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      game.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : game.status === 'live'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {game.status === 'completed' ? 'Final' : game.status === 'live' ? 'Live' : 'Scheduled'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900 mb-1">
                      {awayTeam.city} {awayTeam.name}
                    </div>
                    <div className="text-sm text-gray-500">{awayTeam.abbreviation}</div>
                  </div>

                  <div className="text-center">
                    {game.status === 'completed' ? (
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-3xl font-bold">{game.awayScore}</div>
                        <div className="text-2xl text-gray-400">-</div>
                        <div className="text-3xl font-bold">{game.homeScore}</div>
                      </div>
                    ) : (
                      <div className="text-gray-400 font-semibold">VS</div>
                    )}
                  </div>

                  <div className="text-left">
                    <div className="font-bold text-lg text-gray-900 mb-1">
                      {homeTeam.city} {homeTeam.name}
                    </div>
                    <div className="text-sm text-gray-500">{homeTeam.abbreviation}</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{game.venue}</span>
                </div>
              </div>
            );
          })}
        </div>

        {sortedGames.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No games found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
