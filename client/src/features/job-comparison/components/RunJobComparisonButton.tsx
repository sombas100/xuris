import { Scale } from "lucide-react";

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

type RunJobComparisonButtonProps = {
  hasExistingComparison: boolean;
  disabled?: boolean;
  pending?: boolean;
  onConfirm: () => void;
};

export function RunJobComparisonButton({
  hasExistingComparison,
  disabled,
  pending,
  onConfirm,
}: RunJobComparisonButtonProps) {
  if (!hasExistingComparison) {
    return (
      <Button
        type="button"
        className="cursor-pointer"
        disabled={disabled || pending}
        onClick={onConfirm}
      >
        <Scale className="size-4" />
        Compare resume
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
        <Scale className="size-4" />
        Run new comparison
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Run another comparison?</AlertDialogTitle>

          <AlertDialogDescription>
            This creates a new comparison record. Your previous results will
            remain available in comparison history.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm}>
            Run comparison
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
