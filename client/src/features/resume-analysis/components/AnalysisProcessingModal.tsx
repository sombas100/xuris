import { useEffect, useState } from "react";

import { ProcessingModal } from "@/components/shared/ProcessingModal";

type AnalysisProcessingModalProps = {
  open: boolean;
};

const PROCESSING_MESSAGES = [
  "Reading your resume content.",
  "Reviewing your skills and experience.",
  "Checking ATS compatibility and formatting.",
  "Preparing personalised recommendations.",
];

export function AnalysisProcessingModal({
  open,
}: AnalysisProcessingModalProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setMessageIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setMessageIndex((current) =>
        Math.min(current + 1, PROCESSING_MESSAGES.length - 1),
      );
    }, 2200);

    return () => {
      window.clearInterval(interval);
    };
  }, [open]);

  return (
    <ProcessingModal
      open={open}
      title="Analysing your resume"
      description={PROCESSING_MESSAGES[messageIndex]}
    />
  );
}
