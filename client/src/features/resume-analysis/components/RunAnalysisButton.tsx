import { Sparkles } from "lucide-react";

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

type RunAnalysisButtonProps = {
  hasExistingAnalysis: boolean;
  disabled?: boolean;
  pending?: boolean;
  onConfirm: () => void;
};

export function RunAnalysisButton({
  hasExistingAnalysis,
  disabled,
  pending,
  onConfirm,
}: RunAnalysisButtonProps) {
  if (!hasExistingAnalysis) {
    return (
      <Button
        type="button"
        className="cursor-pointer"
        disabled={disabled || pending}
        onClick={onConfirm}
      >
        <Sparkles className="size-4" />
        Analyse resume
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
        <Sparkles className="size-4" />
        Run new analysis
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Run another analysis?</AlertDialogTitle>

          <AlertDialogDescription>
            This will create a new analysis record. Your previous results will
            remain available in the analysis history.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm}>
            Run analysis
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
