// src/App.tsx

import { useEffect } from 'react';
import { useMovieStore } from './store/useMovieStore';
import { usePeerStore } from './store/usePeerStore';
import { MainLayout } from './components/MainLayout';
import { HomeView } from './views/HomeView';
import { MyListView } from './views/MyListView';
import { CommunityView } from './views/CommunityView';
import { MovieFormModal } from './components/MovieFormModal';
import { WelcomeModal } from './components/WelcomeModal';

export default function App() {
  const { fetchMovies, activeTab, isAddModalOpen, setIsAddModalOpen } = useMovieStore();
  const { initPeer } = usePeerStore();

  useEffect(() => {
    fetchMovies();
    initPeer();
  }, [fetchMovies, initPeer]);

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'my-list':
        return <MyListView />;
      case 'community':
        return <CommunityView />;
      default:
        return <MyListView />;
    }
  };

  return (
    <MainLayout>
      {renderView()}
      <WelcomeModal />
      {/* Modal global accesible desde cualquier pestaña */}
      <MovieFormModal
        opened={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </MainLayout>
  );
}