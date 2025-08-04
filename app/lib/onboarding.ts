export interface OnboardingState {
  onboardingComplete: boolean;
  children: Array<{
    id: string;
    displayName: string;
    age: number;
    createdAt: string;
    updatedAt?: string; // Made optional since API might not always return this
    domains: Array<{
      domain: {
        id: string;
        name: string;
        description: string;
      };
    }>;
  }>;
}

export interface ChildProfileData {
  id?: string;
  displayName: string;
  age: number;
  parentalConsent: boolean;
}

export type OnboardingStep =
  | "landing"
  | "registration"
  | "child-profile"
  | "domain-selection"
  | "dashboard"
  | "app";

/**
 * Fetch the current user's onboarding status
 * @deprecated Use the useChildren or useOnboardingStatus hooks from @/app/hooks/useApi instead
 * This function is kept for backward compatibility but should be replaced with TanStack Query hooks
 */
export async function fetchOnboardingStatus(): Promise<OnboardingState | null> {
  // Import the API function to maintain consistency
  const { childProfilesApi } = await import("./api");

  try {
    const data = await childProfilesApi.getChildren();
    return {
      onboardingComplete: data.onboardingComplete ?? false,
      children: data.children || [],
    };
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    return null;
  }
}

/**
 * Determine the appropriate onboarding step based on authentication and onboarding status
 */
export function determineOnboardingStep(
  isAuthenticated: boolean,
  onboardingState: OnboardingState | null
): OnboardingStep {
  if (!isAuthenticated) {
    return "landing";
  }

  if (!onboardingState) {
    return "landing";
  }

  if (onboardingState.onboardingComplete) {
    return "dashboard";
  }

  // User is authenticated but hasn't completed onboarding
  // Check if they have any children to determine where they left off
  if (onboardingState.children.length === 0) {
    return "child-profile";
  }

  // They have children but onboarding isn't complete, so they probably need to select domains
  const firstChild = onboardingState.children[0];
  if (firstChild.domains.length === 0) {
    return "domain-selection";
  }

  // This shouldn't happen, but fallback to dashboard
  return "dashboard";
}

/**
 * Get the first child's context for the app
 */
export function getChildContext(onboardingState: OnboardingState | null) {
  if (!onboardingState || onboardingState.children.length === 0) {
    return undefined;
  }

  const firstChild = onboardingState.children[0];
  return {
    id: firstChild.id,
    age: firstChild.age,
    name: firstChild.displayName,
    selectedDomains: firstChild.domains.map((d) => d.domain.name),
  };
}

/**
 * Update the session token to refresh onboardingComplete status
 * Call this after updating the parent's onboardingComplete status in the database
 * Note: The session will be refreshed on the next page load/session check
 */
export async function refreshSessionToken(): Promise<void> {
  try {
    // Force a page reload to refresh the session token
    // The JWT callback will refetch onboardingComplete from the database
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  } catch (error) {
    console.error("Error refreshing session token:", error);
  }
}
