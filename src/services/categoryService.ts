import axios from 'axios';
import { Category } from '../types';
import { NewspaperIcon, BriefcaseIcon, TrophyIcon, BuildingIcon as BuildingGovernmentIcon, FilmIcon, HeartPulseIcon, FlaskConicalIcon, GlobeIcon } from 'lucide-react';

// In a real application, this would come from environment variables
const API_URL = 'http://localhost:3001/api';

// For demonstration purposes, we'll mock the API calls
// In a real application, you would connect to your backend API
export const fetchCategoriesApi = async (): Promise<Category[]> => {
  try {
    // In a real application:
    // const response = await axios.get(`${API_URL}/categories`);
    // return response.data;
    
    // For demonstration, we'll mock the API response
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    return [
      {
        id: 'all',
        name: 'All News',
        slug: 'all',
        color: 'gray',
        icon: 'GlobeIcon'
      },
      {
        id: 'technology',
        name: 'Technology',
        slug: 'technology',
        color: 'blue',
        icon: 'NewspaperIcon'
      },
      {
        id: 'business',
        name: 'Business',
        slug: 'business',
        color: 'green',
        icon: 'BriefcaseIcon'
      },
      {
        id: 'sports',
        name: 'Sports',
        slug: 'sports',
        color: 'orange',
        icon: 'TrophyIcon'
      },
      {
        id: 'politics',
        name: 'Politics',
        slug: 'politics',
        color: 'red',
        icon: 'BuildingGovernmentIcon'
      },
      {
        id: 'entertainment',
        name: 'Entertainment',
        slug: 'entertainment',
        color: 'purple',
        icon: 'FilmIcon'
      },
      {
        id: 'health',
        name: 'Health',
        slug: 'health',
        color: 'emerald',
        icon: 'HeartPulseIcon'
      },
      {
        id: 'science',
        name: 'Science',
        slug: 'science',
        color: 'indigo',
        icon: 'FlaskConicalIcon'
      }
    ];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

export const getCategoryIcon = (iconName: string | undefined) => {
  if (!iconName) return GlobeIcon;
  
  const icons: Record<string, React.ComponentType> = {
    NewspaperIcon,
    BriefcaseIcon,
    TrophyIcon,
    BuildingGovernmentIcon,
    FilmIcon,
    HeartPulseIcon,
    FlaskConicalIcon,
    GlobeIcon
  };
  
  return icons[iconName] || GlobeIcon;
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    all: 'gray',
    technology: 'blue',
    business: 'green',
    sports: 'orange',
    politics: 'red',
    entertainment: 'purple',
    health: 'emerald',
    science: 'indigo'
  };
  
  return colors[category] || 'gray';
};

export const getCategoryColorClasses = (category: string): { bg: string, text: string, hover: string } => {
  const color = getCategoryColor(category);
  
  const colorMap: Record<string, { bg: string, text: string, hover: string }> = {
    gray: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-800 dark:text-gray-200',
      hover: 'hover:bg-gray-200 dark:hover:bg-gray-700'
    },
    blue: {
      bg: 'bg-primary-100 dark:bg-primary-900',
      text: 'text-primary-800 dark:text-primary-300',
      hover: 'hover:bg-primary-200 dark:hover:bg-primary-800'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-800 dark:text-green-300',
      hover: 'hover:bg-green-200 dark:hover:bg-green-800'
    },
    orange: {
      bg: 'bg-accent-100 dark:bg-accent-900',
      text: 'text-accent-800 dark:text-accent-300',
      hover: 'hover:bg-accent-200 dark:hover:bg-accent-800'
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-800 dark:text-red-300',
      hover: 'hover:bg-red-200 dark:hover:bg-red-800'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900',
      text: 'text-purple-800 dark:text-purple-300',
      hover: 'hover:bg-purple-200 dark:hover:bg-purple-800'
    },
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900',
      text: 'text-emerald-800 dark:text-emerald-300',
      hover: 'hover:bg-emerald-200 dark:hover:bg-emerald-800'
    },
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-900',
      text: 'text-indigo-800 dark:text-indigo-300',
      hover: 'hover:bg-indigo-200 dark:hover:bg-indigo-800'
    }
  };
  
  return colorMap[color] || colorMap.gray;
};