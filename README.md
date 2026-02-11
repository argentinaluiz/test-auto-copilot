# Express TypeScript App

This is a basic Express.js application built with TypeScript. It serves as a starting point for building web applications using the Express framework and TypeScript.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- npm or yarn

## Project Structure

```
express-typescript-app
├── src
│   ├── app.ts               # Main application file
│   ├── server.ts            # Server entry point with DB connection
│   ├── config               # Configuration files
│   │   └── database.ts      # Database configuration (Prisma)
│   ├── controllers          # Directory for route controllers
│   │   └── index.ts         # Index controller
│   ├── routes               # Directory for route definitions
│   │   └── index.ts         # Route definitions
│   ├── middleware           # Directory for middleware functions
│   │   └── errorHandler.ts # Error handling middleware
│   └── types                # Directory for custom types
│       └── index.ts         # Custom type definitions
├── prisma
│   └── schema.prisma        # Prisma schema for database models
├── package.json             # NPM package configuration
├── tsconfig.json            # TypeScript configuration
├── docker-compose.yml       # Docker Compose for PostgreSQL
├── .env.example             # Environment variables template
└── README.md                # Project documentation
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd express-typescript-app
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if you need to change default values.

## Database Setup

This project uses PostgreSQL running in Docker and Prisma as the ORM.

### Start PostgreSQL with Docker

```bash
# Start PostgreSQL container
npm run docker:up

# Verify container is running
docker ps

# View PostgreSQL logs
npm run docker:logs
```

### Generate Prisma Client

After starting PostgreSQL, generate the Prisma Client:

```bash
npm run prisma:generate
```

### Run Migrations (when you have models)

```bash
# Create and apply migrations (development)
npm run prisma:migrate

# Push schema changes without migrations
npm run db:push
```

### Access Prisma Studio (Database GUI)

```bash
npm run prisma:studio
```

This will open a web interface at `http://localhost:5555` where you can view and edit your database.

## Usage

### Development

Run the application in development mode with hot reload:

```bash
npm run dev
```

The server will start at `http://localhost:3000`.

### Production

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Watch Mode

For TypeScript compilation in watch mode:

```bash
npm run watch
```

## Available Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint (checks database connection)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/express_db?schema=public` |
| `POSTGRES_USER` | PostgreSQL username (Docker) | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password (Docker) | `postgres` |
| `POSTGRES_DB` | PostgreSQL database name (Docker) | `express_db` |

## Docker Commands

```bash
# Start PostgreSQL container in background
npm run docker:up

# Stop PostgreSQL container
npm run docker:down

# View PostgreSQL logs
npm run docker:logs

# Access PostgreSQL CLI
docker exec -it express-postgres psql -U postgres -d express_db
```

## Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Push schema without migrations (useful for prototyping)
npm run db:push

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Troubleshooting

### Port 5432 already in use

If you have PostgreSQL running locally:
```bash
# Stop local PostgreSQL service
sudo service postgresql stop

# Or change the port in docker-compose.yml
# ports:
#   - "5433:5432"
# Then update DATABASE_URL in .env to use port 5433
```

### Connection refused error

1. Ensure Docker containers are running: `docker ps`
2. Check PostgreSQL logs: `npm run docker:logs`
3. Verify DATABASE_URL matches your Docker configuration

### Prisma Client not found

Run `npm run prisma:generate` to generate the Prisma Client.

## License

This project is licensed under the MIT License.