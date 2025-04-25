import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { getCategoryColorClasses } from '../../services/categoryService';

const TopStories: React.FC = () => {
  const { topStories, loading } = useSelector((state: RootState) => state.news);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? topStories.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === topStories.length - 1 ? 0 : prev + 1));
  };
  
  // Auto rotate every 7 seconds
  React.useEffect(() => {
    if (topStories.length <= 1) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 7000);
    
    return () => clearInterval(interval);
  }, [topStories.length, currentIndex]);
  
  // No stories yet
  if (loading && topStories.length === 0) {
    return (
      <div className="rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse h-64 w-full mb-6"></div>
    );
  }
  
  // No breaking news
  if (topStories.length === 0) {
    return null;
  }
  
  const currentStory = topStories[currentIndex];
  
  if (!currentStory) return null;
  
  const { bg: categoryBg, text: categoryText } = getCategoryColorClasses(currentStory.category);
  const timeAgo = formatDistanceToNow(new Date(currentStory.publishedAt), { addSuffix: true });
  
  return (
    <div className="mb-6 relative overflow-hidden rounded-xl shadow-md group">
      <div className="relative h-64 md:h-80 w-full">
        <img
          src={currentStory.imageUrl || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
          alt={currentStory.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Breaking News
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryBg} ${categoryText}`}>
              {currentStory.category.charAt(0).toUpperCase() + currentStory.category.slice(1)}
            </span>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            {currentStory.title}
          </h2>
          
          <p className="text-sm text-gray-200 mb-2 line-clamp-2 md:line-clamp-none">{currentStory.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-gray-300">
                {currentStory.source}
              </span>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-sm text-gray-300">
                {timeAgo}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      {topStories.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next story"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1">
            {topStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`mx-1 w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TopStories;