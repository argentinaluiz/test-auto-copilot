export interface RequestWithUser extends Express.Request {
    user?: any; // Define the user type as needed
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}