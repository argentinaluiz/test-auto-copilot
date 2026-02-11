import { Application, Request, Response, Router } from 'express';
import { IndexController } from '../controllers/index';
import { BlogController } from '../controllers/BlogController';
import { database } from '../config/database';
import { BlogRepository } from '../repositories/blog/BlogRepository';
import { ListBlogsUseCase } from '../useCases/blog/ListBlogsUseCase';
import { blogRoutes } from './blogs.routes';

const indexController = new IndexController();

// Initialize blog dependencies following Clean Architecture
const blogRepository = new BlogRepository();
const listBlogsUseCase = new ListBlogsUseCase(blogRepository);
const blogController = new BlogController(listBlogsUseCase);

export function setRoutes(app: Application) {
    app.get('/', indexController.getIndex.bind(indexController));
    
    // Blog routes
    const router = Router();
    blogRoutes(router, blogController);
    app.use('/api', router);
    
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
}