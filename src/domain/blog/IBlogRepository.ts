import { Blog } from './Blog';

/**
 * Blog repository interface
 * Following Dependency Inversion Principle - depend on abstractions
 */
export interface IBlogRepository {
  findAll(): Promise<Blog[]>;
  findById(id: number): Promise<Blog | null>;
  create(data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog>;
}
