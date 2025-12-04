import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Player, Team } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useRouter } from '../utils/router';
import { ArrowLeft, User, Calendar, Ruler, Weight } from 'lucide-react';

export const PlayerDetailPage = () => {
  const { currentPath, navigate } = useRouter();
  const playerId = currentPath.split('/').pop() || '';

  const [player, setPlayer] = useState<Player | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlayerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const playerData = await apiService.getPlayer(playerId);
      setPlayer(playerData);

      const teamData = await apiService.getTeam(playerData.teamId);
      setTeam(teamData);
    } catch (err) {
      setError('Failed to load player details. Please check your API connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayerData();
  }, [playerId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadPlayerData} />;
  if (!player) return <ErrorMessage message="Player not found" />;

  const positionNames: Record<string, string> = {
    PG: 'Point Guard',
    SG: 'Shooting Guard',
    SF: 'Small Forward',
    PF: 'Power Forward',
    C: 'Center'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/players')}
            className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Players
          </button>

          <div className="flex items-center gap-8">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-20 h-20" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {player.firstName} {player.lastName}
              </h1>
              <p className="text-xl opacity-90 mb-3">
                #{player.jerseyNumber} · {positionNames[player.position]}
              </p>
              {team && (
                <button
                  onClick={() => navigate(`/teams/${team.id}`)}
                  className="px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-opacity-90 transition-all font-semibold"
                >
                  {team.city} {team.name}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <Ruler className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-600">Height</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{player.height}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <Weight className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-600">Weight</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{player.weight}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-600">Birth Date</h3>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {new Date(player.birthDate).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-600">Jersey</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">#{player.jerseyNumber}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Career Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">{player.stats.ppg}</div>
              <div className="text-sm text-gray-600 font-medium">Points Per Game</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">{player.stats.rpg}</div>
              <div className="text-sm text-gray-600 font-medium">Rebounds Per Game</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-1">{player.stats.apg}</div>
              <div className="text-sm text-gray-600 font-medium">Assists Per Game</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-1">{player.stats.fg_percentage}%</div>
              <div className="text-sm text-gray-600 font-medium">Field Goal %</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-1">{player.stats.three_percentage}%</div>
              <div className="text-sm text-gray-600 font-medium">Three Point %</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-teal-600 mb-1">{player.stats.ft_percentage}%</div>
              <div className="text-sm text-gray-600 font-medium">Free Throw %</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
