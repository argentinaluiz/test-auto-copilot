import { Router } from 'express';
import { BlogController } from '../controllers/BlogController';

/**
 * Blog routes
 * Separate route file by domain following Single Responsibility
 */
export const blogRoutes = (router: Router, controller: BlogController) => {
  router.get('/blogs', controller.list.bind(controller));
};
