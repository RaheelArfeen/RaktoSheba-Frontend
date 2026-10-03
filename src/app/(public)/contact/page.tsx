import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import PageHeader from "@/components/shared/PageHeader";
import { contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the RaktoSheba team about donating, hospital partnerships or a blood request.",
};

const channels = [
  { icon: Phone, label: "Emergency line", value: contact.emergencyLine, href: `tel:${contact.emergencyLine}`, note: "24/7, for urgent blood needs" },
  { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}`, note: "We reply within one working day" },
  { icon: MapPin, label: "Based in", value: contact.city, note: "Serving hospitals across Bangladesh" },
  { icon: Clock, label: "Office hours", value: "Sun–Thu, 9am–6pm", note: "Bangladesh time (GMT+6)" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We're here to help."
        description="For anything urgent, call the emergency line. For everything else, send us a message and we'll get back to you."
      />
      <section className="page-container grid gap-10 py-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <ul className="space-y-3">
          {channels.map(({ icon: Icon, label, value, href, note }) => (
            <li key={label} className="flex gap-4 rounded-[22px] border border-ink/10 bg-cream p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blush text-blood">
                <Icon size={19} />
              </span>
              <div>
                <p className="text-xs font-bold tracking-[.12em] text-ink-faint uppercase">{label}</p>
                {href ? (
                  <a href={href} className="mt-1 block font-extrabold hover:text-blood">
                    {value}
                  </a>
                ) : (
                  <p className="mt-1 font-extrabold">{value}</p>
                )}
                <p className="mt-0.5 text-sm text-ink-muted">{note}</p>
              </div>
            </li>
          ))}
        </ul>
        <ContactForm />
      </section>
    </>
  );
}
