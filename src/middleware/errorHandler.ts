export const errorHandler = (err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'An unexpected error occurred.',
        error: process.env.NODE_ENV === 'development' ? err : {},
    });
};