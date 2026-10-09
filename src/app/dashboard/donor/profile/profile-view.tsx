"use client";

import { QueryError } from "@/components/dashboard/list-controls";
import { useCurrentUser } from "@/components/dashboard/user-context";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { useDonorProfile } from "@/lib/queries/use-donor";
import { NoProfile } from "../components/no-profile";
import { PhotoUpload } from "./photo-upload";
import { ProfileForm } from "./profile-form";

export function DonorProfileView() {
  const user = useCurrentUser();
  const profileQuery = useDonorProfile();

  if (profileQuery.isPending) return <ProfileSkeleton />;

  const noProfile = profileQuery.error instanceof ApiError && profileQuery.error.status === 404;
  if (noProfile) return <NoProfile />;
  if (profileQuery.isError) return <QueryError error={profileQuery.error} onRetry={profileQuery.refetch} />;

  const profile = profileQuery.data;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="mb-8">
        <Eyebrow>My profile</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">Your donor details</h1>
        <p className="mt-2 text-ink-muted">Signed in as {user.email}</p>
      </div>
      <PhotoUpload photoUrl={profile.photoUrl} />
      <ProfileForm profile={profile} />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-4 w-52" />
      </div>
      <Skeleton className="h-[152px] rounded-[26px]" />
      <Skeleton className="h-[520px] rounded-[26px]" />
    </div>
  );
}
