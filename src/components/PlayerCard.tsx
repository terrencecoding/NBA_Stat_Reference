import { Player } from '../types';
import { useRouter } from '../utils/router';
import { User } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  const { navigate } = useRouter();

  return (
    <div
      onClick={() => navigate(`/players/${player.id}`)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
    >
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <User className="w-24 h-24 text-gray-400" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {player.firstName} {player.lastName}
            </h3>
            <p className="text-sm text-gray-500">
              {player.position} · #{player.jerseyNumber}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{player.stats.ppg}</div>
            <div className="text-xs text-gray-500">PPG</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{player.stats.rpg}</div>
            <div className="text-xs text-gray-500">RPG</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{player.stats.apg}</div>
            <div className="text-xs text-gray-500">APG</div>
          </div>
        </div>
      </div>
    </div>
  );
};
