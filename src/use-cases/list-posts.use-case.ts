import { IPostRepository, Post } from '../domain/post.interface';

export class ListPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(): Promise<Post[]> {
    return this.postRepository.findAll();
  }
}
