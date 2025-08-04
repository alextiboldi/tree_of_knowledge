# Session Optimization: OnboardingComplete in JWT Token

## Overview

This optimization moves the `onboardingComplete` status from a separate API call to the JWT token, eliminating the need for the `/api/auth/onboarding-status` endpoint and improving performance.

## Changes Made

### 1. Updated NextAuth Configuration (`auth.ts`)

- **JWT Callback**: Modified to fetch `onboardingComplete` from the database when the token is created or updated
- **Session Callback**: Added `onboardingComplete` to the session object returned to the client

```typescript
callbacks: {
  async jwt({ token, user, trigger }) {
    // ... existing code ...

    // Fetch onboardingComplete status when token is created or on session update
    if (token.id && (user || trigger === "update")) {
      try {
        const parent = await prisma.parent.findUnique({
          where: { id: token.id as string },
          select: { onboardingComplete: true },
        });

        if (parent) {
          token.onboardingComplete = parent.onboardingComplete;
        }
      } catch (error) {
        console.error("Error fetching onboarding status:", error);
      }
    }

    return token;
  },
  async session({ session, token }) {
    // ... existing code ...
    session.user.onboardingComplete = token.onboardingComplete as boolean;
    return session;
  },
}
```

### 2. Updated TypeScript Types (`types/next-auth.d.ts`)

- Added `onboardingComplete: boolean` to both `Session.user` and `JWT` interfaces

### 3. Updated Onboarding Utility (`app/lib/onboarding.ts`)

- Modified `fetchOnboardingStatus()` to get `onboardingComplete` from the child-profiles API instead of the dedicated onboarding-status endpoint
- Added `refreshSessionToken()` utility function for force-refreshing the session when onboarding status changes

### 4. Updated Child Profiles API (`app/api/child-profiles/route.ts`)

- Modified GET endpoint to include `onboardingComplete` from the session in the response

### 5. Removed Unnecessary API

- Deleted `/api/auth/onboarding-status/route.ts` as it's no longer needed

## Benefits

1. **Performance**: Eliminates one API call per page load/navigation
2. **Simplicity**: Onboarding status is now available directly in the session object
3. **Consistency**: All user authentication data is centralized in the session
4. **Real-time**: Status updates are reflected immediately in the JWT token

## Usage

### Client Components

```typescript
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session } = useSession();

  if (session?.user?.onboardingComplete) {
    // User has completed onboarding
    return <Dashboard />;
  } else {
    // User still needs to complete onboarding
    return <OnboardingFlow />;
  }
}
```

### Server Components

```typescript
import { auth } from "@/auth";

export default async function MyServerComponent() {
  const session = await auth();

  if (session?.user?.onboardingComplete) {
    // User has completed onboarding
    return <Dashboard />;
  } else {
    // User still needs to complete onboarding
    return <OnboardingFlow />;
  }
}
```

### API Routes

```typescript
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.onboardingComplete) {
    return NextResponse.json({ error: "Onboarding required" }, { status: 403 });
  }

  // Continue with API logic...
}
```

## Token Refresh

When the onboarding status changes in the database (e.g., when a user completes onboarding), you can refresh the session token by:

1. **Automatic**: The token will be refreshed on the next page load or session check
2. **Manual**: Call `refreshSessionToken()` from the onboarding utility (forces page reload)
3. **API Update**: Update the database and let the JWT callback handle the refresh on next session access

## Migration Notes

- The existing `fetchOnboardingStatus()` function continues to work but now uses the optimized approach
- No changes needed in components that use the session - they will automatically get the `onboardingComplete` property
- The children data is still fetched from the `/api/child-profiles` endpoint when needed
