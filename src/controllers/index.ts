export class IndexController {
    public getIndex(req: Request, res: Response): void {
        res.send('Welcome to the Express TypeScript App!');
    }
}