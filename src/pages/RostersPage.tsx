import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Team } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useRouter } from '../utils/router';
import { Users } from 'lucide-react';

export const RostersPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { navigate } = useRouter();

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getTeams();
      setTeams(data);
    } catch (err) {
      setError('Failed to load teams. Please check your API connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadTeams} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Team Rosters</h1>
          <p className="text-gray-600">View depth charts and rosters for all NBA teams</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => navigate(`/teams/${team.id}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden"
            >
              <div
                className="h-24 flex items-center justify-between px-6"
                style={{ backgroundColor: team.primaryColor }}
              >
                <div className="text-white">
                  <h3 className="text-xl font-bold">
                    {team.city} {team.name}
                  </h3>
                  <p className="text-sm opacity-90">{team.conference} Conference</p>
                </div>
                <Users className="w-8 h-8 text-white opacity-70" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">View full roster and depth chart</div>
                  <div className="text-sm font-semibold">
                    <span className="text-green-600">{team.wins}W</span>
                    <span className="text-gray-400 mx-1">-</span>
                    <span className="text-red-600">{team.losses}L</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
