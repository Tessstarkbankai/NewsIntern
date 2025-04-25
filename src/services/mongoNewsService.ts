import { News, INews } from '../models/News';
import { NewsResponse } from '../types';

export const saveNewsToDb = async (newsItems: any[]): Promise<void> => {
  if (!Array.isArray(newsItems) || newsItems.length === 0) {
    console.warn('No news items to save');
    return;
  }

  try {
    const newsDocuments = newsItems.map(item => {
      if (!item.article_id || !item.title || !item.source_id || !item.link || !item.pubDate) {
        console.warn('Skipping invalid news item:', item);
        return null;
      }
      
      return {
        article_id: item.article_id,
        title: item.title,
        description: item.description || '',
        content: item.content || '',
        author: item.creator?.join(', ') || 'Unknown',
        source: item.source_id,
        url: item.link,
        imageUrl: item.image_url || '',
        publishedAt: new Date(item.pubDate),
        category: item.category?.[0] || 'general',
        isBreaking: item.keywords?.includes('breaking'),
        isTrending: false
      };
    }).filter(Boolean);

    if (newsDocuments.length === 0) {
      console.warn('No valid news items to save after filtering');
      return;
    }

    const result = await News.insertMany(newsDocuments, { 
      ordered: false,
      lean: true
    });
    console.log(`Successfully saved ${result.length} news items to database`);
  } catch (error: any) {
    if (error.code === 11000) {
      console.log('Some documents already exist in database - skipping duplicates');
      return;
    }
    console.error('Error saving news to database:', error);
    throw error;
  }
};

export const getNewsFromDb = async (category: string, page = 1): Promise<NewsResponse> => {
  try {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const query = category !== 'all' ? { category } : {};
    
    const [items, totalItems] = await Promise.all([
      News.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      News.countDocuments(query)
    ]);

    return {
      items,
      totalItems,
      page,
      pageSize,
      hasMore: (page * pageSize) < totalItems
    };
  } catch (error) {
    console.error('Error fetching news from database:', error);
    throw error;
  }
};

export const getTrendingNewsFromDb = async (): Promise<NewsResponse> => {
  try {
    const items = await News.find({ isTrending: true })
      .sort({ publishedAt: -1 })
      .limit(20)
      .lean();

    return {
      items,
      totalItems: items.length,
      page: 1,
      pageSize: 20,
      hasMore: false
    };
  } catch (error) {
    console.error('Error fetching trending news from database:', error);
    throw error;
  }
};

export const searchNewsInDb = async (query: string): Promise<NewsResponse> => {
  try {
    const searchRegex = new RegExp(query, 'i');
    const items = await News.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { content: searchRegex }
      ]
    })
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean();

    return {
      items,
      totalItems: items.length,
      page: 1,
      pageSize: 10,
      hasMore: false
    };
  } catch (error) {
    console.error('Error searching news in database:', error);
    throw error;
  }
};