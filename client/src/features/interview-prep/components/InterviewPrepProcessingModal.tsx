import { useEffect, useState } from "react";

import { ProcessingModal } from "@/components/shared/ProcessingModal";

type InterviewPrepProcessingModalProps = {
  open: boolean;
};

const MESSAGES = [
  "Reviewing your resume and job advert.",
  "Identifying likely interview topics.",
  "Preparing technical and behavioural questions.",
  "Creating personalised guidance and tips.",
];

export function InterviewPrepProcessingModal({
  open,
}: InterviewPrepProcessingModalProps) {
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
      title="Preparing your interview"
      description={MESSAGES[messageIndex]}
    />
  );
}
