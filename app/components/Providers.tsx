"use client";

import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "./I18nProvider";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import * as React from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
        // Set a default retry strategy
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors except for 408, 429
          if (error instanceof Error && "status" in error) {
            const status = (error as any).status;
            if (
              status >= 400 &&
              status < 500 &&
              status !== 408 &&
              status !== 429
            ) {
              return false;
            }
          }
          return failureCount < 3;
        },
        // Set default retry delay
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Set mutation retry strategy
        retry: (failureCount, error) => {
          // Don't retry mutations on 4xx errors except for 408, 429
          if (error instanceof Error && "status" in error) {
            const status = (error as any).status;
            if (
              status >= 400 &&
              status < 500 &&
              status !== 408 &&
              status !== 429
            ) {
              return false;
            }
          }
          return failureCount < 1; // Only retry once for mutations
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers({ children }: ProvidersProps) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>
          <I18nProvider>{children}</I18nProvider>
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
    </SessionProvider>
  );
}
