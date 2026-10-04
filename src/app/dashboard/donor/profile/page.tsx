import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/eyebrow";
import { donorApi } from "@/lib/donors";
import { getSession } from "@/lib/session";
import { NoProfile } from "../components/no-profile";
import { PhotoUpload } from "./photo-upload";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "My profile" };

export default async function DonorProfilePage() {
  const session = (await getSession())!;
  const profile = await donorApi.me(session.accessToken).catch(() => null);
  if (!profile) return <NoProfile />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="mb-8">
        <Eyebrow>My profile</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">Your donor details</h1>
        <p className="mt-2 text-ink-muted">Signed in as {session.user.email}</p>
      </div>
      <PhotoUpload photoUrl={profile.photoUrl} />
      <ProfileForm profile={profile} />
    </div>
  );
}
