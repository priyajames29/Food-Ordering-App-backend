# Food Ordering App — Backend

A REST API for a food ordering platform, built with **Node.js, Express 5, PostgreSQL (Sequelize), and Redis**.

I built this as a learning project to practise the parts of backend work that show up in production systems: authentication and role-based access, transactional writes, caching, rate limiting, background jobs, structured logging, API docs, and containerisation.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Data model](#data-model)
- [Getting started](#getting-started)
  - [Option A: Docker Compose](#option-a-docker-compose-recommended)
  - [Option B: Run locally](#option-b-run-locally)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Order lifecycle](#order-lifecycle)
- [Key concepts implemented](#key-concepts-implemented)
- [Project status and roadmap](#project-status-and-roadmap)

---

## Features

- **JWT authentication** with bcrypt password hashing
- **Role-based access control** with three roles: `customer`, `restaurant_owner`, `admin`
- **Restaurant and menu management**, with ownership checks on restaurants
- **Order placement inside a database transaction**: prices are read from the DB (never trusted from the client), and totals are calculated in integer cents to avoid floating-point errors
- **Order status state machine** that rejects invalid transitions (for example, `delivered` back to `pending`)
- **Redis caching** (cache-aside pattern) for the restaurant list and the "top menu items" analytics query, with invalidation on writes
- **Redis-backed rate limiting**: a global limiter plus a stricter one on login
- **Background jobs** with BullMQ: order notifications are queued and handled by a separate worker process, with retries and exponential backoff
- **Request validation** with Zod
- **Structured logging** with Pino and pino-http (auth headers are redacted)
- **Swagger / OpenAPI** docs at `/api-docs`
- **Docker Compose** setup for Postgres, Redis, the API, and the worker

## Tech stack

| Concern         | Tool                                      |
| --------------- | ----------------------------------------- |
| Runtime         | Node.js 22 (ES modules)                   |
| Web framework   | Express 5                                 |
| Database / ORM  | PostgreSQL 16, Sequelize 6                |
| Cache / queues  | Redis 7, `redis` client, BullMQ           |
| Auth            | `jsonwebtoken`, `bcrypt`                  |
| Validation      | Zod 4                                     |
| Rate limiting   | `express-rate-limit` + `rate-limit-redis` |
| Logging         | Pino, pino-http, pino-pretty (dev)        |
| Email           | Nodemailer (currently stubbed)            |
| API docs        | swagger-jsdoc, swagger-ui-express         |
| Containers      | Docker, Docker Compose                    |

## Architecture

```
                ┌──────────────────────────────────────────────┐
  HTTP client ─▶│  Express API (src/server.js)                 │
                │                                              │
                │  requestLogger → rateLimiter → router        │
                │     → authenticateUser → authorizeRole       │
                │     → validateRequest → controller → service │
                └───────┬──────────────┬──────────────┬────────┘
                        │              │              │ enqueue job
                        ▼              ▼              ▼
                  ┌──────────┐   ┌──────────┐   ┌───────────────┐
                  │ Postgres │   │  Redis   │◀──│ BullMQ queue  │
                  │ (data)   │   │ (cache + │   │ "notifications"│
                  └──────────┘   │ ratelimit)│  └──────┬────────┘
                                 └──────────┘          │ consume
                                                       ▼
                                          ┌─────────────────────────┐
                                          │ Worker process          │
                                          │ (src/workers/           │
                                          │  notificationWorker.js) │
                                          │  → emailService         │
                                          └─────────────────────────┘
```

The code is layered:

- **Routes** declare the endpoint and its middleware chain (auth, role check, validation).
- **Controllers** handle HTTP concerns: reading the request, picking the status code, shaping the response.
- **Services** hold business logic and database access, which keeps them reusable from workers or scripts.
- **Models** hold the Sequelize definitions. Associations are wired up in `src/models/index.js`.

## Project structure

```
src/
├── app.js                  # Express app: middleware + route mounting
├── server.js               # Entry point: DB connect, sync, Redis connect, listen
├── config/
│   ├── database.js         # Sequelize instance
│   ├── logger.js           # Pino logger (pretty in dev, JSON in prod)
│   ├── queueConnection.js  # BullMQ connection parsed from REDIS_URL
│   ├── rateLimiter.js      # Global + auth rate limiters (Redis store)
│   ├── redis.js            # node-redis client
│   └── swagger.js          # OpenAPI spec config
├── constants/
│   ├── orderStatus.js      # Status enum + allowed transitions
│   └── roles.js            # Role enum
├── controllers/            # HTTP layer
├── middlewares/
│   ├── authenticateUser.js         # Verifies JWT, sets req.user
│   ├── authorizeRole.js            # Role allow-list (or "self" check)
│   ├── checkRestaurantOwnership.js # Owner-or-admin guard
│   ├── requestLogger.js            # pino-http
│   └── validateRequest.js          # Zod body validation
├── models/                 # Sequelize models + associations (index.js)
├── queues/
│   └── notificationQueue.js
├── routes/                 # Express routers
├── services/               # Business logic, caching, queueing, email
├── utils/
│   ├── errors.js           # AppError + sendError helper
│   ├── jwt.js
│   └── password.js
├── validators/             # Zod schemas
└── workers/
    └── notificationWorker.js   # BullMQ worker (separate process)
```

## Data model

```
User ──1:N── Restaurant ──1:N── MenuItem
  │              │                  │
  │1:N           │1:N               │1:N
  ▼              ▼                  ▼
Orders ◀─────────┘           OrderItems
  │1:N                              ▲
  └─────────────────────────────────┘
```

| Model          | Key fields                                                                 |
| -------------- | -------------------------------------------------------------------------- |
| **User**       | `name`, `email` (unique), `password` (bcrypt hash), `role`                 |
| **Restaurant** | `name` (unique), `location`, `phone`, `openingTime`, `closingTime`, `userId` (owner) |
| **MenuItem**   | `name`, `description`, `price`, `category`, `isAvailable`, `restaurantId`  |
| **Orders**     | `status`, `totalPrice`, `orderedAt`, `userId`, `restaurantId`              |
| **OrderItems** | `quantity`, `price` (line total), `orderId`, `menuItemId`                  |

Tables are created and updated by `sequelize.sync({ alter: true })` on startup. The project has no migrations yet.

## Getting started

### Prerequisites

- Node.js 22+
- Docker and Docker Compose, **or** local installs of PostgreSQL 16 and Redis 7

First, create your env file:

```bash
cp template.env .env
# then fill in the values (see "Environment variables" below)
```

### Option A: Docker Compose (recommended)

```bash
docker compose up --build
```

This starts four containers:

| Service    | Purpose                    | Port |
| ---------- | -------------------------- | ---- |
| `postgres` | Database                   | 5432 |
| `redis`    | Cache, rate limits, queue  | 6379 |
| `app`      | The API (`npm start`)      | 3000 |
| `worker`   | Notification worker        | –    |

Inside Compose, `DB_HOST` and `REDIS_URL` are overridden to point at the service names, so you don't need to change them in `.env`.

### Option B: Run locally

You can still run only the infrastructure in Docker:

```bash
docker compose up postgres redis -d
```

Then:

```bash
npm install

# terminal 1: API with auto-reload
npm run dev

# terminal 2: background worker
npm run worker
```

| Script           | What it does                         |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Starts the API with nodemon          |
| `npm start`      | Starts the API with node             |
| `npm run worker` | Starts the BullMQ notification worker |

When it's running:

- API: http://localhost:3000
- Swagger UI: http://localhost:3000/api-docs

## Environment variables

| Variable          | Example                        | Description                                  |
| ----------------- | ------------------------------ | -------------------------------------------- |
| `PORT`            | `3000`                         | API port                                     |
| `DB_HOST`         | `localhost`                    | Postgres host                                |
| `DB_PORT`         | `5432`                         | Postgres port                                |
| `DB_NAME`         | `food_ordering`                | Database name                                |
| `DB_USER`         | `postgres`                     | Database user                                |
| `DB_PASSWORD`     | `postgres`                     | Database password                            |
| `REDIS_URL`       | `redis://localhost:6379`       | Redis connection URL (`rediss://` for TLS)   |
| `JWT_SECRET`      | a long random string           | Secret used to sign JWTs                     |
| `JWT_EXPIRES_IN`  | `1h`                           | Token lifetime                               |
| `SMTP_HOST`       | `smtp.mailtrap.io`             | SMTP server (email sending is stubbed for now) |
| `SMTP_PORT`       | `587`                          | SMTP port                                    |
| `SMTP_SECURE`     | `false`                        | `true` for port 465                          |
| `SMTP_USER`       |                                | SMTP username                                |
| `SMTP_PASSWORD`   |                                | SMTP password                                |
| `EMAIL_FROM`      | `orders@example.com`           | Sender address                               |
| `NODE_ENV`        | `production`                   | Optional. Turns off pretty logs in production |
| `LOG_LEVEL`       | `info`                         | Optional. Pino log level                     |

## API reference

Authenticated routes need the header `Authorization: Bearer <token>`. You get the token from `POST /auth/login`.

### Auth

| Method | Path             | Auth | Description                                   |
| ------ | ---------------- | ---- | --------------------------------------------- |
| POST   | `/auth/register` | –    | Create an account `{ name, email, password, role }` |
| POST   | `/auth/login`    | –    | Returns `{ token, user }`. Has its own rate limit of 5 per minute |

### Users

| Method | Path         | Roles             | Description            |
| ------ | ------------ | ----------------- | ---------------------- |
| GET    | `/users`     | admin             | List all users         |
| GET    | `/users/:id` | admin             | Get a user             |
| PUT    | `/users/:id` | the user themselves | Update your own profile |
| DELETE | `/users/:id` | admin             | Delete a user          |

### Restaurants

| Method | Path                | Roles                               | Description                       |
| ------ | ------------------- | ----------------------------------- | --------------------------------- |
| GET    | `/restaurants`      | public                              | List restaurants (cached for 5 min) |
| GET    | `/restaurants/mine` | restaurant_owner, admin             | Restaurants you own               |
| GET    | `/restaurants/:id`  | public                              | Get one restaurant                |
| POST   | `/restaurants`      | restaurant_owner, admin             | Create a restaurant (you become its owner) |
| PUT    | `/restaurants/:id`  | owner of that restaurant, or admin  | Update                            |
| DELETE | `/restaurants/:id`  | owner of that restaurant, or admin  | Delete                            |

### Menu items

| Method | Path                       | Roles                   | Description                                    |
| ------ | -------------------------- | ----------------------- | ---------------------------------------------- |
| GET    | `/menu-items`              | public                  | All menu items                                 |
| GET    | `/menu-items/top`          | public                  | Top 10 items by quantity in delivered orders (cached) |
| GET    | `/menu-items/:restaurantId`| public                  | Menu for one restaurant                        |
| POST   | `/menu-items`              | restaurant_owner, admin | Create a menu item                             |
| PUT    | `/menu-items/:id`          | restaurant_owner, admin | Update a menu item                             |
| DELETE | `/menu-items/:id`          | restaurant_owner, admin | Delete a menu item                             |

### Orders

| Method | Path                 | Roles                             | Description                                         |
| ------ | -------------------- | --------------------------------- | --------------------------------------------------- |
| POST   | `/orders`            | customer, admin                   | Place an order                                      |
| GET    | `/orders`            | any authenticated role            | Customers see their own orders, owners see orders for their restaurants, admins see all |
| GET    | `/orders/:id`        | customer (own order), admin       | Get one order with its items                        |
| PATCH  | `/orders/:id/status` | customer, restaurant_owner, admin | Change status (rules below)                         |

**Example: place an order**

```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "restaurantId": 1,
  "items": [
    { "menuItemId": 3, "quantity": 2 },
    { "menuItemId": 5, "quantity": 1 }
  ]
}
```

The server:

1. Opens a transaction and loads the menu items, checking that they belong to that restaurant.
2. Rejects the order if any item is unavailable.
3. Calculates line totals and the order total in cents, using DB prices.
4. Creates the `Orders` row and the `OrderItems` rows in the same transaction.
5. Queues an `ORDER_PLACED` notification job for the worker.

## Order lifecycle

```
pending ──▶ confirmed ──▶ preparing ──▶ out_for_delivery ──▶ delivered
   │            │             │
   └────────────┴─────────────┴──▶ cancelled
```

| Who              | Allowed to                                                    |
| ---------------- | ------------------------------------------------------------- |
| Customer         | Only cancel, and only their own order                         |
| Restaurant owner | Any valid transition on orders for restaurants they own       |
| Admin            | Any valid transition                                          |

Status changes run inside a transaction with a row lock (`SELECT … FOR UPDATE`), so two requests can't change the same order at once. Moving an order to `delivered` invalidates the top-menu-items cache.

## Key concepts implemented

Notes on what I practised and where to find it in the code:

- **Cache-aside pattern**: `src/services/cacheServices.js` `getOrSetCache()`. If Redis is unavailable, it falls back to the database.
- **Cache invalidation**: restaurant writes delete the list cache, and delivered orders delete the top-items cache.
- **Money handling**: `toCents` / `fromCents` in `orderService.js` avoid float rounding errors, and the columns use `DECIMAL(10,2)`.
- **Transactions and locking**: `createOrderService` (shared lock on menu items) and `updateOrderStatusService` (row lock on the order).
- **State machine**: `ORDER_STATUS_TRANSITIONS` in `constants/orderStatus.js`.
- **Distributed rate limiting**: limiter counters live in Redis, so they work across multiple API instances.
- **Async jobs**: BullMQ queue and worker with `attempts: 3` and exponential backoff. The API doesn't wait on email.
- **Structured logs**: Pino with per-request logging and redaction of `Authorization` and cookies.

## Project status and roadmap

This is a learning project and it's still in progress. Things I plan to do next:

- [ ] Send real emails. `emailService.sendEmail` only logs for now.
- [ ] Include the restaurant owner's email in order notifications.
- [ ] Document every endpoint in Swagger. Only `/auth/login` is documented so far.
- [ ] Add a global error handler and a 404 handler, and return consistent error responses.
- [ ] Validate every create and update request body.
- [ ] Check menu-item ownership, so owners can only change items from their own restaurants.
- [ ] Prevent self-registration as `admin`.
- [ ] Add Sequelize migrations instead of `sync({ alter: true })`.
- [ ] Add pagination and filtering on list endpoints.
- [ ] Add tests (Jest/Vitest + Supertest).
- [ ] Add refresh tokens and logout.
- [ ] Reject orders when a restaurant is closed (using `openingTime` and `closingTime`).

## License

ISC
