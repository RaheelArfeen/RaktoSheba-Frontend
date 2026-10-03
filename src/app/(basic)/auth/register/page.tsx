import type { Metadata } from "next";
import { HeartPulse } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { RegisterForm } from "../components/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Join RaktoSheba as a blood donor or hospital partner.",
};

export default async function RegisterPage({ searchParams }: PageProps<"/auth/register">) {
  const { role } = await searchParams;
  const initialRole = role === "donor" ? "DONOR" : role === "hospital" ? "HOSPITAL" : undefined;

  return (
    <Container className="grid gap-10 py-12 lg:grid-cols-[.9fr_1.1fr] lg:items-stretch lg:py-16">
      <div className="relative hidden overflow-hidden rounded-[32px] bg-mint p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-16 -right-16 size-72 rounded-full border-[40px] border-mint-strong/60" />
        <div className="relative">
          <Eyebrow className="text-forest">Join the network</Eyebrow>
          <h2 className="mt-5 max-w-[420px] font-display text-6xl leading-[1.05] tracking-[-.02em] text-forest-deep">Make your next yes count.</h2>
          <p className="mt-6 max-w-[380px] leading-7 text-[#4a806c]">
            Donors see only requests they can safely help with. Hospitals reach compatible donors nearby within minutes.
          </p>
        </div>
        <p className="relative flex items-center gap-3 text-xs font-semibold text-forest">
          <HeartPulse size={17} /> Free for donors and hospitals
        </p>
      </div>

      <div className="mx-auto w-full max-w-[520px] lg:py-6">
        <Eyebrow>Create account</Eyebrow>
        <h1 className="mt-3 mb-8 font-display text-5xl leading-[1.08] tracking-[-.02em]">Join RaktoSheba.</h1>
        <RegisterForm initialRole={initialRole} />
      </div>
    </Container>
  );
}
