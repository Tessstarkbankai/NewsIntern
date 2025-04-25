import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchNews, loadMore, clearNewIndicators } from '../../store/slices/newsSlice';
import NewsCard from './NewsCard';
import NewsCardSkeleton from './NewsCardSkeleton';
import { NewsItem } from '../../types';
import { Newspaper } from 'lucide-react';

const NewsFeed: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, hasMore, page } = useSelector((state: RootState) => state.news);
  const { selectedCategory } = useSelector((state: RootState) => state.categories);
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Clear new indicators after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(clearNewIndicators());
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [items, dispatch]);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        dispatch(loadMore());
        dispatch(fetchNews(selectedCategory));
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, dispatch, selectedCategory]);

  // Click handler for "Load More" button
  const handleLoadMore = () => {
    dispatch(loadMore());
    dispatch(fetchNews(selectedCategory));
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <Newspaper className="w-5 h-5 mr-2" />
          Latest News
          {selectedCategory !== 'all' && (
            <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              • {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            </span>
          )}
        </h2>
      </div>

      {items.length === 0 && !loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <Newspaper className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No news found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            No news articles available for this category. Try selecting a different category.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item: NewsItem, index: number) => {
            if (items.length === index + 1 && hasMore) {
              return (
                <div ref={lastElementRef} key={item.id}>
                  <NewsCard news={item} />
                </div>
              );
            } else {
              return <NewsCard key={item.id} news={item} />;
            }
          })}
          
          {loading && (
            <>
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </>
          )}
          
          {hasMore && items.length > 0 && !loading && (
            <div className="text-center mt-6">
              <button
                onClick={handleLoadMore}
                className="btn btn-secondary"
              >
                Load More
              </button>
            </div>
          )}
          
          {!hasMore && items.length > 0 && (
            <div className="text-center p-4 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-6">
              You've reached the end of the feed
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;