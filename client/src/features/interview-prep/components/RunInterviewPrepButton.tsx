import { MessagesSquare } from "lucide-react";

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

type RunInterviewPrepButtonProps = {
  hasExistingSession: boolean;
  disabled?: boolean;
  pending?: boolean;
  onConfirm: () => void;
};

export function RunInterviewPrepButton({
  hasExistingSession,
  disabled,
  pending,
  onConfirm,
}: RunInterviewPrepButtonProps) {
  if (!hasExistingSession) {
    return (
      <Button
        type="button"
        className="cursor-pointer"
        disabled={disabled || pending}
        onClick={onConfirm}
      >
        <MessagesSquare className="size-4" />
        Generate interview prep
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
        <MessagesSquare className="size-4" />
        Generate new session
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Generate another session?</AlertDialogTitle>

          <AlertDialogDescription>
            This creates a new interview preparation session. Your previous
            results will remain available in session history.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm}>
            Generate session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
