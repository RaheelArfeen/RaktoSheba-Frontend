// Copy shared between the home page and the dedicated public pages.

export const faqs = [
  {
    question: "Who can create a blood request?",
    answer:
      "Verified hospitals can create requests with a blood group, number of units, urgency, and location. An admin verifies each request before compatible donors are notified.",
  },
  {
    question: "How does RaktoSheba choose a donor?",
    answer:
      "The matching engine checks ABO/Rh compatibility, donor availability, the 90-day eligibility rule, and distance from the hospital—then surfaces the closest suitable donors first.",
  },
  {
    question: "Can a donor change their availability?",
    answer:
      "Yes. Donors can switch their availability on or off at any time from their workspace. Taking a break simply removes them from new match notifications.",
  },
  {
    question: "What happens after a donor accepts?",
    answer:
      "Acceptance is transaction-safe, so a request can never be assigned to two donors at once. The hospital sees the match, and marks the request fulfilled once the donation is complete.",
  },
  {
    question: "How often can I donate?",
    answer:
      "Whole-blood donors must wait at least 90 days between donations. RaktoSheba tracks this for you and won't show you requests until you're eligible again.",
  },
  {
    question: "Is my personal information shared publicly?",
    answer:
      "No. Public request boards show only the blood group, units, urgency and hospital. Donor identities are shared only with the hospital a donor has agreed to help.",
  },
];

export const howItWorks = [
  {
    step: "01",
    tone: "text-peach",
    title: "A hospital asks",
    text: "A verified hospital posts the blood type, units, urgency and location.",
  },
  {
    step: "02",
    tone: "text-mint-strong",
    title: "The right people know",
    text: "Compatible, eligible donors nearby receive a focused notification.",
  },
  {
    step: "03",
    tone: "text-gold",
    title: "A donor says yes",
    text: "A transaction-safe acceptance locks the match and moves care forward.",
  },
];
