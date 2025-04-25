import axios from 'axios';
import { NewsResponse } from '../types';
import { io, Socket } from 'socket.io-client';
import { connectDB } from '../config/db';
const socket: Socket = io();
import { saveNewsToDb, getNewsFromDb, getTrendingNewsFromDb, searchNewsInDb } from './mongoNewsService';

import dotenv from 'dotenv';

dotenv.config();


const NEWS_API_KEY = process.env.NEWS_API_KEY || '';
const NEWS_API_URL = process.env.NEWS_API_URL || 'https://newsapi.org/v2';

// Initialize MongoDB connection
connectDB().catch(console.error);

// Real API implementation using NewsAPI.org
export const fetchNewsApi = async (category: string, page = 1): Promise<NewsResponse> => {
  try {
    // First try to get news from database
    try {
      const dbNews = await getNewsFromDb(category, page);
      if (dbNews.items.length > 0) {
        return dbNews;
      }
    } catch (dbError) {
      console.error('Error fetching from database, falling back to API:', dbError);
    }

    if (!NEWS_API_KEY) {
      throw new Error('API key is required');
    }

    const response = await axios.get(`${NEWS_API_URL}/top-headlines`, {
      params: {
        apiKey: NEWS_API_KEY,
        category: category !== 'all' ? category : undefined,
        language: 'en',
        page,
        pageSize: 10
      }
    });

    if (!response.data.articles || !Array.isArray(response.data.articles)) {
      throw new Error('Invalid API response format');
    }

    // Save the fetched news to database
    await saveNewsToDb(response.data.articles);

    return {
      items: response.data.articles.map((item: any) => ({
        id: item.url,
        title: item.title,
        description: item.description,
        content: item.content,
        author: item.author || 'Unknown',
        source: item.source.name,
        url: item.url,
        imageUrl: item.urlToImage,
        publishedAt: item.publishedAt,
        category: category,
        isBreaking: false,
        isTrending: false
      })),
      totalItems: response.data.totalResults,
      page,
      pageSize: 10,
      hasMore: page * 10 < response.data.totalResults
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const fetchTrendingNewsApi = async (): Promise<NewsResponse> => {
  try {
    // First try to get trending news from database
    try {
      const dbNews = await getTrendingNewsFromDb();
      if (dbNews.items.length > 0) {
        return dbNews;
      }
    } catch (dbError) {
      console.error('Error fetching trending from database, falling back to API:', dbError);
    }

    if (!NEWS_API_KEY) {
      throw new Error('API key is required');
    }

    const response = await axios.get(`${NEWS_API_URL}/everything`, {
      params: {
        apiKey: NEWS_API_KEY,
        q: 'trending OR viral OR breaking',
        language: 'en',
        sortBy: 'popularity',
        pageSize: 20,
        page: 1
      }
    });

    if (!response.data.articles || !Array.isArray(response.data.articles)) {
      throw new Error('Invalid API response format');
    }

    // Save the fetched trending news to database
    await saveNewsToDb(response.data.articles);

    // Emit trending news to connected clients via Socket.io
    socket.emit('trending-update', response.data.articles);

    return {
      items: response.data.articles.map((item: any) => ({
        id: item.url,
        title: item.title,
        description: item.description,
        content: item.content,
        author: item.author || 'Unknown',
        source: item.source.name,
        url: item.url,
        imageUrl: item.urlToImage,
        publishedAt: item.publishedAt,
        category: 'trending',
        isBreaking: false,
        isTrending: true
      })),
      totalItems: response.data.totalResults,
      page: 1,
      pageSize: 20,
      hasMore: false
    };
  } catch (error) {
    console.error('Error fetching trending news:', error);
    throw error;
  }
};

export const searchNewsApi = async (query: string): Promise<NewsResponse> => {
  try {
    // First try to search news in database
    try {
      const dbNews = await searchNewsInDb(query);
      if (dbNews.items.length > 0) {
        return dbNews;
      }
    } catch (dbError) {
      console.error('Error searching in database, falling back to API:', dbError);
    }

    if (!NEWS_API_KEY) {
      throw new Error('API key is required');
    }

    const response = await axios.get(`${NEWS_API_URL}/everything`, {
      params: {
        apiKey: NEWS_API_KEY,
        q: query,
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 10,
        page: 1
      }
    });

    if (!response.data.articles || !Array.isArray(response.data.articles)) {
      throw new Error('Invalid API response format');
    }

    // Save the search results to database
    await saveNewsToDb(response.data.articles);

    return {
      items: response.data.articles.map((item: any) => ({
        id: item.url,
        title: item.title,
        description: item.description,
        content: item.content,
        author: item.author || 'Unknown',
        source: item.source.name,
        url: item.url,
        imageUrl: item.urlToImage,
        publishedAt: item.publishedAt,
        category: 'search',
        isBreaking: false,
        isTrending: false
      })),
      totalItems: response.data.totalResults,
      page: 1,
      pageSize: 10,
      hasMore: 10 < response.data.totalResults
    };
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};