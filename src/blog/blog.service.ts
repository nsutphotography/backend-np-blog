import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import * as debugLib from 'debug';

const debug = debugLib('app:BlogService');

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async createBlog(title: string, description: string, userId: string): Promise<Blog> {
    debug('Creating a new blog with title: %s for user: %s', title, userId);

    try {
      const newBlog = new this.blogModel({ title, description, userId });
      const savedBlog = await newBlog.save();
      debug('Blog created successfully with ID: %s', savedBlog.id);
      return savedBlog;
    } catch (error) {
      debug('Error creating blog: %s', error.message);
      throw new InternalServerErrorException('Failed to create the blog. Please try again later.');
    }
  }

  async getBlogsByUser(userId: string): Promise<Blog[]> {
    debug('Fetching blogs for user: %s', userId);

    try {
      const blogs = await this.blogModel.find({ userId }).exec();
      debug('Fetched %d blogs for user: %s', blogs.length, userId);
      return blogs;
    } catch (error) {
      debug('Error fetching blogs for user: %s - %s', userId, error.message);
      throw new InternalServerErrorException('Failed to fetch blogs. Please try again later.');
    }
  }
  async getAllBlogs(): Promise<Blog[]> {
    debug('Fetching all blogs');

    try {
      const blogs = await this.blogModel.find().exec();
      debug('Fetched %d blogs', blogs.length);
      return blogs;
    } catch (error) {
      debug('Error fetching all blogs - %s', error.message);
      throw new InternalServerErrorException('Failed to fetch blogs. Please try again later.');
    }
  }
}
