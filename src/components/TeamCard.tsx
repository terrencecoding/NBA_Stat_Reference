import { Team } from '../types';
import { useRouter } from '../utils/router';

interface TeamCardProps {
  team: Team;
}

export const TeamCard = ({ team }: TeamCardProps) => {
  const { navigate } = useRouter();

  return (
    <div
      onClick={() => navigate(`/teams/${team.id}`)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
    >
      <div
        className="h-32 flex items-center justify-center"
        style={{ backgroundColor: team.primaryColor }}
      >
        <div className="text-white text-6xl font-bold opacity-20">
          {team.abbreviation}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1">
          {team.city} {team.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          {team.conference} · {team.division}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold text-green-600">{team.wins}W</span>
            <span className="text-gray-400 mx-1">-</span>
            <span className="font-semibold text-red-600">{team.losses}L</span>
          </div>
          <div className="text-xs text-gray-500">
            {((team.wins / (team.wins + team.losses)) * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};
