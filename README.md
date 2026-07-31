# Admin Dashboard Backend

A scalable REST API built with **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL** for managing an e-commerce/admin dashboard. The system includes authentication, role-based access control (RBAC), media management, catalog management, and product management with support for both simple and variable products.

---

# Live API & Credentials

**Base URL**

```text
https://admin-dashboard-backend-q1bs.onrender.com/api/v1
```

**Seeded Accounts** — use these to log in and test the API directly.

| Role | Email | Password | Access |
|---|---|---|---|
| Super Admin | `bayazidhassan776@gmail.com` | `12345678` | All permissions |
| Limited User (Manager) | `bayazid@gmail.com` | `12345678` | `category:watch`, `category:create`, `category:read`, `category:update`, `category:delete` only — no permission/role/user/brand/attribute/media/product access. Use this account to verify 403 responses. |

---

# Tech Stack

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* JWT Authentication
* bcryptjs
* Zod
* Multer
* Neon PostgreSQL
* Render

---

# Authentication Strategy

* **Access token** — short-lived JWT, returned in the JSON response body on login/refresh. Frontend keeps it in memory and sends it via the `Authorization: Bearer <token>` header on each request.
* **Refresh token** — long-lived JWT, stored server-side (hashed/plain per your implementation) and set as an **HttpOnly, Secure cookie** on the client. Never accessible to JavaScript, reducing XSS exposure. Sent automatically by the browser to `/auth/refresh`.
* **Logout** revokes the refresh token server-side (clears it from the database record), not just the cookie — so a copied/leaked refresh token stops working immediately after logout.
* **Refresh rotation** — each call to `/auth/refresh` issues a new refresh token and invalidates the old one.
* Permissions are checked **live from the database** on every request (not baked into the JWT), so a role's permission change or a user's role change takes effect on the user's very next request — no need to wait for token expiry.

---

# Authorization

The API uses role-based access control (RBAC). Each protected route requires:

1. **Authentication** — a valid JWT access token.
2. **Permission-based authorization** — the user's role must include the specific permission the route requires.

Permissions are checked live against the database on every request, so a permission or role change takes effect immediately, without waiting for the token to expire.

Examples:

```text
POST   /products      → requires product:create
DELETE /users/:id     → requires user:delete
PATCH  /roles/:id     → requires role:update
```

A request without the required permission returns `403 Forbidden`. A request without a valid token returns `401 Unauthorized`.

---

# Features

## Authentication
* Login
* Refresh Access Token
* Logout
* Get Current Session

## Role-Based Access Control (RBAC)
* Permission Groups
* Permissions
* Roles
* Assign Permissions to Roles
* Route Authorization

## User Management
* Create User
* Get Users
* Get User by ID
* Update User
* Update User Status
* Delete User

## Media Management
* Upload Media
* List Media
* Get Media by ID
* Update Media Metadata
* Delete Media

> Uploaded files are stored locally inside the `uploads/` directory. See **Known Issues** below.

## Category Management
* Create Category
* Nested Categories
* Category Tree
* Update Category
* Delete Category

## Brand Management
* Create Brand
* Update Brand
* Delete Brand

## Attribute Management
* Create Attribute
* Update Attribute
* Delete Attribute
* Create Attribute Values
* Update Attribute Values
* Delete Attribute Values

## Product Management

### Simple Products
* Create Product
* Update Product
* Delete Product

### Variable Products
* Create Variable Product
* Generate Variant Combinations
* Add Product Variant
* Update Variant
* Delete Variant

### Product Media
* Attach Product Media
* Attach Variant Media
* Attach Attribute Value Media
* Reorder Product Media
* Remove Attached Media

---

# Module Status

| Module | Status |
|---|---|
| Authentication | Complete |
| Permission | Complete |
| Role | Complete |
| User | Complete |
| Media | Complete |
| Category | Complete |
| Brand | Complete |
| Attribute | Complete |
| Product | Complete |

> This repository covers the backend only. The frontend is maintained in a separate repository: `<FILL IN — frontend repo URL>`

---

# Known Issues

* Uploaded media is stored locally in the `uploads/` directory.
* When deploying to platforms with ephemeral file systems (such as Render), uploaded files may not persist across restarts or redeployments. For production deployments, object storage such as Amazon S3 or Cloudinary is recommended.

---

# Project Structure

```text
postman
prisma
src
├── constants
├── errors
├── generated
├── lib
├── middlewares
├── modules
├── routes
├── types
├── utils
├── app.ts
└── server.ts
uploads
```

---

# Installation

```bash
git clone https://github.com/bayazidhassan/Admin-Dashboard-Backend.git
cd Admin-Dashboard-Backend
npm install
```

---

# Environment Variables

Create a `.env` file in the project root:

```env
# Application
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://username:password@your-neon-host/your-database?sslmode=require"

# JWT
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Seed Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

# Seed Limited Manager User (catalog-only access)
MANAGER_EMAIL=manager@example.com
MANAGER_PASSWORD=your_manager_password
```

---

# Database Setup — from empty DB to running app

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Apply all migrations
npx prisma migrate deploy

# 3. Seed the database (creates permissions, roles, super admin, and limited user)
npm run seed
```

---

# Running the Project

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod
```

---

# Main API Endpoints

## Authentication
```text
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
GET    /auth/session
```

## Permission
```text
POST   /permissions/groups
GET    /permissions/groups
PATCH  /permissions/groups/:id
DELETE /permissions/groups/:id
```

## Role
```text
POST   /roles
GET    /roles
GET    /roles/:id
PATCH  /roles/:id
PATCH  /roles/:id/grant-all
DELETE /roles/:id
```

## User
```text
POST   /users
GET    /users
GET    /users/:id
PATCH  /users/:id
PATCH  /users/:id/status
DELETE /users/:id
```

## Media
```text
POST   /media/upload
GET    /media
GET    /media/:id
PATCH  /media/:id
DELETE /media/:id
```

## Category
```text
POST   /categories
GET    /categories
GET    /categories/tree
GET    /categories/:id
PATCH  /categories/:id
DELETE /categories/:id
```

## Brand
```text
POST   /brands
GET    /brands
GET    /brands/:id
PATCH  /brands/:id
DELETE /brands/:id
```

## Attribute
```text
POST   /attributes
GET    /attributes
GET    /attributes/:id
PATCH  /attributes/:id
DELETE /attributes/:id

POST   /attributes/:id/values
PATCH  /attributes/values/:valueId
DELETE /attributes/values/:valueId
```

## Product
```text
POST   /products
POST   /products/variable
POST   /products/generate-variants
POST   /products/:id/variants

POST   /products/:id/media
POST   /products/variants/:variantId/media
POST   /products/attribute-values/:valueId/media

GET    /products
GET    /products/:id

PATCH  /products/:id
PATCH  /products/variable/:id
PATCH  /products/variants/:variantId
PATCH  /products/:id/media/reorder

DELETE /products/:id
DELETE /products/variants/:variantId
DELETE /products/:id/media/:mediaId
DELETE /products/variants/:variantId/media/:mediaId
DELETE /products/attribute-values/:valueId/media/:mediaId
```

---

# API Testing

All endpoints have been tested using Postman. Import these files into Postman:

* `postman/Admin-Dashboard-Backend.postman_collection.json`
* `postman/Admin-Dashboard-Backend.postman_environment.json`

---

# Author

**Bayazid Hassan**
* GitHub: https://github.com/bayazidhassan
