import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './slices/newsSlice';
import categoryReducer from './slices/categorySlice';
import userReducer from './slices/userSlice';
import { setupSocketListeners } from '../services/socketService';

export const store = configureStore({
  reducer: {
    news: newsReducer,
    categories: categoryReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['news/addNewsItem', 'news/updateNewsItem'],
      },
    }),
});

// Setup socket listeners after store creation
setupSocketListeners(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;