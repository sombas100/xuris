import { useEffect, useState } from "react";

import { ProcessingModal } from "@/components/shared/ProcessingModal";

type JobPostProcessingModalProps = {
  open: boolean;
};

const MESSAGES = [
  "Reading the job advert.",
  "Identifying the role and company.",
  "Extracting requirements and responsibilities.",
  "Preparing the advert for comparison.",
];

export function JobPostProcessingModal({ open }: JobPostProcessingModalProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setMessageIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setMessageIndex((current) => Math.min(current + 1, MESSAGES.length - 1));
    }, 2000);

    return () => {
      window.clearInterval(interval);
    };
  }, [open]);

  return (
    <ProcessingModal
      open={open}
      title="Processing job advert"
      description={MESSAGES[messageIndex]}
    />
  );
}
