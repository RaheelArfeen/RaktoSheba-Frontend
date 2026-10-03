import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { safeNext } from "@/lib/session";
import { LoginForm } from "../components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your RaktoSheba donor, hospital or admin workspace.",
};

export default async function LoginPage({ searchParams }: PageProps<"/auth/login">) {
  const { next, error } = await searchParams;
  const nextPath = safeNext(next, "") || undefined;
  const initialError = typeof error === "string" ? error.slice(0, 200) : undefined;

  return (
    <Container className="grid gap-10 py-12 lg:grid-cols-[.9fr_1.1fr] lg:items-stretch lg:py-16">
      <div className="relative hidden overflow-hidden rounded-[32px] bg-maroon p-10 text-cream lg:flex lg:flex-col lg:justify-between">
        <div className="absolute top-20 -right-28 size-[460px] rounded-full border-[64px] border-white/[.06]" />
        <div className="absolute -bottom-40 -left-24 size-[400px] rounded-full border-[50px] border-mint-strong/10" />
        <div className="relative">
          <Eyebrow className="text-mint-strong">A little good, made easier</Eyebrow>
          <h2 className="mt-5 max-w-[420px] font-display text-6xl leading-[1.05] tracking-[-.02em]">A safer path to showing up.</h2>
          <p className="mt-6 max-w-[380px] leading-7 text-[#f2d8ca]/75">
            Your account keeps donor availability, hospital requests and every important update in one calm place.
          </p>
        </div>
        <p className="relative flex items-center gap-3 text-xs font-semibold text-[#f2d8ca]/70">
          <ShieldCheck size={17} className="text-mint-strong" /> Secure sign-in · role-based workspace
        </p>
      </div>

      <div className="mx-auto w-full max-w-[520px] lg:py-6">
        <Eyebrow>Welcome back</Eyebrow>
        <h1 className="mt-3 font-display text-5xl leading-[1.08] tracking-[-.02em]">Good to see you.</h1>
        <p className="mt-4 mb-8 leading-7 text-ink-muted">Sign in to see requests and keep your profile ready.</p>
        <LoginForm next={nextPath} initialError={initialError} />
      </div>
    </Container>
  );
}
