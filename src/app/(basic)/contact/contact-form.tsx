"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/input";
import { contact } from "@/lib/site";
import { CONTACT_TOPICS, contactSchema, type ContactValues } from "@/lib/validations";

/** Validated in the browser, then handed to the visitor's email app — nothing is sent silently. */
export function ContactForm() {
  const [opened, setOpened] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), mode: "onTouched" });
  const message = useWatch({ control, name: "message" }) ?? "";

  const onSubmit = (values: ContactValues) => {
    const topic = CONTACT_TOPICS.find((t) => t.value === values.topic)?.label ?? "Message";
    const subject = encodeURIComponent(`[RaktoSheba] ${topic} — ${values.name}`);
    const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);
    window.location.assign(`mailto:${contact.email}?subject=${subject}&body=${body}`);
    setOpened(true);
    toast.success("Your email app should open with the message ready to send.");
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-[28px] border border-ink/10 bg-cream p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
      </div>
      <div>
        <Label htmlFor="topic">Topic</Label>
        <Select id="topic" defaultValue="" aria-invalid={!!errors.topic} {...register("topic")}>
          <option value="" disabled>
            What is this about?
          </option>
          {CONTACT_TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
        <FieldError message={errors.topic?.message} />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <Label htmlFor="message">Message</Label>
          <span className={`text-xs font-semibold ${message.length > 2000 ? "text-blood" : "text-ink-faint"}`}>{message.length}/2000</span>
        </div>
        <Textarea id="message" rows={6} aria-invalid={!!errors.message} {...register("message")} />
        <FieldError message={errors.message?.message} />
      </div>
      <Button type="submit" size="lg" className="w-full">
        <Send /> Write the email
      </Button>
      {opened && (
        <p className="flex items-center justify-center gap-2 text-xs text-ink-muted">
          <Mail size={13} /> Didn&apos;t open? Email us directly at{" "}
          <a href={`mailto:${contact.email}`} className="font-bold text-blood">
            {contact.email}
          </a>
        </p>
      )}
    </form>
  );
}
