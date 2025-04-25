import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserState, User } from '../../types';
import { fetchUserPreferencesApi, updateUserPreferencesApi } from '../../services/userService';

const initialState: UserState = {
  user: null,
  preferences: {
    categories: [],
    sources: [],
    theme: 'light',
  },
  loading: false,
  error: null,
};

export const fetchUserPreferences = createAsyncThunk(
  'user/fetchUserPreferences',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetchUserPreferencesApi(userId);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (
    { userId, preferences }: { userId: string; preferences: Partial<UserState['preferences']> },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateUserPreferencesApi(userId, preferences);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleCategorySubscription: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      const index = state.preferences.categories.indexOf(category);
      
      if (index === -1) {
        state.preferences.categories.push(category);
      } else {
        state.preferences.categories.splice(index, 1);
      }
    },
    toggleSourceSubscription: (state, action: PayloadAction<string>) => {
      const source = action.payload;
      const index = state.preferences.sources.indexOf(source);
      
      if (index === -1) {
        state.preferences.sources.push(source);
      } else {
        state.preferences.sources.splice(index, 1);
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.preferences.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.preferences.categories = action.payload.preferences.categories;
        state.preferences.sources = action.payload.preferences.sources;
      })
      .addCase(fetchUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.preferences.categories = action.payload.preferences.categories;
        state.preferences.sources = action.payload.preferences.sources;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  toggleCategorySubscription, 
  toggleSourceSubscription, 
  setTheme 
} = userSlice.actions;

export default userSlice.reducer;