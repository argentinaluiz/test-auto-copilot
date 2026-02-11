import { Application, Request, Response } from 'express';
import { IndexController } from '../controllers/index';
import { database } from '../config/database';

const indexController = new IndexController();

export function setRoutes(app: Application) {
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
}