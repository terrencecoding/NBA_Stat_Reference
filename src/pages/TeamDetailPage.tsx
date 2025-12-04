import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Team, RosterPlayer } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useRouter } from '../utils/router';
import { ArrowLeft, Users, TrendingUp } from 'lucide-react';

export const TeamDetailPage = () => {
  const { currentPath, navigate } = useRouter();
  const teamId = currentPath.split('/').pop() || '';

  const [team, setTeam] = useState<Team | null>(null);
  const [roster, setRoster] = useState<RosterPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [teamData, rosterData] = await Promise.all([
        apiService.getTeam(teamId),
        apiService.getRoster(teamId)
      ]);
      setTeam(teamData);
      setRoster(rosterData);
    } catch (err) {
      setError('Failed to load team details. Please check your API connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, [teamId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadTeamData} />;
  if (!team) return <ErrorMessage message="Team not found" />;

  const starters = roster.filter(p => p.status === 'starter');
  const bench = roster.filter(p => p.status === 'bench');
  const winPercentage = ((team.wins / (team.wins + team.losses)) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="h-64 flex items-center justify-center relative"
        style={{ backgroundColor: team.primaryColor }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-2">
            {team.city} {team.name}
          </h1>
          <p className="text-xl opacity-90">{team.conference} Conference · {team.division} Division</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Teams
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Record</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{team.wins}-{team.losses}</span>
              <span className="text-lg text-gray-500">({winPercentage}%)</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Roster Size</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900">{roster.length}</div>
            <p className="text-sm text-gray-500 mt-1">Active Players</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Team Colors</h3>
            <div className="flex gap-3">
              <div className="flex-1">
                <div
                  className="h-16 rounded-lg mb-2"
                  style={{ backgroundColor: team.primaryColor }}
                ></div>
                <p className="text-xs text-gray-500 text-center">Primary</p>
              </div>
              <div className="flex-1">
                <div
                  className="h-16 rounded-lg mb-2"
                  style={{ backgroundColor: team.secondaryColor }}
                ></div>
                <p className="text-xs text-gray-500 text-center">Secondary</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Starting Lineup</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {starters.map((player) => (
              <div
                key={player.id}
                onClick={() => navigate(`/players/${player.id}`)}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 mb-1">#{player.jerseyNumber}</div>
                  <div className="font-semibold text-gray-900">{player.firstName} {player.lastName}</div>
                  <div className="text-sm text-gray-500">{player.position}</div>
                  <div className="mt-2 pt-2 border-t text-sm">
                    <div>{player.stats.ppg} PPG</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Bench</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bench.map((player) => (
              <div
                key={player.id}
                onClick={() => navigate(`/players/${player.id}`)}
                className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-gray-600">#{player.jerseyNumber}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">
                      {player.firstName} {player.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{player.position}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
