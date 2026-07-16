import type {
  UsageType,
} from "../../../generated/prisma/enums";

export type UsageReservation = {
  userId: string;
  counted: boolean;
  usageResetDate: Date | null;
};

export type RecordUsageData = {
  userId: string;
  type: UsageType;

  resourceId?: string;
  tokensUsed?: number;
  costCents?: number;
};