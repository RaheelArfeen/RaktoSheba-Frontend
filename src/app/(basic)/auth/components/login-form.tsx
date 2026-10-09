"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Building2, HandHeart, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { demoLogin, login, type DemoRole } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { GoogleButton } from "./google-button";
import { loginSchema, type LoginValues } from "@/lib/validations";

const demos: { role: DemoRole; label: string; hint: string; icon: typeof HandHeart; tone: string }[] = [
  { role: "DONOR", label: "Donor", hint: "Find requests and say yes", icon: HandHeart, tone: "bg-mint text-forest" },
  { role: "HOSPITAL", label: "Hospital", hint: "Post and manage requests", icon: Building2, tone: "bg-blush text-blood" },
  { role: "ADMIN", label: "Admin", hint: "Verify and see the numbers", icon: ShieldCheck, tone: "bg-sand text-sand-deep" },
];

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [error, setError] = useState(initialError ?? "");
  const [pending, startTransition] = useTransition();
  // Which demo button is working, so only that one shows a spinner.
  const [demoPending, setDemoPending] = useState<DemoRole | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  // Server actions redirect on success, so we only ever get a value back when something failed.
  const run = (action: () => Promise<{ error: string } | void>, demo: DemoRole | null = null) => {
    setError("");
    setDemoPending(demo);
    startTransition(async () => {
      const result = await action();
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        setDemoPending(null);
      }
    });
  };

  return (
    <div className="space-y-8">
      <section aria-labelledby="demo-heading" className="rounded-[24px] border border-dashed border-ink/15 bg-cream/60 p-4 sm:p-5">
        <h2 id="demo-heading" className="text-sm font-bold">Just looking around?</h2>
        <p className="mt-1 text-sm text-ink-muted">Try a demo account in one click—no sign-up needed.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {demos.map(({ role, label, hint, icon: Icon, tone }) => (
            <button
              key={role}
              type="button"
              disabled={pending}
              onClick={() => run(() => demoLogin(role, next), role)}
              className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper p-3 text-left transition-colors hover:border-blood/30 hover:bg-cream disabled:opacity-60 sm:flex-col sm:items-start"
            >
              <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${tone}`}>
                {demoPending === role ? <Spinner className="size-4" /> : <Icon size={17} />}
              </span>
              <span>
                <span className="block text-sm font-extrabold">Demo {label.toLowerCase()}</span>
                <span className="block text-xs leading-5 text-ink-muted">{hint}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <form noValidate onSubmit={handleSubmit((values) => run(() => login(values, next)))} className="space-y-5">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <PasswordInput id="password" autoComplete="current-password" placeholder="Your password" aria-invalid={!!errors.password} {...register("password")} />
          <FieldError message={errors.password?.message} />
        </div>
        {error && (
          <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm font-semibold text-blood">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && !demoPending ? <Spinner className="text-cream" /> : <>Sign in <ArrowRight /></>}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs font-bold tracking-[.14em] text-ink-faint uppercase">
        <span className="h-px flex-1 bg-ink/10" /> or <span className="h-px flex-1 bg-ink/10" />
      </div>
      <GoogleButton next={next} />


      <p className="text-center text-sm text-ink-muted">
        New to RaktoSheba?{" "}
        <Link href="/auth/register" className="font-bold text-blood hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
