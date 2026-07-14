import { useEffect, useState } from "react";

import { ProcessingModal } from "@/components/shared/ProcessingModal";

type CoverLetterProcessingModalProps = {
  open: boolean;
};

const MESSAGES = [
  "Reviewing your resume and job advert.",
  "Identifying your strongest relevant experience.",
  "Tailoring the letter to the role and company.",
  "Preparing your final cover letter.",
];

export function CoverLetterProcessingModal({
  open,
}: CoverLetterProcessingModalProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setMessageIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setMessageIndex((current) => Math.min(current + 1, MESSAGES.length - 1));
    }, 2200);

    return () => {
      window.clearInterval(interval);
    };
  }, [open]);

  return (
    <ProcessingModal
      open={open}
      title="Generating your cover letter"
      description={MESSAGES[messageIndex]}
    />
  );
}
