// Custom hooks using TanStack Query for API operations
// Provides optimized caching, error handling, and loading states

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  aiApi,
  childProfilesApi,
  domainsApi,
  authApi,
  ChildContext,
  Answer,
  OnboardingState,
  ChildProfileData,
  AuthResponse,
  ApiError,
} from "../lib/api";

// Query Keys for consistent caching
export const queryKeys = {
  children: ["children"] as const,
  childDomains: (childId: string) => ["childDomains", childId] as const,
  onboardingStatus: ["onboardingStatus"] as const,
};

// AI Question Hook
export function useAskQuestion(
  options?: UseMutationOptions<
    Answer & { success: boolean },
    ApiError,
    { question: string; childContext: ChildContext }
  >
) {
  return useMutation({
    mutationFn: ({ question, childContext }) =>
      aiApi.askQuestion(question, childContext),
    ...options,
  });
}

// Child Profiles Hooks
export function useCreateChild(
  options?: UseMutationOptions<
    { child: any },
    ApiError,
    Omit<ChildProfileData, "id">
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: childProfilesApi.createChild,
    onSuccess: (data, variables) => {
      // Invalidate children queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.children });
      queryClient.invalidateQueries({ queryKey: queryKeys.onboardingStatus });

      // Optionally set the new child data in cache
      queryClient.setQueryData(
        queryKeys.children,
        (oldData: OnboardingState | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            children: [...oldData.children, data.child],
          };
        }
      );

      options?.onSuccess?.(data, variables, undefined);
    },
    ...options,
  });
}

export function useChildren(
  options?: UseQueryOptions<OnboardingState, ApiError>
) {
  return useQuery({
    queryKey: queryKeys.children,
    queryFn: childProfilesApi.getChildren,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

// Domains Hooks
export function useUpdateChildDomains(
  options?: UseMutationOptions<
    { message: string },
    ApiError,
    { childId: string; domains: string[] }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ childId, domains }) =>
      domainsApi.updateChildDomains(childId, domains),
    onSuccess: (data, variables) => {
      // Invalidate and refetch child domains
      queryClient.invalidateQueries({
        queryKey: queryKeys.childDomains(variables.childId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.children });

      options?.onSuccess?.(data, variables, undefined);
    },
    ...options,
  });
}

export function useChildDomains(
  childId: string,
  options?: UseQueryOptions<{ child: any; selectedDomains: string[] }, ApiError>
) {
  return useQuery({
    queryKey: queryKeys.childDomains(childId),
    queryFn: () => domainsApi.getChildDomains(childId),
    enabled: !!childId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

// Authentication Hooks
export function useRegister(
  options?: UseMutationOptions<
    AuthResponse,
    ApiError,
    { email: string; password: string; name: string }
  >
) {
  return useMutation({
    mutationFn: ({ email, password, name }) =>
      authApi.register(email, password, name),
    ...options,
  });
}

// Onboarding Status Hook (alias for useChildren with different key for clarity)
export function useOnboardingStatus(
  options?: UseQueryOptions<OnboardingState, ApiError>
) {
  return useQuery({
    queryKey: queryKeys.onboardingStatus,
    queryFn: childProfilesApi.getChildren,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for onboarding status)
    gcTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// Utility hook to invalidate all queries
export function useInvalidateAllQueries() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries();
  };
}

// Hook to refresh onboarding status specifically
export function useRefreshOnboardingStatus() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.onboardingStatus });
    queryClient.invalidateQueries({ queryKey: queryKeys.children });
  };
}

// Age Testing Interface Hook (for multiple parallel queries)
export function useMultipleAgeQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      question,
      ages,
    }: {
      question: string;
      ages: number[];
    }) => {
      const responses = await Promise.all(
        ages.map(async (age) => {
          const childContext: ChildContext = {
            age,
            name: `TestChild${age}`,
            selectedDomains: [
              "science-technology",
              "nature-environment",
              "math-logic",
            ],
          };

          try {
            const response = await aiApi.askQuestion(question, childContext);
            return {
              age,
              explanation: response.explanation,
              drawing_suggestion: response.drawing_suggestion,
            };
          } catch (error) {
            console.error(`Error for age ${age}:`, error);
            return null;
          }
        })
      );

      return responses.filter(Boolean);
    },
  });
}
