import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { PublicPageHeader } from "@/components/public/PublicPageHeader";

import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is Xuris?",
    answer:
      "Xuris is an AI-powered career workspace that helps users analyse resumes, compare them with job adverts, generate cover letters, prepare for interviews and track job applications.",
  },
  {
    question: "What counts as an AI generation?",
    answer:
      "An AI generation is an action that creates a new AI result, such as a resume analysis, job comparison, interview preparation session or cover letter.",
  },
  {
    question: "How many free AI generations do I receive?",
    answer:
      "Free users receive five AI generations each month. The usage allowance resets monthly.",
  },
  {
    question: "What does the Pro plan include?",
    answer:
      "The Pro plan includes unlimited AI generations across the core Xuris features for £9.99 per month, subject to fair-use protections.",
  },
  {
    question: "Which resume file types are supported?",
    answer: "Xuris currently supports PDF and DOCX resume uploads.",
  },
  {
    question: "Does Xuris guarantee interviews or job offers?",
    answer:
      "No. Xuris provides analysis and guidance, but hiring decisions depend on many factors controlled by employers and recruiters.",
  },
  {
    question: "Can I cancel Pro at any time?",
    answer:
      "Yes. Once Stripe subscriptions are enabled, Pro users will be able to manage or cancel their subscription through the billing portal.",
  },
  {
    question: "Is my resume used to train AI models?",
    answer:
      "Xuris processes resume content to provide the requested features. Your final privacy policy should explain the exact handling and retention of uploaded data before public launch.",
  },
];

export function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  return (
    <div className="mx-auto w-full max-w-4xl pb-24">
      <PublicPageHeader
        eyebrow="Frequently asked questions"
        title="Everything you need to know about Xuris."
        description="Find answers about plans, usage, supported files and how Xuris fits into your job search."
      />

      <section className="space-y-3">
        {faqs.map((faq, index) => {
          const open = openQuestion === index;

          return (
            <article
              key={faq.question}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/2.5 backdrop-blur-xl"
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenQuestion(open ? null : index)}
                className="flex w-full items-center justify-between gap-6 p-6 text-left"
              >
                <span className="font-medium text-white">{faq.question}</span>

                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-white/40 transition-transform",
                    open && "rotate-180 text-primary",
                  )}
                />
              </button>

              {open && (
                <div className="border-t border-white/10 px-6 pb-6 pt-5">
                  <p className="text-sm leading-7 text-white/55">
                    {faq.answer}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}
