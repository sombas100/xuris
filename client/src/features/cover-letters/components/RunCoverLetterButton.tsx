import { FilePenLine } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type RunCoverLetterButtonProps = {
  hasExistingLetter: boolean;
  disabled?: boolean;
  pending?: boolean;
  onConfirm: () => void;
};

export function RunCoverLetterButton({
  hasExistingLetter,
  disabled,
  pending,
  onConfirm,
}: RunCoverLetterButtonProps) {
  if (!hasExistingLetter) {
    return (
      <Button
        type="button"
        className="cursor-pointer"
        disabled={disabled || pending}
        onClick={onConfirm}
      >
        <FilePenLine className="size-4" />
        Generate cover letter
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            className="cursor-pointer"
            disabled={disabled || pending}
          />
        }
      >
        <FilePenLine className="size-4" />
        Generate new letter
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Generate another cover letter?</AlertDialogTitle>

          <AlertDialogDescription>
            This creates a new cover letter. Your previous letters will remain
            available in generation history.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm}>
            Generate letter
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
