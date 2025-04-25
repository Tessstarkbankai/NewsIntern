import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NewsItem, NewsState, NewsResponse } from '../../types';
import { fetchNewsApi, fetchTrendingNewsApi } from '../../services/newsService';

const initialState: NewsState = {
  items: [],
  trending: [],
  topStories: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
};

export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (category: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { news: NewsState };
      const { page } = state.news;
      
      const response = await fetchNewsApi(category, page);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchTrendingNews = createAsyncThunk(
  'news/fetchTrendingNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTrendingNewsApi();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    addNewsItem: (state, action: PayloadAction<NewsItem>) => {
      const newItem = { ...action.payload, isNew: true };
      // Check if item already exists
      const existingIndex = state.items.findIndex(item => item.id === newItem.id);
      
      if (existingIndex >= 0) {
        // Update existing item
        state.items[existingIndex] = { ...newItem, isNew: true };
      } else {
        // Add to beginning of array
        state.items.unshift(newItem);
      }
      
      // Update top stories if breaking news
      if (newItem.isBreaking) {
        const existingTopStoryIndex = state.topStories.findIndex(item => item.id === newItem.id);
        if (existingTopStoryIndex >= 0) {
          state.topStories[existingTopStoryIndex] = newItem;
        } else {
          state.topStories.unshift(newItem);
          if (state.topStories.length > 5) {
            state.topStories.pop();
          }
        }
      }
      
      // Update trending if trending news
      if (newItem.isTrending) {
        const existingTrendingIndex = state.trending.findIndex(item => item.id === newItem.id);
        if (existingTrendingIndex >= 0) {
          state.trending[existingTrendingIndex] = newItem;
        } else {
          state.trending.unshift(newItem);
          if (state.trending.length > 10) {
            state.trending.pop();
          }
        }
      }
    },
    updateNewsItem: (state, action: PayloadAction<NewsItem>) => {
      const updatedItem = action.payload;
      const index = state.items.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        state.items[index] = { ...updatedItem, isNew: true };
      }
    },
    clearNewIndicators: (state) => {
      state.items = state.items.map(item => ({ ...item, isNew: false }));
    },
    loadMore: (state) => {
      state.page += 1;
    },
    resetNewsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action: PayloadAction<NewsResponse>) => {
        state.loading = false;
        // If page is 1, replace the array, otherwise append
        if (state.page === 1) {
          state.items = action.payload.items;
        } else {
          // Filter out duplicates
          const newItems = action.payload.items.filter(
            newItem => !state.items.some(item => item.id === newItem.id)
          );
          state.items = [...state.items, ...newItems];
        }
        state.hasMore = action.payload.hasMore;
        
        // Set top stories on initial load
        if (state.page === 1 && state.topStories.length === 0) {
          state.topStories = action.payload.items
            .filter(item => item.isBreaking)
            .slice(0, 5);
        }
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTrendingNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrendingNews.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload.items;
      })
      .addCase(fetchTrendingNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  addNewsItem, 
  updateNewsItem, 
  clearNewIndicators, 
  loadMore,
  resetNewsState
} = newsSlice.actions;

export default newsSlice.reducer;