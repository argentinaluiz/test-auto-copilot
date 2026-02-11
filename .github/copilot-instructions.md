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
npm run dev          # Development with ts-node hot reload
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled JavaScript from dist/
npm run watch        # Watch mode for TypeScript compilation
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
- **Error Handler**: Placed as the last middleware in `app.ts`
- **Types**: Use `Express.Request` and extend it when needed (see `RequestWithUser`)
- **API Responses**: Use `ApiResponse<T>` interface for consistent response shape
- **DTOs**: Use Data Transfer Objects for request/response validation

## Integration Points
- **Port Configuration**: Defaults to 3000, override with `PORT` environment variable
- **Error Logging**: Console-based (consider structured logging for production)

## Security
- Body parsing limits: Use Express defaults (consider adding explicit limits for production)
- Error responses: Stack traces hidden in non-development environments
