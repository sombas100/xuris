import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type Stripe from "stripe";

import { Plan, SubscriptionStatus } from "../../../generated/prisma/enums";

import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";

const repositoryMock = vi.hoisted(() => ({
  getUserBillingState: vi.fn(),
  saveStripeCustomerId: vi.fn(),
  findActiveSubscriptionByUserId: vi.fn(),
  findUserByStripeCustomerId: vi.fn(),
  syncSubscription: vi.fn(),
  deactivateSubscription: vi.fn(),
}));

const stripeMock = vi.hoisted(() => ({
  customers: {
    create: vi.fn(),
  },

  checkout: {
    sessions: {
      create: vi.fn(),
    },
  },

  billingPortal: {
    sessions: {
      create: vi.fn(),
    },
  },

  subscriptions: {
    retrieve: vi.fn(),
  },
}));

vi.mock(
  "../../modules/billing/billing.repository",
  () => ({
    billingRepository: () => repositoryMock,
  }),
);

vi.mock("../../lib/stripe", () => ({
  stripe: stripeMock,
}));

vi.mock("../../config/env", () => ({
  env: {
    STRIPE_PRO_PRICE_ID:
      "price_test_pro",

    STRIPE_CHECKOUT_SUCCESS_URL:
      "http://localhost:5173/billing/success",

    STRIPE_CHECKOUT_CANCEL_URL:
      "http://localhost:5173/billing/cancel",

    STRIPE_PORTAL_RETURN_URL:
      "http://localhost:5173/dashboard/billing",
  },
}));

import {
  billingService,
} from "../../modules/billing/billing.service";

const userId = "user_test_123";

function createBillingUser(
  overrides: Record<string, unknown> = {},
) {
  return {
    id: userId,

    clerkId: "clerk_test_123",

    email: "corey@example.com",

    firstName: "Corey",
    lastName: "Clarke",

    plan: Plan.FREE,

    stripeCustomerId: null,

    monthlyUsageLimit: 5,
    monthlyUsageCount: 2,

    usageResetDate: new Date(
      "2026-08-01T00:00:00.000Z",
    ),

    subscriptions: [],

    ...overrides,
  };
}

function createStripeSubscription(
  overrides: Record<string, unknown> = {},
): Stripe.Subscription {
  return {
    id: "sub_test_123",

    object: "subscription",

    status: "active",

    customer: "cus_test_123",

    cancel_at: null,

    cancel_at_period_end: false,

    metadata: {
      userId,
      plan: Plan.PRO,
    },

    items: {
      object: "list",

      data: [
        {
          id: "si_test_123",

          object: "subscription_item",

          current_period_start:
            1782864000,

          current_period_end:
            1785542400,

          price: {
            id: "price_test_pro",

            object: "price",
          },
        },
      ],

      has_more: false,

      url: "/v1/subscription_items",
    },

    ...overrides,
  } as unknown as Stripe.Subscription;
}

