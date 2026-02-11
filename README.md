# Express TypeScript App

This is a basic Express.js application built with TypeScript. It serves as a starting point for building web applications using the Express framework and TypeScript.

## Project Structure

```
express-typescript-app
├── src
│   ├── app.ts               # Main application file
│   ├── server.ts            # Server entry point
│   ├── controllers          # Directory for route controllers
│   │   └── index.ts         # Index controller
│   ├── routes               # Directory for route definitions
│   │   └── index.ts         # Route definitions
│   ├── middleware           # Directory for middleware functions
│   │   └── errorHandler.ts   # Error handling middleware
│   └── types                # Directory for custom types
│       └── index.ts         # Custom type definitions
├── package.json             # NPM package configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd express-typescript-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run the following command:
```
npm start
```

The server will start and listen on the specified port (default is 3000). You can access the application at `http://localhost:3000`.

## Development

For development, you can use the following command to run the application with TypeScript:
```
npm run dev
```

This will watch for changes in the TypeScript files and automatically restart the server.

## License

This project is licensed under the MIT License.