import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  NextFunction,
  Request,
  Response,
} from "express";

const mocks = vi.hoisted(() => ({
  getAuth: vi.fn(),
  getClerkUser: vi.fn(),
  findOrCreateUser: vi.fn(),
}));

vi.mock("@clerk/express", () => ({
  getAuth: mocks.getAuth,

  clerkClient: {
    users: {
      getUser: mocks.getClerkUser,
    },
  },
}));

vi.mock(
  "../../modules/auth/auth.repository",
  () => ({
    authRepository: () => ({
      findOrCreateUser:
        mocks.findOrCreateUser,
    }),
  }),
);

/*
 * The authentication middleware is wrapped with asyncHandler.
 *
 * For this unit test, we replace asyncHandler with an identity
 * function so we can test requireUser directly and assert its
 * rejected errors.
 */
vi.mock(
  "../../middleware/async-handler",
  () => ({
    asyncHandler:
      <T extends (...args: any[]) => any>(
        handler: T,
      ) =>
        handler,
  }),
);

import { requireUser } from "../../middleware/auth";

describe("requireUser", () => {
  const clerkId = "clerk-user-1";

  const databaseUser = {
    id: "user-1",
    clerkId,
    email: "corey@example.com",
    firstName: "Corey",
    lastName: "Clarke",
    imageUrl:
      "https://example.com/profile.png",
  };

  const clerkUser = {
    id: clerkId,
    firstName: "Corey",
    lastName: "Clarke",
    imageUrl:
      "https://example.com/profile.png",

    primaryEmailAddressId:
      "email-primary",

    emailAddresses: [
      {
        id: "email-secondary",
        emailAddress:
          "secondary@example.com",
      },
      {
        id: "email-primary",
        emailAddress:
          "corey@example.com",
      },
    ],
  };

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {};
    res = {};

    next = vi.fn();

    mocks.getAuth.mockReturnValue({
      userId: clerkId,
    });

    mocks.getClerkUser.mockResolvedValue(
      clerkUser,
    );

    mocks.findOrCreateUser.mockResolvedValue(
      databaseUser,
    );
  });

  it("throws when the request has no authenticated Clerk user", async () => {
    mocks.getAuth.mockReturnValue({
      userId: null,
    });

    await expect(
      requireUser(
        req as Request,
        res as Response,
        next,
      ),
    ).rejects.toMatchObject({
      message:
        "Authentication token is missing or invalid",

      code: "UNAUTHORIZED",
    });

    expect(
      mocks.getClerkUser,
    ).not.toHaveBeenCalled();

    expect(
      mocks.findOrCreateUser,
    ).not.toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

  it("retrieves the authenticated user from Clerk", async () => {
    await requireUser(
      req as Request,
      res as Response,
      next,
    );

    expect(
      mocks.getAuth,
    ).toHaveBeenCalledWith(req);

    expect(
      mocks.getClerkUser,
    ).toHaveBeenCalledOnce();

    expect(
      mocks.getClerkUser,
    ).toHaveBeenCalledWith(clerkId);
  });

  it("uses the primary Clerk email address", async () => {
    await requireUser(
      req as Request,
      res as Response,
      next,
    );

    expect(
      mocks.findOrCreateUser,
    ).toHaveBeenCalledWith({
      clerkId,

      email:
        "corey@example.com",

      firstName:
        clerkUser.firstName,

      lastName:
        clerkUser.lastName,

      imageUrl:
        clerkUser.imageUrl,
    });
  });

  it("uses the first email when the primary email cannot be found", async () => {
    mocks.getClerkUser.mockResolvedValue({
      ...clerkUser,

      primaryEmailAddressId:
        "missing-email-id",

      emailAddresses: [
        {
          id: "email-fallback",
          emailAddress:
            "fallback@example.com",
        },
      ],
    });

    await requireUser(
      req as Request,
      res as Response,
      next,
    );

    expect(
      mocks.findOrCreateUser,
    ).toHaveBeenCalledWith({
      clerkId,

      email:
        "fallback@example.com",

      firstName: "Corey",
      lastName: "Clarke",

      imageUrl:
        "https://example.com/profile.png",
    });
  });

  it("uses the first email when Clerk has no primary email ID", async () => {
    mocks.getClerkUser.mockResolvedValue({
      ...clerkUser,

      primaryEmailAddressId: null,

      emailAddresses: [
        {
          id: "email-first",
          emailAddress:
            "first@example.com",
        },
      ],
    });

    await requireUser(
      req as Request,
      res as Response,
      next,
    );

    expect(
      mocks.findOrCreateUser,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        email:
          "first@example.com",
      }),
    );
  });

  it("throws when the Clerk user has no email address", async () => {
    mocks.getClerkUser.mockResolvedValue({
      ...clerkUser,

      primaryEmailAddressId: null,
      emailAddresses: [],
    });

    await expect(
      requireUser(
        req as Request,
        res as Response,
        next,
      ),
    ).rejects.toMatchObject({
      message:
        "User email not found",

      code:
        "USER_EMAIL_NOT_FOUND",
    });

    expect(
      mocks.findOrCreateUser,
    ).not.toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

  it("passes nullable Clerk profile fields to the repository", async () => {
    mocks.getClerkUser.mockResolvedValue({
      ...clerkUser,

      firstName: null,
      lastName: null,
      imageUrl: null,
    });

    await requireUser(
      req as Request,
      res as Response,
      next,
    );

    expect(
      mocks.findOrCreateUser,
    ).toHaveBeenCalledWith({
      clerkId,

      email:
        "corey@example.com",

      firstName: null,
      lastName: null,
      imageUrl: null,
    });
  });

  it("attaches the database user to the request", async () => {
    await requireUser(
      req as Request,
      res as Response,
      next,
    );

    expect(req.user).toBe(
      databaseUser,
    );
  });

  it("calls next after authenticating the user", async () => {
    await requireUser(
      req as Request,
      res as Response,
      next,
    );

    expect(next).toHaveBeenCalledOnce();

    expect(
      mocks.findOrCreateUser.mock
        .invocationCallOrder[0],
    ).toBeLessThan(
      vi.mocked(next).mock
        .invocationCallOrder[0],
    );
  });

  it("does not call next when Clerk user retrieval fails", async () => {
    const clerkError =
      new Error(
        "Clerk request failed",
      );

    mocks.getClerkUser.mockRejectedValue(
      clerkError,
    );

    await expect(
      requireUser(
        req as Request,
        res as Response,
        next,
      ),
    ).rejects.toBe(clerkError);

    expect(
      mocks.findOrCreateUser,
    ).not.toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

  it("does not call next when database synchronization fails", async () => {
    const databaseError =
      new Error(
        "Database request failed",
      );

    mocks.findOrCreateUser
      .mockRejectedValue(
        databaseError,
      );

    await expect(
      requireUser(
        req as Request,
        res as Response,
        next,
      ),
    ).rejects.toBe(
      databaseError,
    );

    expect(req.user).toBeUndefined();

    expect(next).not.toHaveBeenCalled();
  });

  it("completes the authentication steps in the correct order", async () => {
    await requireUser(
      req as Request,
      res as Response,
      next,
    );

    const getClerkUserOrder =
      mocks.getClerkUser.mock
        .invocationCallOrder[0];

    const findOrCreateOrder =
      mocks.findOrCreateUser.mock
        .invocationCallOrder[0];

    const nextOrder =
      vi.mocked(next).mock
        .invocationCallOrder[0];

    expect(
      getClerkUserOrder,
    ).toBeLessThan(
      findOrCreateOrder,
    );

    expect(
      findOrCreateOrder,
    ).toBeLessThan(nextOrder);
  });
});