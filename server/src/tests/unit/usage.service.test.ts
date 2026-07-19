import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { Plan, UsageType } from "../../../generated/prisma/enums";
import { NotFoundError } from "../../errors/NotFoundError";
import { UsageLimitError } from "../../errors/UsageLimitError";


const repositoryMock = vi.hoisted(() => ({
  getUserUsageState: vi.fn(),
  resetExpiredUsageWindow: vi.fn(),
  reserveFreeUsage: vi.fn(),
  releaseFreeUsage: vi.fn(),
  createUsageEvent: vi.fn(),
}));

vi.mock(
  "../../modules/usage/usage.repository",
  () => ({
    usageRepository: () => repositoryMock,
  }),
);

import {
  usageService,
} from "../../modules/usage/usage.service";

const userId = "user_test_123";

function createUsageState(
  overrides: Partial<{
    id: string;
    plan: Plan;
    monthlyUsageCount: number;
    monthlyUsageLimit: number;
    usageResetDate: Date | null;
  }> = {},
) {
  return {
    id: userId,
    plan: Plan.FREE,
    monthlyUsageCount: 0,
    monthlyUsageLimit: 5,
    usageResetDate: new Date(
      "2026-08-01T00:00:00.000Z",
    ),
    ...overrides,
  };
}

