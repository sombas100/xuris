import { useState } from "react";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { PublicPageLayout } from "@/layouts/PublicPageLayout";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit() {
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please complete every field.");
      return;
    }

    const body = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");

    window.location.href = `mailto:contact@xuris.app?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <PublicPageLayout>
      <div className="mx-auto w-full max-w-7xl pb-24">
        <PublicPageHeader
          eyebrow="Contact"
          title="Have a question or want to share feedback?"
          description="Get in touch about Xuris, account support, partnerships or product feedback."
        />

        <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="space-y-5">
            <article className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MessageSquare className="size-5" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-white">
                Let’s talk
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/50">
                Feedback from real users will help shape the future of Xuris.
              </p>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/2.5 p-6">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-primary" />

                <div>
                  <p className="text-sm font-medium text-white">Email</p>

                  <p className="mt-1 text-sm text-white/45">
                    contact@xuris.app
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <MapPin className="size-5 text-primary" />

                <div>
                  <p className="text-sm font-medium text-white">Location</p>

                  <p className="mt-1 text-sm text-white/45">
                    London, United Kingdom
                  </p>
                </div>
              </div>
            </article>
          </aside>

          <section className="rounded-3xl border border-white/10 bg-white/2.5 p-6 backdrop-blur-xl sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <ContactField
                label="Name"
                value={name}
                onChange={setName}
                placeholder="Your name"
              />

              <ContactField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
              />
            </div>

            <div className="mt-5">
              <ContactField
                label="Subject"
                value={subject}
                onChange={setSubject}
                placeholder="How can we help?"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="contact-message"
                className="text-sm font-medium text-white"
              >
                Message
              </label>

              <textarea
                id="contact-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your message..."
                className="mt-2 min-h-48 w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white outline-none placeholder:text-white/30 focus:border-primary/40"
              />
            </div>

            <Button
              type="button"
              className="mt-6 cursor-pointer"
              onClick={handleSubmit}
            >
              Send message
            </Button>
          </section>
        </section>
      </div>
    </PublicPageLayout>
  );
}

type ContactFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (value: string) => void;
};

function ContactField({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: ContactFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-white">{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-primary/40"
      />
    </div>
  );
}
