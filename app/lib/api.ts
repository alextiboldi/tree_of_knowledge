// API functions for TanStack Query integration
// Centralized API calls with proper error handling and types

// Types
export interface ChildContext {
  id?: string;
  age: number;
  name?: string;
  selectedDomains: string[];
}

export interface Answer {
  question: string;
  explanation: string;
  drawing_suggestion: string;
}

export interface ChildProfile {
  id: string;
  displayName: string;
  age: number;
  createdAt: string;
  lastActivity: string;
  selectedDomains: string[];
  domains: Array<{
    domain: {
      id: string;
      name: string;
      description: string;
    };
  }>;
}

export interface OnboardingState {
  onboardingComplete: boolean;
  children: ChildProfile[];
}

export interface ChildProfileData {
  id?: string;
  displayName: string;
  age: number;
  parentalConsent: boolean;
}

export interface AuthResponse {
  message: string;
  parent?: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  };
}

// Error handling utility
class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error || "An error occurred",
      data
    );
  }

  return data;
}

// AI Question API
export const aiApi = {
  askQuestion: async (
    question: string,
    childContext: ChildContext
  ): Promise<Answer & { success: boolean }> => {
    const response = await fetch("/api/ai/ask-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        childContext,
      }),
    });

    return handleResponse(response);
  },
};

// Child Profiles API
export const childProfilesApi = {
  // Create a new child profile
  createChild: async (
    childData: Omit<ChildProfileData, "id">
  ): Promise<{ child: ChildProfile }> => {
    const response = await fetch("/api/child-profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        displayName: childData.displayName.trim(),
        age: childData.age,
        parentalConsent: childData.parentalConsent,
      }),
    });

    return handleResponse(response);
  },

  // Get all children for the current user
  getChildren: async (): Promise<OnboardingState> => {
    const response = await fetch("/api/child-profiles", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse(response);
  },
};

// Domains API
export const domainsApi = {
  // Update child domains
  updateChildDomains: async (
    childId: string,
    domains: string[]
  ): Promise<{ message: string }> => {
    const response = await fetch(`/api/child-profiles/${childId}/domains`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domains }),
    });

    return handleResponse(response);
  },

  // Get child domains
  getChildDomains: async (
    childId: string
  ): Promise<{ child: ChildProfile; selectedDomains: string[] }> => {
    const response = await fetch(`/api/child-profiles/${childId}/domains`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return handleResponse(response);
  },
};

// Authentication API
export const authApi = {
  // Register a new parent
  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    return handleResponse(response);
  },
};

// Export the ApiError class for use in error handling
export { ApiError };