describe("usageService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("reserveUsage", () => {
    it("throws NotFoundError when the user does not exist", async () => {
      repositoryMock.getUserUsageState
        .mockResolvedValueOnce(null);

      const service = usageService();

      await expect(
        service.reserveUsage(userId),
      ).rejects.toBeInstanceOf(
        NotFoundError,
      );

      expect(
        repositoryMock.getUserUsageState,
      ).toHaveBeenCalledWith(userId);

      expect(
        repositoryMock.resetExpiredUsageWindow,
      ).not.toHaveBeenCalled();

      expect(
        repositoryMock.reserveFreeUsage,
      ).not.toHaveBeenCalled();
    });

    it("returns an uncounted reservation for a Pro user", async () => {
      const resetDate = new Date(
        "2026-08-01T00:00:00.000Z",
      );

      repositoryMock.getUserUsageState
        .mockResolvedValueOnce(
          createUsageState({
            plan: Plan.PRO,
            monthlyUsageCount: 27,
            usageResetDate: resetDate,
          }),
        );

      const service = usageService();

      const result =
        await service.reserveUsage(userId);

      expect(result).toEqual({
        userId,
        counted: false,
        usageResetDate: resetDate,
      });

      expect(
        repositoryMock.resetExpiredUsageWindow,
      ).not.toHaveBeenCalled();

      expect(
        repositoryMock.reserveFreeUsage,
      ).not.toHaveBeenCalled();
    });

    it("returns an uncounted reservation for a Team user", async () => {
      repositoryMock.getUserUsageState
        .mockResolvedValueOnce(
          createUsageState({
            plan: Plan.TEAM,
          }),
        );

      const service = usageService();

      const result =
        await service.reserveUsage(userId);

      expect(result.counted).toBe(false);

      expect(
        repositoryMock.reserveFreeUsage,
      ).not.toHaveBeenCalled();
    });

    it("reserves one generation for a Free user below the limit", async () => {
      const now = new Date(
        "2026-07-19T14:30:00.000Z",
      );

      vi.useFakeTimers();
      vi.setSystemTime(now);

      const initialState = createUsageState({
        monthlyUsageCount: 2,
      });

      const updatedResetDate = new Date(
        "2026-08-01T00:00:00.000Z",
      );

      const updatedState = createUsageState({
        monthlyUsageCount: 3,
        usageResetDate: updatedResetDate,
      });

      repositoryMock.getUserUsageState
        .mockResolvedValueOnce(initialState)
        .mockResolvedValueOnce(updatedState);

      repositoryMock.resetExpiredUsageWindow
        .mockResolvedValueOnce(undefined);

      repositoryMock.reserveFreeUsage
        .mockResolvedValueOnce(true);

      const service = usageService();

      const result =
        await service.reserveUsage(userId);

      expect(
        repositoryMock.resetExpiredUsageWindow,
      ).toHaveBeenCalledWith({
        userId,
        now,
        nextResetDate: new Date(
          "2026-08-01T00:00:00.000Z",
        ),
      });

      expect(
        repositoryMock.reserveFreeUsage,
      ).toHaveBeenCalledWith(userId);

      expect(
        repositoryMock.getUserUsageState,
      ).toHaveBeenCalledTimes(2);

      expect(result).toEqual({
        userId,
        counted: true,
        usageResetDate: updatedResetDate,
      });
    });

    it("throws UsageLimitError when a Free user's reservation is rejected", async () => {
        const resetDate = new Date(
        "2026-08-01T00:00:00.000Z",
    );

    repositoryMock.getUserUsageState
        .mockResolvedValueOnce(
        createUsageState({
            monthlyUsageCount: 5,
            usageResetDate: resetDate,
        }),
        )
        .mockResolvedValueOnce(
        createUsageState({
            monthlyUsageCount: 5,
            usageResetDate: resetDate,
        }),
    );

    repositoryMock.resetExpiredUsageWindow
        .mockResolvedValueOnce(undefined);

    repositoryMock.reserveFreeUsage
        .mockResolvedValueOnce(false);

    const service = usageService();

    await expect(
        service.reserveUsage(userId),
    ).rejects.toBeInstanceOf(
        UsageLimitError,
    );

    expect(
        repositoryMock.reserveFreeUsage,
    ).toHaveBeenCalledWith(userId);

    expect(
        repositoryMock.getUserUsageState,
     ).toHaveBeenCalledTimes(2);
    });

    it("includes the allowance reset date in the limit error", async () => {
      const resetDate = new Date(
        "2026-08-01T00:00:00.000Z",
      );

      repositoryMock.getUserUsageState
        .mockResolvedValueOnce(
          createUsageState({
            monthlyUsageCount: 5,
            usageResetDate: resetDate,
          }),
        )
        .mockResolvedValueOnce(
          createUsageState({
            monthlyUsageCount: 5,
            usageResetDate: resetDate,
          }),
        );

      repositoryMock.resetExpiredUsageWindow
        .mockResolvedValueOnce(undefined);

      repositoryMock.reserveFreeUsage
        .mockResolvedValueOnce(false);

      const service = usageService();

      await expect(
        service.reserveUsage(userId),
      ).rejects.toThrow(
        "Your allowance resets on",
      );
    });
  });

  describe("releaseUsage", () => {
    it("releases a counted Free-plan reservation", async () => {
      repositoryMock.releaseFreeUsage
        .mockResolvedValueOnce(undefined);

      const service = usageService();

      await service.releaseUsage({
        userId,
        counted: true,
        usageResetDate: new Date(
          "2026-08-01T00:00:00.000Z",
        ),
      });

      expect(
        repositoryMock.releaseFreeUsage,
      ).toHaveBeenCalledWith(userId);
    });

    it("does nothing for an uncounted Pro reservation", async () => {
      const service = usageService();

      await service.releaseUsage({
        userId,
        counted: false,
        usageResetDate: null,
      });

      expect(
        repositoryMock.releaseFreeUsage,
      ).not.toHaveBeenCalled();
    });
  });

  describe("recordUsage", () => {
    it("creates a usage event through the repository", async () => {
      const usageData = {
        userId,
        type: UsageType.RESUME_ANALYSIS,
        resourceId: "analysis_123",
        tokensUsed: 750,
        costCents: 2,
      };

      const createdEvent = {
        id: "usage_event_123",
        ...usageData,
      };

      repositoryMock.createUsageEvent
        .mockResolvedValueOnce(createdEvent);

      const service = usageService();

      const result =
        await service.recordUsage(
          usageData,
        );

      expect(
        repositoryMock.createUsageEvent,
      ).toHaveBeenCalledWith(usageData);

      expect(result).toEqual(createdEvent);
    });
  });

  describe("getUsageSummary", () => {
    it("throws NotFoundError when the user does not exist", async () => {
      repositoryMock.getUserUsageState
        .mockResolvedValueOnce(null);

      const service = usageService();

      await expect(
        service.getUsageSummary(userId),
      ).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it("returns the remaining allowance for a Free user", async () => {
      const resetDate = new Date(
        "2026-08-01T00:00:00.000Z",
      );

      repositoryMock.getUserUsageState
        .mockResolvedValueOnce(
          createUsageState({
            plan: Plan.FREE,
            monthlyUsageCount: 3,
            monthlyUsageLimit: 5,
            usageResetDate: resetDate,
          }),
        );

      const service = usageService();

      const result =
        await service.getUsageSummary(userId);

      expect(result).toEqual({
        plan: Plan.FREE,
        unlimited: false,
        usageCount: 3,
        usageLimit: 5,
        remaining: 2,
        usageResetDate: resetDate,
      });
    });

    it("never returns a negative remaining allowance", async () => {
      repositoryMock.getUserUsageState
        .mockResolvedValueOnce(
          createUsageState({
            monthlyUsageCount: 8,
            monthlyUsageLimit: 5,
          }),
        );

      const service = usageService();

      const result =
        await service.getUsageSummary(userId);

      expect(result.remaining).toBe(0);
    });

    it("returns unlimited usage for a Pro user", async () => {
      repositoryMock.getUserUsageState
        .mockResolvedValueOnce(
          createUsageState({
            plan: Plan.PRO,
            monthlyUsageCount: 42,
          }),
        );

      const service = usageService();

      const result =
        await service.getUsageSummary(userId);

      expect(result).toEqual({
        plan: Plan.PRO,
        unlimited: true,
        usageCount: 42,
        usageLimit: null,
        remaining: null,
        usageResetDate:
          new Date(
            "2026-08-01T00:00:00.000Z",
          ),
      });
    });
  });
});