"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  BellOff,
  Building2,
  CheckCheck,
  CircleCheck,
  CircleX,
  Droplets,
  HandHeart,
  HeartHandshake,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { timeAgo } from "@/lib/format";
import { qk } from "@/lib/queries/keys";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationSocket,
  useNotifications,
} from "@/lib/queries/use-notifications";
import type { AppNotification, NotificationFeed, Role } from "@/types";

const typeStyle: Record<string, { icon: LucideIcon; tone: string }> = {
  REQUEST_MATCH: { icon: Droplets, tone: "bg-blush text-blood" },
  NEW_REQUEST: { icon: Inbox, tone: "bg-sand text-sand-deep" },
  REQUEST_VERIFIED: { icon: CircleCheck, tone: "bg-mint text-forest" },
  DONOR_ACCEPTED: { icon: HandHeart, tone: "bg-mint text-forest" },
  DONOR_WITHDREW: { icon: CircleX, tone: "bg-sand text-sand-deep" },
  REQUEST_FULFILLED: { icon: HeartHandshake, tone: "bg-mint text-forest" },
  REQUEST_CANCELLED: { icon: CircleX, tone: "bg-linen text-ink-muted" },
  HOSPITAL_VERIFIED: { icon: Building2, tone: "bg-mint text-forest" },
  HOSPITAL_REJECTED: { icon: Building2, tone: "bg-blush text-blood" },
};
const fallbackStyle = { icon: Bell, tone: "bg-linen text-ink-muted" };

// Which dashboard data a new notification can make stale, so it refreshes by itself.
const roleScope: Record<Role, readonly string[]> = { DONOR: qk.donor.all, HOSPITAL: qk.hospital.all, ADMIN: qk.admin.all };

type NotificationCenter = {
  live: boolean;
  feed: ReturnType<typeof useNotifications>;
  go: (n: AppNotification) => void;
};

const NotificationContext = createContext<NotificationCenter | null>(null);

/**
 * Owns the one live socket and the feed for the signed-in user. New notifications arrive
 * over Socket.io when available, otherwise by polling; either way they pop up as a toast.
 * Bells anywhere inside just display it, so several bells never mean several sockets.
 */
export function NotificationProvider({ role, children }: { role: Role; children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  // Ids already shown (or loaded on first visit), so each notification toasts once.
  const seen = useRef<Set<string> | null>(null);

  const go = useCallback(
    (n: AppNotification) => {
      if (n.link) router.push(n.link);
    },
    [router],
  );

  const announce = useCallback(
    (n: AppNotification) => {
      toast(n.title, {
        description: n.message,
        action: n.link ? { label: "View", onClick: () => go(n) } : undefined,
      });
      queryClient.invalidateQueries({ queryKey: roleScope[role] });
    },
    [go, queryClient, role],
  );

  const live = useNotificationSocket((n) => {
    seen.current?.add(n.id);
    queryClient.setQueryData<NotificationFeed>(qk.notifications(), (feed) =>
      feed ? { unread: feed.unread + 1, items: [n, ...feed.items].slice(0, 30) } : feed,
    );
    announce(n);
  });

  const feed = useNotifications(live);
  const { data } = feed;

  // Polling path: toast anything unread that appeared since the last check.
  useEffect(() => {
    if (!data) return;
    if (!seen.current) {
      seen.current = new Set(data.items.map((n) => n.id));
      return;
    }
    for (const n of data.items) {
      if (!seen.current.has(n.id)) {
        seen.current.add(n.id);
        if (!n.readAt) announce(n);
      }
    }
  }, [data, announce]);

  return <NotificationContext.Provider value={{ live, feed, go }}>{children}</NotificationContext.Provider>;
}

/** The bell: unread badge plus a dropdown list. Must sit inside a NotificationProvider. */
export function NotificationBell({ placement = "below" }: { placement?: "below" | "side" }) {
  const center = useContext(NotificationContext);
  if (!center) throw new Error("NotificationBell must be inside a NotificationProvider.");
  const { live, feed, go: navigate } = center;
  const { data, isPending, isError } = feed;
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const [open, setOpen] = useState(false);
  const go = (n: AppNotification) => {
    setOpen(false);
    navigate(n);
  };

  const unread = data?.unread ?? 0;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        className={cn(
          "relative grid size-10 place-items-center rounded-full border transition-colors",
          placement === "side"
            ? "border-white/15 text-[#f2d8ca]/80 hover:bg-white/10 hover:text-white"
            : "border-ink/12 text-ink hover:border-blood/30 hover:text-blood",
        )}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-blood px-1 text-[10px] font-extrabold text-cream ring-2 ring-paper">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          aria-label="Notifications"
          side={placement === "side" ? "right" : "bottom"}
          align={placement === "side" ? "start" : "end"}
          sideOffset={10}
          collisionPadding={12}
          className="animate-fade-in z-50 flex max-h-[min(560px,80vh)] w-[min(380px,calc(100vw-24px))] flex-col overflow-hidden rounded-[22px] border border-ink/10 bg-cream text-ink shadow-[0_24px_60px_rgba(62,41,36,.22)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4">
            <div>
              <p className="font-bold">Notifications</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-faint">
                <span className={cn("size-1.5 rounded-full", live ? "bg-forest" : "bg-ink/25")} aria-hidden />
                {live ? "Live updates on" : "Checks for updates every 20 seconds"}
              </p>
            </div>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => markAll.mutate()}
                className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold text-blood hover:bg-blush"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto overscroll-contain">
            {isPending ? (
              <div className="space-y-3 p-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="size-9 shrink-0 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-2/3" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <p className="p-6 text-center text-sm text-ink-muted">We couldn&apos;t load your notifications. Try again in a moment.</p>
            ) : data.items.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-linen text-ink-faint">
                  <BellOff size={20} />
                </span>
                <p className="mt-4 font-bold">You&apos;re all caught up</p>
                <p className="mt-1 text-sm text-ink-muted">New matches and updates will show up here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-ink/[.07]">
                {data.items.map((n) => {
                  const { icon: Icon, tone } = typeStyle[n.type] ?? fallbackStyle;
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (!n.readAt) markRead.mutate(n.id);
                          go(n);
                        }}
                        className={cn(
                          "flex w-full gap-3 px-5 py-3.5 text-left transition-colors hover:bg-linen/70",
                          !n.readAt && "bg-blush/30",
                        )}
                      >
                        <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", tone)}>
                          <Icon size={17} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-2">
                            <span className="text-sm font-bold">{n.title || "Update"}</span>
                            {!n.readAt && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blood" aria-label="Unread" />}
                          </span>
                          {n.message && <span className="mt-0.5 block text-sm leading-5 text-ink-muted">{n.message}</span>}
                          <span className="mt-1 block text-xs font-semibold text-ink-faint">{timeAgo(n.sentAt)}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
