import { Blog } from '../../domain/blog/Blog';
import { IBlogRepository } from '../../domain/blog/IBlogRepository';
import { prisma } from '../../config/database';

/**
 * Blog repository implementation using Prisma
 * Implements the repository interface from domain layer
 */
export class BlogRepository implements IBlogRepository {
  async findAll(): Promise<Blog[]> {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return blogs;
  }

  async findById(id: number): Promise<Blog | null> {
    const blog = await prisma.blog.findUnique({
      where: { id }
    });
    return blog;
  }

  async create(data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog> {
    const blog = await prisma.blog.create({
      data
    });
    return blog;
  }
}
