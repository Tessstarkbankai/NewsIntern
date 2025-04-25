import React from 'react';

const NewsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 flex-shrink-0">
          <div className="h-48 md:h-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCardSkeleton;