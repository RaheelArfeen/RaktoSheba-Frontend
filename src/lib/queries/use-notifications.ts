"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { clientApi } from "@/lib/client-api";
import type { AppNotification, NotificationFeed } from "@/types";
import { qk } from "./keys";

/** Set only where the API runs as a long-lived server (local dev, Render…). Empty on Vercel. */
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL?.replace(/\/$/, "");

/** How often the bell checks for news when no live socket is connected. */
const POLL_MS = 20_000;

/**
 * Opens the live notification socket and calls `onNotification` for each push.
 * Returns whether the socket is connected; while it isn't, callers poll instead.
 */
export function useNotificationSocket(onNotification: (n: AppNotification) => void) {
  const [live, setLive] = useState(false);
  const handler = useRef(onNotification);
  useEffect(() => {
    handler.current = onNotification;
  });

  useEffect(() => {
    if (!SOCKET_URL) return;
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      // Called on every (re)connect: the browser can't read the httpOnly login cookie,
      // so it trades it (through the same-origin proxy) for a 5-minute socket pass.
      auth: (cb) => {
        clientApi<{ token: string }>("/notifications/socket-token", { method: "POST" })
          .then(({ token }) => cb({ token }))
          .catch(() => cb({}));
      },
    });
    socket.on("connect", () => setLive(true));
    socket.on("disconnect", () => setLive(false));
    socket.on("connect_error", () => setLive(false));
    socket.on("notification", (n: AppNotification) => handler.current(n));
    return () => {
      socket.close();
    };
  }, []);

  return live;
}

// Older API versions returned a bare list; accept both so the bell never breaks mid-deploy.
const toFeed = (data: NotificationFeed | AppNotification[]): NotificationFeed =>
  Array.isArray(data) ? { items: data.slice(0, 30), unread: data.filter((n) => !n.readAt).length } : data;

/** The bell's feed. Polls every 20 s unless a live socket is delivering updates. */
export function useNotifications(live: boolean) {
  return useQuery({
    queryKey: qk.notifications(),
    queryFn: async () => toFeed(await clientApi<NotificationFeed | AppNotification[]>("/notifications/me")),
    refetchInterval: live ? false : POLL_MS,
    staleTime: 10_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi(`/notifications/${id}/read`, { method: "PATCH" }),
    onMutate: (id) => {
      queryClient.setQueryData<NotificationFeed>(qk.notifications(), (feed) => {
        if (!feed) return feed;
        const target = feed.items.find((n) => n.id === id);
        if (!target || target.readAt) return feed;
        return {
          unread: Math.max(0, feed.unread - 1),
          items: feed.items.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)),
        };
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk.notifications() }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clientApi("/notifications/me/read-all", { method: "PATCH" }),
    onMutate: () => {
      const now = new Date().toISOString();
      queryClient.setQueryData<NotificationFeed>(qk.notifications(), (feed) =>
        feed ? { unread: 0, items: feed.items.map((n) => ({ ...n, readAt: n.readAt ?? now })) } : feed,
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk.notifications() }),
  });
}
