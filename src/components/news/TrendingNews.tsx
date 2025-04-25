import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchTrendingNews } from '../../store/slices/newsSlice';
import { formatDistanceToNow } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import { NewsItem } from '../../types';
import { getCategoryColorClasses } from '../../services/categoryService';

const TrendingNewsItem: React.FC<{ news: NewsItem; rank: number }> = ({ news, rank }) => {
  const timeAgo = formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true });
  const { bg: categoryBg, text: categoryText } = getCategoryColorClasses(news.category);
  
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 font-bold rounded-full w-7 h-7 flex items-center justify-center">
        {rank}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {news.title}
        </h4>
        <div className="mt-1 flex items-center">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${categoryBg} ${categoryText}`}>
            {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
          </span>
          <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

const TrendingNewsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start space-x-3 p-3">
          <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-full w-7 h-7"></div>
          <div className="min-w-0 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="flex items-center">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="mx-1.5 text-transparent">•</div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TrendingNews: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { trending, loading } = useSelector((state: RootState) => state.news);
  
  useEffect(() => {
    dispatch(fetchTrendingNews());
    
    // Refresh trending news every 5 minutes
    const interval = setInterval(() => {
      dispatch(fetchTrendingNews());
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  return (
    <div className="w-full lg:pl-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-accent-500" />
          Trending Now
        </h2>
        
        {loading && trending.length === 0 ? (
          <TrendingNewsSkeleton />
        ) : (
          <div className="space-y-1">
            {trending.slice(0, 5).map((news, index) => (
              <TrendingNewsItem key={news.id} news={news} rank={index + 1} />
            ))}
            
            {trending.length === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No trending news available
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subscribe</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Get the latest news delivered directly to your inbox.
        </p>
        <form className="space-y-3">
          <div>
            <input
              type="email"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              placeholder="Your email address"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrendingNews;