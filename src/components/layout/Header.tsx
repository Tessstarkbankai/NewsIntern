import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Bell, Sun, Moon, Menu, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { searchNewsApi } from '../../services/newsService';
import { addNewsItem } from '../../store/slices/newsSlice';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const results = await searchNewsApi(searchQuery);
        // In a real app, you'd dispatch an action to update the news state
        // For this demo, we'll just log the results
        console.log('Search results:', results);
        
        // Clear the search query
        setSearchQuery('');
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              className="block lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="flex items-center">
              <span className="text-primary-600 dark:text-primary-400">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.5 12H16.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 7.5L7 12L11 16.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white ml-2">
                Pulse<span className="text-primary-600 dark:text-primary-400">News</span>
              </h1>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="search"
                  className="w-full p-2 pl-10 text-sm border rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Search for news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                // Simulate a notification by creating a breaking news item
                const now = new Date();
                dispatch(
                  addNewsItem({
                    id: `notification-${now.getTime()}`,
                    title: 'Breaking News Alert',
                    description: 'This is a simulated breaking news notification.',
                    content: 'This is simulated content for the breaking news notification.',
                    author: 'Pulse News',
                    source: 'System',
                    url: '#',
                    imageUrl: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg',
                    publishedAt: now.toISOString(),
                    category: 'breaking',
                    isBreaking: true,
                  })
                );
              }}
              className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search - only visible on mobile */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="search"
                className="w-full p-2 pl-10 text-sm border rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Search for news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu - only visible on mobile when menu is open */}
        {isMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-2">
              <a href="#" className="py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                Home
              </a>
              <a href="#" className="py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                Trending
              </a>
              <a href="#" className="py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                Bookmarks
              </a>
              <a href="#" className="py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                Settings
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;