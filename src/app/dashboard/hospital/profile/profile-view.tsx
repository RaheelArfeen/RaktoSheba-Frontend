"use client";

import { QueryError } from "@/components/dashboard/list-controls";
import { useCurrentUser } from "@/components/dashboard/user-context";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { useHospitalProfile } from "@/lib/queries/use-hospital";
import { HospitalProfileForm } from "./hospital-profile-form";
import { LicenceUpload } from "./licence-upload";
import { LogoUpload } from "./logo-upload";

export function HospitalProfileView() {
  const user = useCurrentUser();
  const profileQuery = useHospitalProfile();

  if (profileQuery.isPending) return <ProfileSkeleton />;

  const noProfile = profileQuery.error instanceof ApiError && profileQuery.error.status === 404;
  if (noProfile) {
    return (
      <div className="max-w-xl rounded-[26px] border border-ink/10 bg-cream p-6 text-center sm:p-8">
        <p className="text-lg font-bold">No hospital profile yet</p>
        <p className="mt-2 text-sm text-ink-muted">
          Your account doesn&apos;t have a hospital profile attached. Please contact support at{" "}
          <a href="mailto:support@raktosheba.org" className="font-semibold text-blood underline-offset-2 hover:underline">
            support@raktosheba.org
          </a>{" "}
          to get it set up.
        </p>
      </div>
    );
  }

  if (profileQuery.isError) return <QueryError error={profileQuery.error} onRetry={profileQuery.refetch} />;

  const hospital = profileQuery.data;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Eyebrow>Hospital profile</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">
          {hospital.name || "Your hospital"}
        </h1>
        <p className="mt-2 text-ink-muted">Signed in as {user.email}</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <LogoUpload logoUrl={hospital.logoUrl ?? null} />
        <LicenceUpload licenseDocUrl={hospital.licenseDocUrl ?? null} />
      </div>
      <HospitalProfileForm hospital={hospital} />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Skeleton className="h-[168px] rounded-[26px]" />
        <Skeleton className="h-[168px] rounded-[26px]" />
      </div>
      <Skeleton className="h-[760px] rounded-[26px]" />
    </div>
  );
}
