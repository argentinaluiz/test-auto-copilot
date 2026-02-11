/**
 * Blog domain entity
 * Pure TypeScript - no framework dependencies
 */
export interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
