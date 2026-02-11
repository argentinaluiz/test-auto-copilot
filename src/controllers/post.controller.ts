import { Request, Response } from 'express';
import { ListPostsUseCase } from '../use-cases/list-posts.use-case';
import { ApiResponse } from '../types';
import { Post } from '../domain/post.interface';

export class PostController {
  constructor(private listPostsUseCase: ListPostsUseCase) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const posts = await this.listPostsUseCase.execute();
      
      const response: ApiResponse<Post[]> = {
        success: true,
        data: posts
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<Post[]> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      
      res.status(500).json(response);
    }
  }
}
