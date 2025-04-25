import { io, Socket } from 'socket.io-client';
import { Store } from '@reduxjs/toolkit';
import { addNewsItem, updateNewsItem } from '../store/slices/newsSlice';
import { NewsItem } from '../types';

let socket: Socket;

export const connectSocket = (): void => {
  socket = io('http://localhost:3001');
  console.log('Connecting to news socket server...');
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    console.log('Disconnected from news socket server');
  }
};

export const setupSocketListeners = (store: Store): void => {
  if (!socket) return;

  socket.on('connect', () => {
    console.log('Connected to news socket server');
  });

  socket.on('news-update', (newsItem) => {
    store.dispatch(addNewsItem(newsItem));
  });

  socket.on('news-update-item', (newsItem) => {
    store.dispatch(updateNewsItem(newsItem));
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from news socket server');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
};

export const subscribeToCategory = (category: string): void => {
  if (socket) {
    socket.emit('subscribe-category', category);
    console.log(`Subscribed to category: ${category}`);
  }
};

export const unsubscribeFromCategory = (category: string): void => {
  if (socket) {
    socket.emit('unsubscribe-category', category);
    console.log(`Unsubscribed from category: ${category}`);
  }
};