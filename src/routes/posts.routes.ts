import { Router } from 'express';
import { PostController } from '../controllers/post.controller';

export const postRoutes = (router: Router, controller: PostController) => {
  router.get('/posts', controller.list.bind(controller));
};
