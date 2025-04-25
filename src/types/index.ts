export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  source: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  category: string;
  isBreaking?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    categories: string[];
    sources: string[];
  };
}

export interface NewsState {
  items: NewsItem[];
  trending: NewsItem[];
  topStories: NewsItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

export interface CategoryState {
  items: Category[];
  selectedCategory: string;
  loading: boolean;
  error: string | null;
}

export interface UserState {
  user: User | null;
  preferences: {
    categories: string[];
    sources: string[];
    theme: 'light' | 'dark';
  };
  loading: boolean;
  error: string | null;
}

export interface NewsResponse {
  items: NewsItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}