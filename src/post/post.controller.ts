import { Controller, Get, Param } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPosts() {
    return {
      status: 200,
      message: 'Posts retrieved successfully',
      data: await this.postService.getAllPosts(),
    };
  }

  @Get(':id')
  async getPostById(@Param('id') id: number) {
    const post = await this.postService.getPostById(id);
    if (!post) {
      return {
        status: 404,
        message: 'Post not found',
      };
    }
    return {
      status: 200,
      message: 'Post retrieved successfully',
      data: post,
    };
  }
}
