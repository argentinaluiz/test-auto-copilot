# Project Guidelines

## Overview
Express.js blog application built with TypeScript following **Clean Architecture** principles with clear separation of layers and SOLID design patterns.

## Code Style
- **TypeScript**: Strict mode enabled (`tsconfig.json`)
- **Target**: ES6, CommonJS modules
- **Controllers**: Class-based controllers with explicit method binding (see [src/controllers/index.ts](../src/controllers/index.ts))
- **Types**: Custom interfaces in `src/types/index.ts` for shared type definitions
- **Error Handling**: Environment-aware error responses (development shows stack traces)
- **Naming**: Use descriptive names following single responsibility principle

## Architecture (Clean Architecture)
- **Layers Structure**:
  - **Domain Layer**: Entities and business logic (pure TypeScript, no framework dependencies)
  - **Use Cases Layer**: Application business rules and orchestration
  - **Interface Adapters**: Controllers, presenters, and gateways
  - **Frameworks & Drivers**: Express routes, database, external services
- **Dependency Rule**: Dependencies point inward (frameworks depend on use cases, not vice versa)
- **Separation of Concerns**: 
  - `app.ts`: Express app configuration and middleware setup
  - `server.ts`: Server initialization and port binding
  - Controllers only handle HTTP concerns (request/response)
  - Business logic lives in use cases/services
- **Route Organization**: 
  - **Separate route files by domain** (e.g., `routes/posts.routes.ts`, `routes/users.routes.ts`)
  - Each route file handles a single entity/feature
  - Centralized registration in `routes/index.ts`
- **Controller Pattern**: Use class-based controllers with `.bind(controllerInstance)` when registering routes
- **Middleware Order**: JSON/urlencoded parsing → routes → error handler (always last)

## Docker & Database
- **PostgreSQL in Docker**: Database runs in Docker container, application runs locally for development
  - Use `npm run docker:up` to start PostgreSQL container
  - Use `npm run docker:down` to stop container
  - Data persists in named volume `postgres_data`
- **Application Runtime**: App runs locally (not containerized) for fast hot-reload during development
- **Environment Variables**: Managed via `.env` file (never commit this file)
  - Use `.env.example` as template for required variables
  - Load with `dotenv/config` at the top of `server.ts`
- **Database Connection**: Initialized in `server.ts` startup, closed on graceful shutdown
- **Health Checks**: `/health` endpoint verifies database connectivity

## Prisma Conventions
- **Schema Location**: `prisma/schema.prisma` contains all models and configuration
- **Client Generation**: Always run `npm run prisma:generate` after schema changes
  - Prisma Client is generated in `node_modules/.prisma/client`
  - Type-safe query builder is available via `PrismaClient`
- **Database Access**: 
  - Use singleton `database` instance from `src/config/database.ts`
  - Export `prisma` for direct use in repositories
  - Follow interface pattern: `IDatabase` for dependency injection
- **Migrations Workflow**:
  - Development: `npm run prisma:migrate` (creates migration files)
  - Prototyping: `npm run db:push` (skip migrations, faster iteration)
  - Production: Apply migrations via CI/CD pipeline
- **Prisma Studio**: Use `npm run prisma:studio` for database GUI (localhost:5555)
- **Model Conventions**:
  - Use `@id`, `@default(autoincrement())` for primary keys
  - Add `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt` to all models
  - Use descriptive relation names
  - Follow naming: models in PascalCase, fields in camelCase
- **Repository Pattern**: 
  - Create repository interfaces in domain layer
  - Implement repositories using `prisma` client from config
  - Never use `PrismaClient` directly in use cases or controllers
  - Example: `PostRepository` implements `IPostRepository` and injects `prisma`

## Git Worktree Support
- **Parallel Development**: This project supports working on multiple features simultaneously using git worktrees
- **Worktree Preparation Required**: Each new worktree **must** be configured before development
  - Worktrees need isolated ports and database schemas to avoid conflicts
  - **IMPORTANT**: Never start development in a new worktree without running setup first
- **Setup Script**: After creating a worktree, run:
  ```bash
  ./scripts/setup-worktree.sh
  ```
  - Automatically detects available ports (3000-3099 for app)
  - Copies `.env.example` to `.env` with unique configuration
  - Generates isolated PostgreSQL schema from branch name (e.g., `feature_auth`)
  - Chooses between shared or isolated database mode
- **Database Modes**:
  - **Shared (Default)**: All worktrees use same PostgreSQL container with different schemas
    - Recommended for most development scenarios
    - Lighter on resources (single container)
    - Automatically selected if `express-postgres` container is running
  - **Isolated**: Each worktree gets its own PostgreSQL container and port
    - Automatically configured if shared database not available
    - Uses ports 5433+ for PostgreSQL
    - Creates `docker-compose.override.yml` automatically
- **Workflow for Copilot Background Agent**:
  ```bash
  # After creating worktree, run:
  ./scripts/setup-worktree.sh   # Configure environment
  npm install                   # Install dependencies
  npm run prisma:migrate        # Create/sync database schema
  npm run dev                   # Start development (auto-assigned port)
  ```
