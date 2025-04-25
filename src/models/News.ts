import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  article_id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  source: string;
  url: string;
  imageUrl: string;
  publishedAt: Date;
  category: string;
  isBreaking: boolean;
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    article_id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    author: { type: String, default: 'Unknown' },
    source: { type: String, required: true },
    url: { type: String, required: true },
    imageUrl: { type: String },
    publishedAt: { type: Date, required: true },
    category: { type: String, required: true, index: true },
    isBreaking: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Create indexes for common queries
NewsSchema.index({ publishedAt: -1 });
NewsSchema.index({ isTrending: 1, publishedAt: -1 });
NewsSchema.index({ isBreaking: 1, publishedAt: -1 });

export const News = mongoose.model<INews>('News', NewsSchema);