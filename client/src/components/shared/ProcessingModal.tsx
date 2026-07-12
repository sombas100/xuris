import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";

type ProcessingModalProps = {
  open: boolean;
  title: string;
  description?: string;
};

export function ProcessingModal({
  open,
  title,
  description,
}: ProcessingModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="processing-modal-title"
      aria-describedby={
        description ? "processing-modal-description" : undefined
      }
    >
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-background p-8 text-center shadow-2xl">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10">
          <LoaderCircle
            className="size-7 animate-spin text-primary"
            aria-hidden="true"
          />
        </div>

        <h2
          id="processing-modal-title"
          className="mt-5 text-xl font-semibold text-white"
        >
          {title}
        </h2>

        {description && (
          <p
            id="processing-modal-description"
            className="mt-2 text-sm leading-6 text-white/50"
          >
            {description}
          </p>
        )}

        <p className="mt-5 text-xs text-white/35">
          Please keep this page open.
        </p>
      </div>
    </div>
  );
}
