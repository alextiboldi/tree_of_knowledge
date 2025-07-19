# Authentication System Documentation

## Overview

The Tree of Knowledge application implements a secure authentication system using NextAuth.js v5 with the following features:

- **Credentials-based authentication** for parent accounts
- **JWT session management** with secure token handling
- **Password hashing** using bcrypt with 12 salt rounds
- **Route protection** via middleware
- **Database integration** using Prisma with PostgreSQL

## Architecture

### Core Components

1. **NextAuth Configuration** (`auth.ts`)

   - Credentials provider setup
   - JWT session strategy
   - Prisma adapter integration
   - Custom callbacks for session management

2. **API Routes**

   - `/api/auth/[...nextauth]` - NextAuth.js handlers
   - `/api/auth/register` - Parent registration endpoint

3. **Middleware** (`middleware.ts`)

   - Route protection
   - Automatic redirects
   - Session validation

4. **Utilities** (`app/lib/`)
   - Password hashing and validation
   - Session management helpers
   - TypeScript type definitions

## Database Schema

The authentication system uses the following database models:

```prisma
model Parent {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  children     Child[]
  accounts     Account[] // NextAuth accounts
  sessions     Session[] // NextAuth sessions
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  // ... additional OAuth fields
  user              Parent  @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         Parent   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

## API Endpoints

### POST /api/auth/register

Register a new parent account.

**Request Body:**

```json
{
  "email": "parent@example.com",
  "password": "SecurePassword123",
  "name": "Parent Name"
}
```

**Validation:**

- Email must be valid format
- Password must be 8+ characters with at least 1 letter and 1 number
- Name is required
- Email must be unique

**Response (201):**

```json
{
  "message": "Account created successfully",
  "parent": {
    "id": "clx...",
    "email": "parent@example.com",
    "name": "Parent Name",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- `400` - Validation errors
- `409` - Email already exists
- `500` - Server error

### NextAuth.js Endpoints

- `GET/POST /api/auth/signin` - Sign in page and handler
- `GET/POST /api/auth/signout` - Sign out handler
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - CSRF token

## Protected Routes

The following routes require authentication:

- `/dashboard/*` - Parent dashboard
- `/profile/*` - User profile management
- `/child/*` - Child profile management
- `/api/child/*` - Child-related API endpoints
- `/api/questions/*` - Question/answer API endpoints

## Usage Examples

### Server-Side Authentication

```typescript
import { getCurrentUser, requireAuth } from "@/app/lib/auth";

// Get current user (redirects if not authenticated)
export default async function DashboardPage() {
  const user = await getCurrentUser();
  return <div>Welcome, {user.name}!</div>;
}

// Require authentication (redirects if not authenticated)
export async function generateMetadata() {
  const session = await requireAuth();
  return { title: `${session.user.name}'s Dashboard` };
}
```

### Client-Side Session

```typescript
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (session) {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
```

### Registration

```typescript
async function registerParent(email: string, password: string, name: string) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}
```

## Environment Variables

Required environment variables in `.env.local`:

```env
# NextAuth.js Configuration
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

Generate a secure secret:

```bash
openssl rand -base64 32
```

Or use the setup script:

```bash
npm run setup:env
```

## Security Features

### Password Security

- **Bcrypt hashing** with 12 salt rounds
- **Password strength validation** (8+ chars, letters + numbers)
- **Common password detection**
- **Secure password comparison**

### Session Security

- **JWT tokens** with secure signing
- **30-day session expiry**
- **Automatic token refresh**
- **CSRF protection**

### Route Protection

- **Middleware-based protection**
- **Automatic redirects**
- **Callback URL preservation**
- **Public route exclusions**

## Development

### Setup

1. Install dependencies: `npm install`
2. Set up environment: `npm run setup:env`
3. Run database migrations: `npm run prisma:migrate`
4. Start development server: `npm run dev`

### Testing Authentication

1. Navigate to `/auth/signin`
2. Create account via registration API
3. Sign in with credentials
4. Access protected routes

## Troubleshooting

### Common Issues

**"Invalid credentials" error:**

- Check email/password combination
- Ensure account exists
- Verify password meets requirements

**Session not persisting:**

- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies/storage

**Route protection not working:**

- Check middleware configuration
- Verify route patterns in `middleware.ts`
- Ensure auth configuration is correct

**Database connection errors:**

- Verify DATABASE_URL is correct
- Check database is running
- Run migrations: `npm run prisma:migrate`

## Next Steps

Phase 1.3 authentication system is now complete with all tasks implemented:

- ✅ **P1-T12** NextAuth.js configuration
- ✅ **P1-T13** Parent registration API route
- ✅ **P1-T14** Login/logout functionality
- ✅ **P1-T15** Password hashing (bcrypt)
- ✅ **P1-T16** Authentication middleware
- ✅ **P1-T17** Session management

The system is ready for integration with the parent dashboard and child profile management components in Phase 2.
