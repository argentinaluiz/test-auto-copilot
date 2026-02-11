import { Application, Request, Response, Router } from 'express';
import { IndexController } from '../controllers/index';
import { PostController } from '../controllers/post.controller';
import { database } from '../config/database';
import { PostRepository } from '../repositories/post.repository';
import { ListPostsUseCase } from '../use-cases/list-posts.use-case';
import { postRoutes } from './posts.routes';

const indexController = new IndexController();

// Dependency injection setup
const postRepository = new PostRepository();
const listPostsUseCase = new ListPostsUseCase(postRepository);
const postController = new PostController(listPostsUseCase);

export function setRoutes(app: Application) {
    const router = Router();
    
    app.get('/', indexController.getIndex.bind(indexController));
    
    // Health check endpoint
    app.get('/health', async (req: Request, res: Response) => {
        try {
            const isDbConnected = await database.isConnected();
            
            if (isDbConnected) {
                res.status(200).json({
                    status: 'ok',
                    database: 'connected',
                    timestamp: new Date().toISOString()
                });
            } else {
                res.status(503).json({
                    status: 'degraded',
                    database: 'disconnected',
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            res.status(503).json({
                status: 'error',
                database: 'error',
                timestamp: new Date().toISOString()
            });
        }
    });
    
    // Register domain routes
    postRoutes(router, postController);
    
    // Mount router
    app.use('/api', router);
}