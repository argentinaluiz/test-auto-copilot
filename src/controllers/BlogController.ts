import { Request, Response } from 'express';
import { ListBlogsUseCase } from '../useCases/blog/ListBlogsUseCase';
import { ApiResponse } from '../types';
import { Blog } from '../domain/blog/Blog';

/**
 * Blog Controller
 * Handles HTTP concerns only - request/response
 * Following Single Responsibility Principle
 */
export class BlogController {
  constructor(private listBlogsUseCase: ListBlogsUseCase) {}

  public async list(req: Request, res: Response): Promise<void> {
    try {
      const blogs = await this.listBlogsUseCase.execute();
      
      const response: ApiResponse<Blog[]> = {
        success: true,
        data: blogs
      };
      
      res.status(200).json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      const response: ApiResponse<Blog[]> = {
        success: false,
        error: errorMessage
      };
      
      res.status(500).json(response);
    }
  }
}
