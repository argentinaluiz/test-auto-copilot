import { prisma } from '../config/database';
import { IPostRepository, Post, CreatePostData, UpdatePostData } from '../domain/post.interface';

export class PostRepository implements IPostRepository {
  async findAll(): Promise<Post[]> {
    return prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findById(id: number): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id }
    });
  }

  async create(data: CreatePostData): Promise<Post> {
    return prisma.post.create({
      data
    });
  }

  async update(id: number, data: UpdatePostData): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.post.delete({
      where: { id }
    });
  }
}
