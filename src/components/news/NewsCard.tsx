import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bookmark, Share2, MessageSquare } from 'lucide-react';
import { NewsItem } from '../../types';
import { getCategoryColorClasses } from '../../services/categoryService';
import { motion } from 'framer-motion';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { bg: categoryBg, text: categoryText } = getCategoryColorClasses(news.category);
  const timeAgo = formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true });
  
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const shareNews = () => {
    // In a real app, this would use the Web Share API or a custom share dialog
    console.log('Sharing news:', news.title);
    alert(`Sharing: ${news.title}`);
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden ${
        news.isNew ? 'ring-2 ring-primary-500 animate-fade-in' : ''
      }`}
    >
      <div className="flex flex-col md:flex-row">
        {news.imageUrl && (
          <div className="md:w-1/3 flex-shrink-0">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-48 md:h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className={`flex-1 p-4 ${!news.imageUrl ? 'md:w-full' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryBg} ${categoryText}`}>
                {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
              </span>
              {news.isBreaking && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  Breaking
                </span>
              )}
              {news.isTrending && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-300">
                  Trending
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo}</span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {news.title}
            {news.isNew && (
              <span className="ml-2 inline-block w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
            )}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{news.description}</p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {news.source}
              </span>
              <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {news.author}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button 
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Comment"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={shareNews}
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isBookmarked 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={toggleBookmark}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;