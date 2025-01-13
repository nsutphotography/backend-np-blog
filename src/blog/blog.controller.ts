import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as debugLib from 'debug';

const debug = debugLib('app:BlogController');

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createBlog(
    @Body('title') title: string,
    @Body('description') description: string,
    @Req() req: any, // `req.user` contains user info from JWT
  ) {
    const userId = req.user.userId;
    debug('Creating blog with title: %s by user: %s', title, userId);

    try {
      const blog = await this.blogService.createBlog(title, description, userId);
    //   debug('Blog created successfully with ID: %s', blog.id);
      return blog;
    } catch (error) {
      debug('Error creating blog: %s', error.message);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-blogs')
  async getUserBlogs(@Req() req: any) {
    const userId = req.user.userId;
    debug('Fetching blogs for user: %s', userId);

    try {
      const blogs = await this.blogService.getBlogsByUser(userId);
      debug('Fetched %d blogs for user: %s', blogs.length, userId);
      return blogs;
    } catch (error) {
      debug('Error fetching blogs for user: %s - %s', userId, error.message);
      throw error;
    }
  }
  @Get('all')
  async getAllBlogs() {
    debug('Fetching all blogs');
    
    try {
      const blogs = await this.blogService.getAllBlogs();
      debug('Fetched %d blogs', blogs.length);
      return blogs;
    } catch (error) {
      debug('Error fetching blogs - %s', error.message);
      throw error;
    }
  }
}
