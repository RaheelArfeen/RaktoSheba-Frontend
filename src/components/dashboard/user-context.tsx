"use client";

import { createContext, useContext } from "react";
import type { AuthUser } from "@/types";

/** The signed-in user, provided once by DashboardShell so client pages can read it. */
const CurrentUserContext = createContext<AuthUser | null>(null);

export const CurrentUserProvider = CurrentUserContext.Provider;

export function useCurrentUser(): AuthUser {
  const user = useContext(CurrentUserContext);
  if (!user) throw new Error("useCurrentUser must be used inside the dashboard layout.");
  return user;
}
