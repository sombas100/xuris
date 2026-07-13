import { useEffect, useState } from "react";

import { ProcessingModal } from "@/components/shared/ProcessingModal";

type JobComparisonProcessingModalProps = {
  open: boolean;
};

const MESSAGES = [
  "Reading your resume and job advert.",
  "Comparing your skills with the requirements.",
  "Identifying missing keywords and risks.",
  "Preparing tailored recommendations.",
];

export function JobComparisonProcessingModal({
  open,
}: JobComparisonProcessingModalProps) {
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
      title="Comparing resume to job"
      description={MESSAGES[messageIndex]}
    />
  );
}
