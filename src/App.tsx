import { RouterProvider, useRouter } from './utils/router';
import { Navbar } from './components/Navbar';
import { TeamsPage } from './pages/TeamsPage';
import { TeamDetailPage } from './pages/TeamDetailPage';
import { PlayersPage } from './pages/PlayersPage';
import { PlayerDetailPage } from './pages/PlayerDetailPage';
import { RostersPage } from './pages/RostersPage';
import { SchedulePage } from './pages/SchedulePage';
import { CBAPage } from './pages/CBAPage';

function AppContent() {
  const { currentPath } = useRouter();
  /* Testing Git*/
  const renderPage = () => {
    if (currentPath === '/') return <TeamsPage />;
    if (currentPath.startsWith('/teams/')) return <TeamDetailPage />;
    if (currentPath === '/players') return <PlayersPage />;
    if (currentPath.startsWith('/players/')) return <PlayerDetailPage />;
    if (currentPath === '/rosters') return <RostersPage />;
    if (currentPath === '/schedule') return <SchedulePage />;
    if (currentPath === '/cba') return <CBAPage />;

    return <TeamsPage />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

export default App;
