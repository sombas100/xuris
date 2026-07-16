import type { ReactNode } from "react";

import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { PublicPageLayout } from "@/layouts/PublicPageLayout";

export function TermsPage() {
  return (
    <PublicPageLayout>
      <div className="mx-auto w-full max-w-4xl pb-24">
        <PublicPageHeader
          eyebrow="Terms and conditions"
          title="Terms for using Xuris."
          description="These terms describe the rules and responsibilities associated with using the Xuris platform."
        />

        <article className="space-y-10 rounded-3xl border border-white/10 bg-white/2.5 p-6 backdrop-blur-xl sm:p-10">
          <p className="text-sm text-white/40">Effective date: 15 July 2026</p>

          <TermsSection title="1. Acceptance of the terms">
            <p>
              By accessing or using Xuris, you agree to these terms. You should
              not use the service if you do not agree with them.
            </p>
          </TermsSection>

          <TermsSection title="2. Account responsibilities">
            <p>
              You are responsible for maintaining the accuracy of your account
              information and for activity performed through your account.
            </p>
          </TermsSection>

          <TermsSection title="3. AI-generated content">
            <p>
              Xuris provides AI-assisted analysis and generated content for
              informational purposes. Outputs may contain inaccuracies and
              should be reviewed before being used in an application.
            </p>

            <p>
              Xuris does not guarantee interviews, employment, job offers,
              application success or acceptance by an applicant tracking system.
            </p>
          </TermsSection>

          <TermsSection title="4. Acceptable use">
            <p>
              You must not misuse Xuris, attempt to disrupt the service, access
              another user’s information, automate excessive requests or use the
              platform for unlawful purposes.
            </p>
          </TermsSection>

          <TermsSection title="5. Plans and billing">
            <p>
              Paid subscriptions are billed according to the price shown at the
              time of purchase. Subscriptions may renew automatically until
              cancelled.
            </p>

            <p>
              Unlimited plans may remain subject to reasonable fair-use and
              abuse-prevention controls.
            </p>
          </TermsSection>

          <TermsSection title="6. User content">
            <p>
              You retain ownership of the resumes, job descriptions and other
              content you provide. You grant Xuris permission to process that
              content as needed to provide the requested service.
            </p>
          </TermsSection>

          <TermsSection title="7. Service availability">
            <p>
              Xuris may change, suspend or discontinue parts of the service.
              Continuous and error-free availability is not guaranteed.
            </p>
          </TermsSection>

          <TermsSection title="8. Limitation of liability">
            <p>
              To the extent permitted by law, Xuris will not be responsible for
              indirect losses, missed opportunities, employment decisions or
              reliance on AI-generated content.
            </p>
          </TermsSection>

          <TermsSection title="9. Termination">
            <p>
              Accounts may be restricted or terminated where these terms are
              violated or the platform is misused.
            </p>
          </TermsSection>

          <TermsSection title="10. Contact">
            <p>Questions about these terms can be sent to contact@xuris.app.</p>
          </TermsSection>
        </article>
      </div>
    </PublicPageLayout>
  );
}

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
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
