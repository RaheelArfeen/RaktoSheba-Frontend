import { API_BASE_URL } from "@/lib/api/client";

// Shared navigation and contact details for the public site.
export const publicNav = [
  { href: "/requests", label: "Find blood" },
  { href: "/donate", label: "Donate" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
] as const;

export const footerNav = [
  {
    title: "Get help",
    links: [
      { href: "/emergency", label: "Emergency help" },
      { href: "/requests", label: "Open requests" },
      { href: "/#compatibility", label: "Blood compatibility" },
    ],
  },
  {
    title: "Give",
    links: [
      { href: "/donate", label: "Can I donate?" },
      { href: "/register", label: "Become a donor" },
      { href: "/fund", label: "Emergency fund" },
    ],
  },
  {
    title: "RaktoSheba",
    links: [
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

export const contact = {
  email: "hello@raktosheba.org",
  emergencyLine: "16263",
  city: "Dhaka, Bangladesh",
  apiDocs: `${API_BASE_URL}/api/v1/docs`,
};
