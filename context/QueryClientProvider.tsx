import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  QueryClient,
  QueryClientProvider as RQProvider,
  focusManager,
} from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import React, { PropsWithChildren } from "react";
import { AppState } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const asyncStoragePersister = {
  persistClient: async (client: unknown) => {
    await AsyncStorage.setItem(
      "REACT_QUERY_OFFLINE_CACHE",
      JSON.stringify(client)
    );
  },
  restoreClient: async () => {
    const cache = await AsyncStorage.getItem("REACT_QUERY_OFFLINE_CACHE");
    return cache ? JSON.parse(cache) : undefined;
  },
  removeClient: async () => {
    await AsyncStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
  },
};

persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
});

focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener("change", (state) => {
    handleFocus(state === "active");
  });
  return () => subscription.remove();
});

export function QueryClientProvider({ children }: PropsWithChildren) {
  return <RQProvider client={queryClient}>{children}</RQProvider>;
}
