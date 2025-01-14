# Planify Backend

A robust NestJS backend application providing authentication, user management, event handling, and email capabilities. Built with TypeScript and follows clean architecture principles.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.7.4-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4.15-red.svg)](https://nestjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔐 JWT Authentication and Authorization
- 👥 User Management System
- 📅 Event Management
- 📧 Email Service with Templates
- 🌐 Internationalization (i18n)
- 📝 TypeORM with Migration Support
- 🔄 Database Seeding
- 🧪 Comprehensive Testing Setup
- 🐳 Docker Integration
- 📊 Swagger API Documentation
- 🔍 ESLint + Prettier Code Quality
- 🔄 CI/CD with GitHub Actions
- 🚀 SWC Support for Faster Development

## Prerequisites

```bash
Node.js >= 16.0.0
npm >= 8.0.0
PostgreSQL
Docker (optional)
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd planify-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env-example .env
```

4. Configure your `.env` file with appropriate values.

## Running the Application

```bash
# Development
npm run start:dev

# Development with SWC (faster)
npm run start:swc

# Debug mode
npm run start:debug

# Production mode
npm run start:prod
```

## Database Management

### Migrations

```bash
# Generate a migration
npm run migration:generate -- src/database/migrations/[MigrationName]

# Create empty migration
npm run migration:create -- src/database/migrations/[MigrationName]

# Run migrations
npm run migration:run

# Revert migrations
npm run migration:revert

# Drop schema
npm run schema:drop
```

### Seeding

```bash
# Create a seed
npm run seed:create

# Run seeds
npm run seed:run
```

## Development Tools

### Code Generation

```bash
# Generate a new resource
npm run generate:resource

# Add property to existing resource
npm run add:property
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code
npm run format
```

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Debug tests
npm run test:debug

# E2E tests with Docker
npm run test:e2e:docker
```

## Docker Support

```bash
# Development environment
docker compose up

# Testing environment
docker compose -f docker-compose.test.yaml up

# CI environment
docker compose -f docker-compose.ci.yaml up
```

## Folder Structure

```
src/
├── auth/           # Authentication & authorization
├── config/         # Application configuration
├── database/       # Database setup & migrations
├── events/         # Event management
├── mail/           # Email service
├── users/          # User management
└── utils/          # Utility functions
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/docs
```

## Dependency Updates

The project uses Renovate for automated dependency updates. Configuration can be found in `renovate.json`.

## Release Management

```bash
# Create a new release
npm run release
```

Release configuration is managed through `release-it` in package.json. The project follows semantic versioning.

## Additional Documentation

Detailed documentation is available in the `/docs` directory:

- [Architecture Overview](docs/architecture.md)
- [Authentication](docs/auth.md)
- [Database Management](docs/database.md)
- [File Uploading](docs/file-uploading.md)
- [Testing Guidelines](docs/tests.md)
- [CLI Usage](docs/cli.md)

## Contributing

1. Create a feature branch
2. Commit changes using conventional commits (project is Commitizen-friendly)
3. Push your branch
4. Submit a pull request

The project uses Husky for git hooks and commitlint for commit message validation.

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start the application in development mode |
| `npm run start:swc` | Start with SWC for faster development |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run migration:run` | Execute database migrations |
| `npm run seed:run` | Run database seeds |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Environment Variables

Key environment variables needed (see env-example for complete list):

```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=planify

JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1d

MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USER=user
MAIL_PASSWORD=password
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.