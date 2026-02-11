export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostRepository {
  findAll(): Promise<Post[]>;
  findById(id: number): Promise<Post | null>;
  create(data: CreatePostData): Promise<Post>;
  update(id: number, data: UpdatePostData): Promise<Post>;
  delete(id: number): Promise<void>;
}

export interface CreatePostData {
  title: string;
  content: string;
  published?: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
}
