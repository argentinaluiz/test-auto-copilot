import { Blog } from '../../domain/blog/Blog';
import { IBlogRepository } from '../../domain/blog/IBlogRepository';

/**
 * List Blogs Use Case
 * Application business rules - orchestrates the flow
 * Following Single Responsibility Principle
 */
export class ListBlogsUseCase {
  constructor(private blogRepository: IBlogRepository) {}

  async execute(): Promise<Blog[]> {
    return await this.blogRepository.findAll();
  }
}