- **Port Mapping**: Each worktree gets unique ports to prevent conflicts
  - Main worktree: `http://localhost:3000`
  - Other worktrees: Auto-assigned (3001, 3002, etc.)
  - Check `.env` file for assigned port
- **Schema Isolation**: Branch name determines PostgreSQL schema
  - `main` → `public` schema
  - `feature/auth` → `feature_auth` schema
  - `bugfix/login` → `bugfix_login` schema
  - Schemas are isolated: migrations in one worktree don't affect others
- **Cleanup**: Use git native commands to remove worktrees
  ```bash
  git worktree remove <path>
  ```
  - Optionally drop the schema from shared database manually if needed

## SOLID Principles Applied
- **Single Responsibility**: Each class/module has one reason to change
  - Controllers: HTTP handling only
  - Use Cases: Business logic only
  - Repositories: Data access only
- **Open/Closed**: Extend behavior via interfaces, not modification
- **Liskov Substitution**: Use interfaces for dependencies (e.g., `IPostRepository`)
- **Interface Segregation**: Small, focused interfaces per client need
- **Dependency Inversion**: Depend on abstractions (interfaces), not concrete implementations
  - Use dependency injection in constructors
  - Example: `constructor(private postRepository: IPostRepository)`

## Build and Test
```bash
npm install           # Install dependencies
npm run docker:up     # Start PostgreSQL container
npm run prisma:generate # Generate Prisma Client
npm run dev          # Development with ts-node hot reload
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled JavaScript from dist/
npm run watch        # Watch mode for TypeScript compilation
npm run prisma:studio # Open database GUI (localhost:5555)
npm run docker:down  # Stop PostgreSQL container
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage report
```

## Testing Strategy
- **Unit Tests**: Test use cases and business logic in isolation
  - Mock repository interfaces using test doubles
  - Test each use case independently
  - Aim for >80% coverage on business logic
- **Integration Tests**: Test controllers with real use cases
  - Mock only external dependencies (database, APIs)
  - Validate HTTP request/response handling
- **Test Structure**: 
  - Place tests adjacent to source: `__.test.ts` or in `__tests__/` folder
  - Use AAA pattern: Arrange, Act, Assert
  - Use descriptive test names: `should create post when valid data provided`
- **Mocking**: Use interfaces to facilitate mocking
  - Mock repositories, not use cases
  - Use test builders for complex entity creation

## Code Review Guidelines
- **Architecture Compliance**: Verify Clean Architecture boundaries
  - Domain layer has no external dependencies
  - Dependencies point inward only
- **SOLID Violations**: Check for:
  - Large classes doing multiple things (SRP violation)
  - Direct instantiation instead of DI (DIP violation)
  - Missing interfaces for dependencies (DIP violation)
- **Testing**: Require tests for:
  - All new use cases (unit tests mandatory)
  - New endpoints (integration tests recommended)
  - Bug fixes (regression test required)
- **Type Safety**: No `any` types without justification
- **Error Handling**: All errors properly typed and handled

## Project Conventions
- **Controllers**: Export named classes (e.g., `PostController`) with typed methods
- **Route Files**: Separate by domain/entity
  ```typescript
  // routes/posts.routes.ts
  export const postRoutes = (router: Router, controller: PostController) => {
    router.get('/posts', controller.list.bind(controller));
    router.post('/posts', controller.create.bind(controller));
  };
  ```
- **Route Binding**: Always bind controller methods when passing to Express routes
- **Use Cases**: Create separate use case classes for each business operation
  - Example: `CreatePostUseCase`, `ListPostsUseCase`
- **Repositories**: Interface-based for data access (enable testing and swappable implementations)
  - Use Prisma Client via `src/config/database.ts`
  - Never instantiate `PrismaClient` directly in repositories
  - Import `prisma` singleton from config: `import { prisma } from '../config/database'`
- **Database Config**: Singleton pattern in `src/config/database.ts`
  - Implements `IDatabase` interface for DI
  - Exports `database` (singleton) and `prisma` (client)
  - Connection managed in `server.ts` lifecycle
- **Error Handler**: Placed as the last middleware in `app.ts`
- **Types**: Use `Express.Request` and extend it when needed (see `RequestWithUser`)
- **API Responses**: Use `ApiResponse<T>` interface for consistent response shape
- **DTOs**: Use Data Transfer Objects for request/response validation
- **Environment Variables**: Load via `dotenv/config` at the top of `server.ts`
- **Folder Structure**:
  - `src/config/`: Configuration files (database, environment)
  - `prisma/`: Prisma schema and migrations
  - `src/repositories/`: Data access layer implementations

## Integration Points
- **Port Configuration**: Defaults to 3000, override with `PORT` environment variable
- **Error Logging**: Console-based (consider structured logging for production)

## Security
- Body parsing limits: Use Express defaults (consider adding explicit limits for production)
- Error responses: Stack traces hidden in non-development environments
