import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Team } from '../types';
import { TeamCard } from '../components/TeamCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Filter } from 'lucide-react';

export const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conferenceFilter, setConferenceFilter] = useState<'All' | 'Eastern' | 'Western'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getTeams();
      setTeams(data);
      setFilteredTeams(data);
    } catch (err) {
      setError('Failed to load teams. Please check your API connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    let filtered = teams;

    if (conferenceFilter !== 'All') {
      filtered = filtered.filter((team) => team.conference === conferenceFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTeams(filtered);
  }, [conferenceFilter, searchTerm, teams]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadTeams} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">NBA Teams</h1>
          <p className="text-gray-600">Explore all 30 NBA teams</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={conferenceFilter}
                onChange={(e) => setConferenceFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Conferences</option>
                <option value="Eastern">Eastern Conference</option>
                <option value="Western">Western Conference</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No teams found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
