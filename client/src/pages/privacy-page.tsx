import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { PublicPageLayout } from "@/layouts/PublicPageLayout";

export function PrivacyPage() {
  return (
    <PublicPageLayout>
      <div className="mx-auto w-full max-w-4xl pb-24">
        <PublicPageHeader
          eyebrow="Privacy policy"
          title="Your data and privacy."
          description="This policy explains the types of information Xuris may process and how that information is used."
        />

        <LegalContent>
          <LegalSection title="1. Information we collect">
            <p>
              Xuris may collect account information such as your name, email
              address and profile details when you create or use an account.
            </p>

            <p>
              Xuris also processes information you provide through the service,
              including resumes, job descriptions, application records, notes
              and AI-generated results.
            </p>
          </LegalSection>

          <LegalSection title="2. How information is used">
            <p>
              Information is used to provide, maintain and improve Xuris,
              authenticate users, generate requested AI outputs, store user
              activity and deliver account-related functionality.
            </p>
          </LegalSection>

          <LegalSection title="3. Service providers">
            <p>
              Xuris may use third-party providers for authentication, cloud
              storage, database hosting, artificial intelligence processing,
              analytics and payments.
            </p>
          </LegalSection>

          <LegalSection title="4. Data retention">
            <p>
              Information may be retained for as long as your account remains
              active or as needed to provide the service. Users may delete
              certain stored content through the application.
            </p>
          </LegalSection>

          <LegalSection title="5. Data security">
            <p>
              Reasonable technical and organisational measures are used to
              protect information. However, no online service can guarantee
              complete security.
            </p>
          </LegalSection>

          <LegalSection title="6. Your rights">
            <p>
              Depending on your location, you may have rights regarding access,
              correction, deletion, restriction or portability of your personal
              information.
            </p>
          </LegalSection>

          <LegalSection title="7. Contact">
            <p>Privacy questions can be sent to contact@xuris.app.</p>
          </LegalSection>

          <LegalSection title="8. Changes to this policy">
            <p>
              This policy may be updated as Xuris develops. Material changes
              will be reflected by updating the effective date.
            </p>
          </LegalSection>
        </LegalContent>
      </div>
    </PublicPageLayout>
  );
}

function LegalContent({ children }: { children: React.ReactNode }) {
  return (
    <article className="space-y-10 rounded-3xl border border-white/10 bg-white/2.5 p-6 backdrop-blur-xl sm:p-10">
      <p className="text-sm text-white/40">Effective date: 15 July 2026</p>

      {children}
    </article>
  );
}

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white">{title}</h2>

      <div className="mt-4 space-y-4 text-sm leading-7 text-white/55">
        {children}
      </div>
    </section>
  );
}
