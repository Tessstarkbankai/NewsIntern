import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import NewsFeed from './components/news/NewsFeed';
import TrendingNews from './components/news/TrendingNews';
import TopStories from './components/news/TopStories';
import { connectSocket, disconnectSocket } from './services/socketService';
import { RootState } from './store';
import { fetchCategories } from './store/slices/categorySlice';
import { AppDispatch } from './store/index';
import { fetchNews } from './store/slices/newsSlice';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCategory } = useSelector((state: RootState) => state.categories);
  const { theme } = useTheme();
  
  useEffect(() => {
    dispatch(fetchCategories());
    
    // Connect to websocket
    connectSocket();
    
    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(fetchNews(selectedCategory));
  }, [dispatch, selectedCategory]);

  return (
    <div className={`min-h-screen ${theme}`}>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-1/4">
            <Sidebar />
          </aside>
          <main className="flex-1">
            <TopStories />
            <NewsFeed />
          </main>
          <aside className="lg:w-1/4">
            <TrendingNews />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;