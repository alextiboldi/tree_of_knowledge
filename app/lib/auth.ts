import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Server-side function to get the current session
 * Throws an error if no session is found
 */
export async function getCurrentSession() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("No active session found");
  }
  return session;
}

/**
 * Server-side function to get the current user
 * Redirects to sign-in if no session is found
 */
export async function getCurrentUser() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/auth/signin");
  }
  return session.user;
}

/**
 * Server-side function to require authentication
 * Redirects to sign-in if not authenticated
 */
export async function requireAuth() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/auth/signin");
  }
  return session;
}

/**
 * Get session optionally - returns null if no session
 */
export async function getOptionalSession() {
  try {
    const session = await auth();
    return session;
  } catch {
    return null;
  }
}
