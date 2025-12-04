import { Search } from 'lucide-react';
import { useRouter } from '../utils/router';
import { useState } from 'react';

export const Navbar = () => {
  const { navigate, currentPath } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { path: '/', label: 'Teams' },
    { path: '/players', label: 'Players' },
    { path: '/rosters', label: 'Rosters' },
    { path: '/schedule', label: 'Schedule' },
    { path: '/cba', label: 'CBA Rules' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-red-800 to-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              NBA HUB
            </button>

            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPath === item.path
                      ? 'bg-white bg-opacity-20'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teams, players..."
                className="w-64 px-4 py-2 pl-10 rounded-lg bg-white bg-opacity-20 placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-opacity-30 transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 opacity-70" />
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};
