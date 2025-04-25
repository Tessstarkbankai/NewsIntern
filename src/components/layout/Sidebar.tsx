import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setSelectedCategory } from '../../store/slices/categorySlice';
import { Category } from '../../types';
import { getCategoryIcon, getCategoryColorClasses } from '../../services/categoryService';
import { Newspaper, Bookmark, Settings, TrendingUp } from 'lucide-react';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { items: categories, selectedCategory } = useSelector(
    (state: RootState) => state.categories
  );

  const handleCategoryClick = (category: string) => {
    dispatch(setSelectedCategory(category));
  };

  return (
    <aside className="w-full lg:pr-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Main Menu</h2>
          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-200"
            >
              <Newspaper className="mr-3 h-5 w-5" />
              News Feed
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <TrendingUp className="mr-3 h-5 w-5" />
              Trending
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Bookmark className="mr-3 h-5 w-5" />
              Bookmarks
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </a>
          </nav>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Categories</h2>
          <div className="space-y-1">
            {categories.map((category: Category) => {
              const Icon = getCategoryIcon(category.icon);
              const colorClasses = getCategoryColorClasses(category.slug);
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedCategory === category.slug
                      ? `${colorClasses.bg} ${colorClasses.text}`
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {category.name}
                  {category.slug === 'technology' && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-xs font-medium text-white">
                      3
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;