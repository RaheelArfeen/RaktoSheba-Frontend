"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Building2, HandHeart, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { demoLogin, login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/cn";
import { loginSchema, type LoginValues } from "@/lib/validations";
import type { Role } from "@/types";

const demos: { role: Role; title: string; text: string; icon: typeof ShieldCheck; tone: string }[] = [
  { role: "ADMIN", title: "Admin", text: "Verify hospitals and requests", icon: ShieldCheck, tone: "bg-sand text-sand-deep" },
  { role: "HOSPITAL", title: "Hospital", text: "Post and track blood requests", icon: Building2, tone: "bg-blush text-blood" },
  { role: "DONOR", title: "Donor", text: "See matches and accept", icon: HandHeart, tone: "bg-mint text-forest" },
];

export function LoginForm({ next }: { next?: string }) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [busyDemo, setBusyDemo] = useState<Role | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  // Server actions redirect on success, so we only ever get a value back when something failed.
  const run = (action: () => Promise<{ error: string } | void>, demo?: Role) => {
    setError("");
    setBusyDemo(demo ?? null);
    startTransition(async () => {
      const result = await action();
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        setBusyDemo(null);
      }
    });
  };

  return (
    <div className="space-y-8">
      <form noValidate onSubmit={handleSubmit((values) => run(() => login(values, next)))} className="space-y-5">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" placeholder="Your password" aria-invalid={!!errors.password} {...register("password")} />
          <FieldError message={errors.password?.message} />
        </div>
        {error && (
          <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm font-semibold text-blood">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && !busyDemo ? <Spinner className="text-cream" /> : <>Sign in <ArrowRight /></>}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs font-bold tracking-[.14em] text-ink-faint uppercase">
        <span className="h-px flex-1 bg-ink/10" /> Or try a demo account <span className="h-px flex-1 bg-ink/10" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {demos.map(({ role, title, text, icon: Icon, tone }) => (
          <button
            key={role}
            type="button"
            disabled={pending}
            onClick={() => run(() => demoLogin(role, next), role)}
            className="group flex flex-col items-start rounded-[22px] border border-ink/10 bg-cream p-4 text-left transition-all hover:-translate-y-0.5 hover:border-blood/25 hover:shadow-[0_14px_32px_rgba(91,44,30,.08)] disabled:opacity-60"
          >
            <span className={cn("grid size-10 place-items-center rounded-xl", tone)}>
              {busyDemo === role ? <Spinner className="size-5" /> : <Icon size={19} />}
            </span>
            <span className="mt-4 font-extrabold">{title}</span>
            <span className="mt-1 text-xs leading-5 text-ink-muted">{text}</span>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-blood">
              Demo login <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-ink-muted">
        New to RaktoSheba?{" "}
        <Link href="/auth/register" className="font-bold text-blood hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
