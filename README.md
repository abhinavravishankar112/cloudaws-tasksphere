# Cloud-Native TaskSphere API

Production-ready Node.js and Express API for task management with PostgreSQL, Prisma, JWT authentication, validation, Swagger/OpenAPI, Docker, AWS deployment assets, Terraform, and Kubernetes manifests.

## Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Express Validator
- dotenv
- Jest
- Docker and Docker Compose
- Nginx
- AWS EC2
- GitHub Actions
- Terraform
- Kubernetes

## Features

- User registration and login
- JWT-protected routes
- Role-based authorization ready for extension
- CRUD for tasks
- Task categories
- Task priorities
- Task status
- Due dates
- Search, filtering, sorting, and pagination
- Input validation
- Centralized error handling
- Structured logging
- Health checks
- Swagger/OpenAPI documentation
- Readiness and liveness probes

## Project Structure

- `src/controllers` - HTTP controllers
- `src/routes` - API routes
- `src/services` - business logic
- `src/middleware` - auth, error, and validation middleware
- `src/config` - environment, database, logger, Swagger config
- `src/models` - Prisma client wrapper
- `src/utils` - shared helpers
- `src/validators` - request validation rules
- `prisma` - schema and migrations
- `scripts` - setup and deployment scripts
- `tests` - unit and integration tests
- `docker-compose.yml` - local app and PostgreSQL stack
- `terraform` - AWS EC2 infrastructure
- `nginx` - reverse proxy config
- `k8s` - Kubernetes manifests

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 16+
- Docker and Docker Compose

## Environment Variables

Copy the example file and set the values:

```bash
cp .env.example .env
```

Required variables:

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN`
- `LOG_LEVEL`
- `SWAGGER_ENABLED`

## Local Setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

API base URL:

```bash
http://localhost:3000
```

Swagger UI:

```bash
http://localhost:3000/api-docs
```

## NPM Scripts

- `npm run dev` - start the API with nodemon
- `npm start` - start the API in production mode
- `npm run lint` - run ESLint
- `npm test` - run Jest tests
- `npm run test:watch` - run Jest in watch mode
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - run Prisma migrations locally
- `npm run prisma:studio` - open Prisma Studio

## Testing

Run all tests:

```bash
npm test -- --runInBand
```

Run linting:

```bash
npm run lint
```

## Docker

Build and start the full stack:

```bash
docker compose up --build
```

The Compose stack exposes:

- API: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

## GitHub Actions Deployment

The CI workflow runs tests and builds the Docker image on pull requests and pushes to `main`.

Deployment to EC2 runs on pushes to `main` only when these repository secrets are configured:

- `EC2_HOST` - EC2 public IP address or DNS name
- `EC2_USER` - SSH username, for example `ubuntu` or `ec2-user`
- `EC2_SSH_KEY` - private SSH key with access to the EC2 instance
- `DEPLOY_PATH` - application directory on the EC2 instance

If any deployment secret is missing, the deploy job is skipped with a warning.

## Health Checks

- Liveness: `GET /api/v1/health/live`
- Readiness: `GET /api/v1/health/ready`
- General health alias: `GET /api/v1/health`

## API Routes

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Tasks

- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `GET /api/v1/tasks/:taskId`
- `PATCH /api/v1/tasks/:taskId`
- `DELETE /api/v1/tasks/:taskId`

### Health

- `GET /api/v1/health`
- `GET /api/v1/health/live`
- `GET /api/v1/health/ready`