describe("billingService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createCheckoutSession", () => {
    it("throws NotFoundError when the user does not exist", async () => {
      repositoryMock.getUserBillingState
        .mockResolvedValueOnce(null);

      const service = billingService();

      await expect(
        service.createCheckoutSession(
          userId,
        ),
      ).rejects.toBeInstanceOf(
        NotFoundError,
      );

      expect(
        repositoryMock.findActiveSubscriptionByUserId,
      ).not.toHaveBeenCalled();

      expect(
        stripeMock.checkout.sessions.create,
      ).not.toHaveBeenCalled();
    });

    it("rejects a user whose plan is already Pro", async () => {
      repositoryMock.getUserBillingState
        .mockResolvedValueOnce(
          createBillingUser({
            plan: Plan.PRO,
          }),
        );

      repositoryMock.findActiveSubscriptionByUserId
        .mockResolvedValueOnce(null);

      const service = billingService();

      await expect(
        service.createCheckoutSession(
          userId,
        ),
      ).rejects.toBeInstanceOf(
        BadRequestError,
      );

      expect(
        stripeMock.checkout.sessions.create,
      ).not.toHaveBeenCalled();
    });

    it("rejects a user who already has an active subscription", async () => {
      repositoryMock.getUserBillingState
        .mockResolvedValueOnce(
          createBillingUser(),
        );

      repositoryMock.findActiveSubscriptionByUserId
        .mockResolvedValueOnce({
          id: "subscription_record_123",
        });

      const service = billingService();

      await expect(
        service.createCheckoutSession(
          userId,
        ),
      ).rejects.toThrow(
        "You already have an active Pro subscription",
      );

      expect(
        stripeMock.checkout.sessions.create,
      ).not.toHaveBeenCalled();
    });

    it("reuses an existing Stripe customer", async () => {
      repositoryMock.getUserBillingState
        .mockResolvedValue(
          createBillingUser({
            stripeCustomerId:
              "cus_existing_123",
          }),
        );

      repositoryMock.findActiveSubscriptionByUserId
        .mockResolvedValueOnce(null);

      stripeMock.checkout.sessions.create
        .mockResolvedValueOnce({
          id: "cs_test_123",

          url: "https://checkout.stripe.test/session",
        });

      const service = billingService();

      const result =
        await service.createCheckoutSession(
          userId,
        );

      expect(
        stripeMock.customers.create,
      ).not.toHaveBeenCalled();

      expect(
        repositoryMock.saveStripeCustomerId,
      ).not.toHaveBeenCalled();

      expect(
        stripeMock.checkout.sessions.create,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: "subscription",

          customer:
            "cus_existing_123",

          client_reference_id:
            userId,

          line_items: [
            {
              price:
                "price_test_pro",

              quantity: 1,
            },
          ],

          success_url:
            "http://localhost:5173/billing/success",

          cancel_url:
            "http://localhost:5173/billing/cancel",

          allow_promotion_codes: true,

          metadata: {
            userId,
            plan: Plan.PRO,
          },

          subscription_data: {
            metadata: {
              userId,
              plan: Plan.PRO,
            },
          },
        }),
      );

      expect(result).toEqual({
        url: "https://checkout.stripe.test/session",
      });
    });

    it("creates and saves a Stripe customer when none exists", async () => {
      repositoryMock.getUserBillingState
        .mockResolvedValue(
          createBillingUser({
            stripeCustomerId: null,
          }),
        );

      repositoryMock.findActiveSubscriptionByUserId
        .mockResolvedValueOnce(null);

      stripeMock.customers.create
        .mockResolvedValueOnce({
          id: "cus_created_123",
        });

      repositoryMock.saveStripeCustomerId
        .mockResolvedValueOnce(undefined);

      stripeMock.checkout.sessions.create
        .mockResolvedValueOnce({
          id: "cs_test_123",

          url: "https://checkout.stripe.test/session",
        });

      const service = billingService();

      const result =
        await service.createCheckoutSession(
          userId,
        );

      expect(
        stripeMock.customers.create,
      ).toHaveBeenCalledWith({
        email: "corey@example.com",

        name: "Corey Clarke",

        metadata: {
          userId,
          clerkId:
            "clerk_test_123",
        },
      });

      expect(
        repositoryMock.saveStripeCustomerId,
      ).toHaveBeenCalledWith(
        userId,
        "cus_created_123",
      );

      expect(
        stripeMock.checkout.sessions.create,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          customer:
            "cus_created_123",
        }),
      );

      expect(result).toEqual({
        url: "https://checkout.stripe.test/session",
      });
    });

    it("omits the Stripe customer name when the user has no name", async () => {
      repositoryMock.getUserBillingState
        .mockResolvedValue(
          createBillingUser({
            firstName: null,
            lastName: null,
          }),
        );

      repositoryMock.findActiveSubscriptionByUserId
        .mockResolvedValueOnce(null);

      stripeMock.customers.create
        .mockResolvedValueOnce({
          id: "cus_created_123",
        });

      stripeMock.checkout.sessions.create
        .mockResolvedValueOnce({
          url: "https://checkout.stripe.test/session",
        });

      const service = billingService();

      await service.createCheckoutSession(
        userId,
      );

      expect(
        stripeMock.customers.create,
      ).toHaveBeenCalledWith({
        email: "corey@example.com",

        name: undefined,

        metadata: {
          userId,
          clerkId:
            "clerk_test_123",
        },
      });
    });

    it("throws when Stripe does not return a checkout URL", async () => {
      repositoryMock.getUserBillingState
        .mockResolvedValue(
          createBillingUser({
            stripeCustomerId:
              "cus_existing_123",
          }),
        );

      repositoryMock.findActiveSubscriptionByUserId
        .mockResolvedValueOnce(null);

      stripeMock.checkout.sessions.create
        .mockResolvedValueOnce({
          id: "cs_test_123",
          url: null,
        });

      const service = billingService();

      await expect(
        service.createCheckoutSession(
          userId,
        ),
      ).rejects.toThrow(
        "Stripe did not return a checkout URL",
      );
    });
  });

  describe("createPortalSession", () => {
    it("throws NotFoundError when the user does not exist", async () => {
      repositoryMock.getUserBillingState
        .mockResolvedValueOnce(null);

      const service = billingService();

      await expect(
        service.createPortalSession(
          userId,
        ),
      ).rejects.toBeInstanceOf(
        NotFoundError,
      );

      expect(
        stripeMock.billingPortal.sessions.create,
      ).not.toHaveBeenCalled();
    });

    it("rejects a user without a Stripe customer", async () => {
      repositoryMock.getUserBillingState
        .mockResolvedValueOnce(
          createBillingUser({
            stripeCustomerId: null,
          }),
        );

      const service = billingService();

      await expect(
        service.createPortalSession(
          userId,
        ),
      ).rejects.toThrow(
        "No Stripe customer exists for this account",
      );

      expect(
        stripeMock.billingPortal.sessions.create,
      ).not.toHaveBeenCalled();
    });

    it("creates a Stripe billing portal session", async () => {
      repositoryMock.getUserBillingState
        .mockResolvedValueOnce(
          createBillingUser({
            stripeCustomerId:
              "cus_existing_123",
          }),
        );

      stripeMock.billingPortal.sessions.create
        .mockResolvedValueOnce({
          id: "bps_test_123",

          url: "https://billing.stripe.test/portal",
        });

      const service = billingService();

      const result =
        await service.createPortalSession(
          userId,
        );

      expect(
        stripeMock.billingPortal.sessions.create,
      ).toHaveBeenCalledWith({
        customer:
          "cus_existing_123",

        return_url:
          "http://localhost:5173/dashboard/billing",
      });

      expect(result).toEqual({
        url: "https://billing.stripe.test/portal",
      });
    });
  });

  describe("getBillingStatus", () => {
    it("throws NotFoundError when the user does not exist", async () => {
      repositoryMock.getUserBillingState
        .mockResolvedValueOnce(null);

      const service = billingService();

      await expect(
        service.getBillingStatus(userId),
      ).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it("returns Free billing status without a subscription", async () => {
      const resetDate = new Date(
        "2026-08-01T00:00:00.000Z",
      );

      repositoryMock.getUserBillingState
        .mockResolvedValueOnce(
          createBillingUser({
            plan: Plan.FREE,

            monthlyUsageLimit: 5,
            monthlyUsageCount: 3,

            usageResetDate:
              resetDate,

            subscriptions: [],
          }),
        );

      const service = billingService();

      const result =
        await service.getBillingStatus(
          userId,
        );

      expect(result).toEqual({
        plan: Plan.FREE,

        monthlyUsageLimit: 5,
        monthlyUsageCount: 3,

        usageResetDate:
          resetDate,

        subscription: null,
      });
    });

    it("returns the Stripe subscription billing status", async () => {
      const periodStart = new Date(
        "2026-07-01T00:00:00.000Z",
      );

      const periodEnd = new Date(
        "2026-08-01T00:00:00.000Z",
      );

      repositoryMock.getUserBillingState
        .mockResolvedValueOnce(
          createBillingUser({
            plan: Plan.PRO,

            subscriptions: [
              {
                id: "local_sub_123",

                stripeSubscriptionId:
                  "sub_test_123",

                stripePriceId:
                  "price_test_pro",

                status:
                  SubscriptionStatus.ACTIVE,

                currentPeriodStart:
                  periodStart,

                currentPeriodEnd:
                  periodEnd,

                cancelAtPeriodEnd:
                  true,
              },
            ],
          }),
        );

      const service = billingService();

      const result =
        await service.getBillingStatus(
          userId,
        );

      expect(result.subscription).toEqual({
        status:
          SubscriptionStatus.ACTIVE,

        stripePriceId:
          "price_test_pro",

        currentPeriodStart:
          periodStart,

        currentPeriodEnd:
          periodEnd,

        cancelAtPeriodEnd:
          true,
      });
    });

    it("ignores subscription records without a Stripe subscription ID", async () => {
      repositoryMock.getUserBillingState
        .mockResolvedValueOnce(
          createBillingUser({
            subscriptions: [
              {
                stripeSubscriptionId:
                  null,

                status:
                  SubscriptionStatus.INACTIVE,
              },
            ],
          }),
        );

      const service = billingService();

      const result =
        await service.getBillingStatus(
          userId,
        );

      expect(
        result.subscription,
      ).toBeNull();
    });
  });

  describe("syncStripeSubscription", () => {
    it("resolves the user from subscription metadata", async () => {
      const subscription =
        createStripeSubscription();

      const syncedResult = {
        id: "local_sub_123",
      };

      repositoryMock.syncSubscription
        .mockResolvedValueOnce(
          syncedResult,
        );

      const service = billingService();

      const result =
        await service.syncStripeSubscription(
          subscription,
        );

      expect(
        repositoryMock.findUserByStripeCustomerId,
      ).not.toHaveBeenCalled();

      expect(
        repositoryMock.syncSubscription,
      ).toHaveBeenCalledWith({
        userId,

        stripeSubscriptionId:
          "sub_test_123",

        stripePriceId:
          "price_test_pro",

        plan: Plan.PRO,

        status:
          SubscriptionStatus.ACTIVE,

        currentPeriodStart:
          new Date(
            1782864000 * 1000,
          ),

        currentPeriodEnd:
          new Date(
            1785542400 * 1000,
          ),

        cancelAtPeriodEnd:
          false,
      });

      expect(result).toEqual(
        syncedResult,
      );
    });

    it("resolves the user using the Stripe customer when metadata is missing", async () => {
      const subscription =
        createStripeSubscription({
          metadata: {},

          customer: {
            id: "cus_object_123",
          },
        });

      repositoryMock.findUserByStripeCustomerId
        .mockResolvedValueOnce({
          id: userId,
        });

      repositoryMock.syncSubscription
        .mockResolvedValueOnce({
          id: "local_sub_123",
        });

      const service = billingService();

      await service.syncStripeSubscription(
        subscription,
      );

      expect(
        repositoryMock.findUserByStripeCustomerId,
      ).toHaveBeenCalledWith(
        "cus_object_123",
      );

      expect(
        repositoryMock.syncSubscription,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
        }),
      );
    });

    it("throws when no Xuris user can be resolved", async () => {
      const subscription =
        createStripeSubscription({
          metadata: {},

          customer:
            "cus_unknown_123",
        });

      repositoryMock.findUserByStripeCustomerId
        .mockResolvedValueOnce(null);

      const service = billingService();

      await expect(
        service.syncStripeSubscription(
          subscription,
        ),
      ).rejects.toBeInstanceOf(
        NotFoundError,
      );

      expect(
        repositoryMock.syncSubscription,
      ).not.toHaveBeenCalled();
    });

    it.each([
      [
        "active",
        SubscriptionStatus.ACTIVE,
      ],

      [
        "trialing",
        SubscriptionStatus.TRIALING,
      ],

      [
        "past_due",
        SubscriptionStatus.PAST_DUE,
      ],

      [
        "unpaid",
        SubscriptionStatus.UNPAID,
      ],

      [
        "incomplete",
        SubscriptionStatus.INCOMPLETE,
      ],

      [
        "incomplete_expired",
        SubscriptionStatus.INCOMPLETE_EXPIRED,
      ],

      [
        "paused",
        SubscriptionStatus.PAUSED,
      ],

      [
        "canceled",
        SubscriptionStatus.CANCELLED,
      ],
    ] as const)(
      "maps Stripe status %s to %s",
      async (
        stripeStatus,
        expectedStatus,
      ) => {
        const subscription =
          createStripeSubscription({
            status: stripeStatus,
          });

        repositoryMock.syncSubscription
          .mockResolvedValueOnce({
            id: "local_sub_123",
          });

        const service = billingService();

        await service.syncStripeSubscription(
          subscription,
        );

        expect(
          repositoryMock.syncSubscription,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            status:
              expectedStatus,
          }),
        );
      },
    );

    it("marks a subscription as cancelling when cancel_at_period_end is true", async () => {
      const subscription =
        createStripeSubscription({
          cancel_at_period_end: true,
        });

      repositoryMock.syncSubscription
        .mockResolvedValueOnce({
          id: "local_sub_123",
        });

      const service = billingService();

      await service.syncStripeSubscription(
        subscription,
      );

      expect(
        repositoryMock.syncSubscription,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          cancelAtPeriodEnd: true,
        }),
      );
    });

    it("marks a subscription as cancelling when cancel_at contains a timestamp", async () => {
      const subscription =
        createStripeSubscription({
          cancel_at: 1785542400,

          cancel_at_period_end: false,
        });

      repositoryMock.syncSubscription
        .mockResolvedValueOnce({
          id: "local_sub_123",
        });

      const service = billingService();

      await service.syncStripeSubscription(
        subscription,
      );

      expect(
        repositoryMock.syncSubscription,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          cancelAtPeriodEnd: true,
        }),
      );
    });

    it("uses subscription-level period dates when item dates are unavailable", async () => {
      const subscription =
        createStripeSubscription({
          current_period_start:
            1782864000,

          current_period_end:
            1785542400,

          items: {
            object: "list",

            data: [
              {
                price: {
                  id: "price_test_pro",
                },
              },
            ],

            has_more: false,

            url: "/v1/subscription_items",
          },
        });

      repositoryMock.syncSubscription
        .mockResolvedValueOnce({
          id: "local_sub_123",
        });

      const service = billingService();

      await service.syncStripeSubscription(
        subscription,
      );

      expect(
        repositoryMock.syncSubscription,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          currentPeriodStart:
            new Date(
              1782864000 * 1000,
            ),

          currentPeriodEnd:
            new Date(
              1785542400 * 1000,
            ),
        }),
      );
    });
  });

  describe("handleCheckoutCompleted", () => {
    it("returns null when the checkout session has no subscription", async () => {
      const session = {
        id: "cs_test_123",
        subscription: null,
      } as Stripe.Checkout.Session;

      const service = billingService();

      const result =
        await service.handleCheckoutCompleted(
          session,
        );

      expect(result).toBeNull();

      expect(
        stripeMock.subscriptions.retrieve,
      ).not.toHaveBeenCalled();

      expect(
        repositoryMock.syncSubscription,
      ).not.toHaveBeenCalled();
    });

    it("retrieves and synchronises a string subscription ID", async () => {
      const session = {
        id: "cs_test_123",

        subscription:
          "sub_test_123",
      } as Stripe.Checkout.Session;

      const subscription =
        createStripeSubscription();

      stripeMock.subscriptions.retrieve
        .mockResolvedValueOnce(
          subscription,
        );

      repositoryMock.syncSubscription
        .mockResolvedValueOnce({
          id: "local_sub_123",
        });

      const service = billingService();

      const result =
        await service.handleCheckoutCompleted(
          session,
        );

      expect(
        stripeMock.subscriptions.retrieve,
      ).toHaveBeenCalledWith(
        "sub_test_123",
      );

      expect(
        repositoryMock.syncSubscription,
      ).toHaveBeenCalled();

      expect(result).toEqual({
        id: "local_sub_123",
      });
    });

    it("retrieves an expanded subscription object's ID", async () => {
      const session = {
        id: "cs_test_123",

        subscription: {
          id: "sub_expanded_123",
        },
      } as Stripe.Checkout.Session;

      stripeMock.subscriptions.retrieve
        .mockResolvedValueOnce(
          createStripeSubscription({
            id: "sub_expanded_123",
          }),
        );

      repositoryMock.syncSubscription
        .mockResolvedValueOnce({
          id: "local_sub_123",
        });

      const service = billingService();

      await service.handleCheckoutCompleted(
        session,
      );

      expect(
        stripeMock.subscriptions.retrieve,
      ).toHaveBeenCalledWith(
        "sub_expanded_123",
      );
    });
  });

  describe("handleSubscriptionDeleted", () => {
    it("deactivates the local subscription", async () => {
      const subscription =
        createStripeSubscription({
          id: "sub_deleted_123",

          status: "canceled",
        });

      const deactivated = {
        id: "local_sub_123",

        status:
          SubscriptionStatus.CANCELLED,
      };

      repositoryMock.deactivateSubscription
        .mockResolvedValueOnce(
          deactivated,
        );

      const service = billingService();

      const result =
        await service.handleSubscriptionDeleted(
          subscription,
        );

      expect(
        repositoryMock.deactivateSubscription,
      ).toHaveBeenCalledWith(
        "sub_deleted_123",
      );

      expect(result).toEqual(
        deactivated,
      );
    });
  });
});