"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { GoogleButton } from "./google-button";
import { loginSchema, type LoginValues } from "@/lib/validations";

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [error, setError] = useState(initialError ?? "");
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  // Server actions redirect on success, so we only ever get a value back when something failed.
  const run = (action: () => Promise<{ error: string } | void>) => {
    setError("");
    startTransition(async () => {
      const result = await action();
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
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
          <PasswordInput id="password" autoComplete="current-password" placeholder="Your password" aria-invalid={!!errors.password} {...register("password")} />
          <FieldError message={errors.password?.message} />
        </div>
        {error && (
          <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm font-semibold text-blood">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? <Spinner className="text-cream" /> : <>Sign in <ArrowRight /></>}
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
