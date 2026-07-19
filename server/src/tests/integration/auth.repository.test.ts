import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const prismaMocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  findFirst: vi.fn(),
}));

vi.mock("../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: prismaMocks.findUnique,
      create: prismaMocks.create,
      update: prismaMocks.update,
      findFirst: prismaMocks.findFirst,
    },
  },
}));

import { authRepository } from "../../modules/auth/auth.repository";

describe("authRepository", () => {
  const repository = authRepository();

  const clerkId = "clerk-user-1";
  const userId = "user-1";

  const createUserData = {
    clerkId,
    email: "corey@example.com",
    firstName: "Corey",
    lastName: "Clarke",
    imageUrl: "https://example.com/profile.png",
  };

  const databaseUser = {
    id: userId,
    clerkId,
    email: "corey@example.com",
    firstName: "Corey",
    lastName: "Clarke",
    imageUrl: "https://example.com/profile.png",
    plan: "FREE",
    monthlyUsageLimit: 5,
    monthlyUsageCount: 0,
    usageResetDate: null,
    createdAt: new Date(
      "2026-07-19T10:00:00.000Z",
    ),
    updatedAt: new Date(
      "2026-07-19T10:00:00.000Z",
    ),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findByClerkId", () => {
    it("finds a user using their Clerk ID", async () => {
      prismaMocks.findUnique.mockResolvedValue(
        databaseUser,
      );

      const result =
        await repository.findByClerkId(
          clerkId,
        );

      expect(
        prismaMocks.findUnique,
      ).toHaveBeenCalledOnce();

      expect(
        prismaMocks.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          clerkId,
        },
      });

      expect(result).toBe(
        databaseUser,
      );
    });

    it("returns null when the user does not exist", async () => {
      prismaMocks.findUnique.mockResolvedValue(
        null,
      );

      const result =
        await repository.findByClerkId(
          clerkId,
        );

      expect(result).toBeNull();
    });

    it("propagates Prisma lookup errors", async () => {
      const error = new Error(
        "Database lookup failed",
      );

      prismaMocks.findUnique.mockRejectedValue(
        error,
      );

      await expect(
        repository.findByClerkId(
          clerkId,
        ),
      ).rejects.toBe(error);
    });
  });

  describe("createUser", () => {
    it("creates a user using Clerk profile data", async () => {
      prismaMocks.create.mockResolvedValue(
        databaseUser,
      );

      const result =
        await repository.createUser(
          createUserData,
        );

      expect(
        prismaMocks.create,
      ).toHaveBeenCalledOnce();

      expect(
        prismaMocks.create,
      ).toHaveBeenCalledWith({
        data: {
          clerkId,
          email: "corey@example.com",
          firstName: "Corey",
          lastName: "Clarke",
          imageUrl:
            "https://example.com/profile.png",
        },
      });

      expect(result).toBe(
        databaseUser,
      );
    });

    it("supports nullable profile fields", async () => {
      const data = {
        clerkId,
        email: "corey@example.com",
        firstName: null,
        lastName: null,
        imageUrl: null,
      };

      const createdUser = {
        ...databaseUser,
        ...data,
      };

      prismaMocks.create.mockResolvedValue(
        createdUser,
      );

      const result =
        await repository.createUser(
          data,
        );

      expect(
        prismaMocks.create,
      ).toHaveBeenCalledWith({
        data: {
          clerkId,
          email: "corey@example.com",
          firstName: null,
          lastName: null,
          imageUrl: null,
        },
      });

      expect(result).toBe(
        createdUser,
      );
    });

    it("supports omitted optional profile fields", async () => {
      const data = {
        clerkId,
        email: "corey@example.com",
      };

      prismaMocks.create.mockResolvedValue({
        ...databaseUser,
        firstName: null,
        lastName: null,
        imageUrl: null,
      });

      await repository.createUser(
        data,
      );

      expect(
        prismaMocks.create,
      ).toHaveBeenCalledWith({
        data: {
          clerkId,
          email: "corey@example.com",
          firstName: undefined,
          lastName: undefined,
          imageUrl: undefined,
        },
      });
    });

    it("propagates Prisma creation errors", async () => {
      const error = new Error(
        "User creation failed",
      );

      prismaMocks.create.mockRejectedValue(
        error,
      );

      await expect(
        repository.createUser(
          createUserData,
        ),
      ).rejects.toBe(error);
    });
  });

  describe("findOrCreateUser", () => {
    it("returns an existing user without creating another one", async () => {
      prismaMocks.findUnique.mockResolvedValue(
        databaseUser,
      );

      const result =
        await repository.findOrCreateUser(
          createUserData,
        );

      expect(
        prismaMocks.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          clerkId,
        },
      });

      expect(
        prismaMocks.create,
      ).not.toHaveBeenCalled();

      expect(result).toBe(
        databaseUser,
      );
    });

    it("creates a user when none exists", async () => {
      prismaMocks.findUnique.mockResolvedValue(
        null,
      );

      prismaMocks.create.mockResolvedValue(
        databaseUser,
      );

      const result =
        await repository.findOrCreateUser(
          createUserData,
        );

      expect(
        prismaMocks.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          clerkId,
        },
      });

      expect(
        prismaMocks.create,
      ).toHaveBeenCalledWith({
        data: {
          clerkId,
          email: "corey@example.com",
          firstName: "Corey",
          lastName: "Clarke",
          imageUrl:
            "https://example.com/profile.png",
        },
      });

      expect(result).toBe(
        databaseUser,
      );
    });

    it("checks for an existing user before creating one", async () => {
      prismaMocks.findUnique.mockResolvedValue(
        null,
      );

      prismaMocks.create.mockResolvedValue(
        databaseUser,
      );

      await repository.findOrCreateUser(
        createUserData,
      );

      const findOrder =
        prismaMocks.findUnique.mock
          .invocationCallOrder[0];

      const createOrder =
        prismaMocks.create.mock
          .invocationCallOrder[0];

      expect(findOrder).toBeLessThan(
        createOrder,
      );
    });

    it("does not create a user when lookup fails", async () => {
      const error = new Error(
        "Database lookup failed",
      );

      prismaMocks.findUnique.mockRejectedValue(
        error,
      );

      await expect(
        repository.findOrCreateUser(
          createUserData,
        ),
      ).rejects.toBe(error);

      expect(
        prismaMocks.create,
      ).not.toHaveBeenCalled();
    });

    it("propagates creation errors for new users", async () => {
      const error = new Error(
        "Database creation failed",
      );

      prismaMocks.findUnique.mockResolvedValue(
        null,
      );

      prismaMocks.create.mockRejectedValue(
        error,
      );

      await expect(
        repository.findOrCreateUser(
          createUserData,
        ),
      ).rejects.toBe(error);
    });
  });

  describe("updateUserFromClerk", () => {
    it("updates a user using their Clerk ID", async () => {
      const updateData = {
        email: "updated@example.com",
        firstName: "Updated",
        lastName: "User",
        imageUrl:
          "https://example.com/updated.png",
      };

      const updatedUser = {
        ...databaseUser,
        ...updateData,
      };

      prismaMocks.update.mockResolvedValue(
        updatedUser,
      );

      const result =
        await repository.updateUserFromClerk(
          clerkId,
          updateData,
        );

      expect(
        prismaMocks.update,
      ).toHaveBeenCalledOnce();

      expect(
        prismaMocks.update,
      ).toHaveBeenCalledWith({
        where: {
          clerkId,
        },
        data: updateData,
      });

      expect(result).toBe(
        updatedUser,
      );
    });

    it("updates selected profile fields while keeping email required", async () => {
      const updateData = {
        email: "corey@example.com",
        firstName: "Updated Corey",
      };

      const updatedUser = {
        ...databaseUser,
        firstName: "Updated Corey",
      };

      prismaMocks.update.mockResolvedValue(
        updatedUser,
      );

      const result =
        await repository.updateUserFromClerk(
          clerkId,
          updateData,
        );

      expect(
        prismaMocks.update,
      ).toHaveBeenCalledWith({
        where: {
          clerkId,
        },
        data: {
          email: "corey@example.com",
          firstName: "Updated Corey",
        },
      });

      expect(result).toBe(
        updatedUser,
      );
    });

    it("supports setting nullable profile fields to null", async () => {
      const updateData = {
        email: "corey@example.com",
        firstName: null,
        lastName: null,
        imageUrl: null,
      };

      const updatedUser = {
        ...databaseUser,
        ...updateData,
      };

      prismaMocks.update.mockResolvedValue(
        updatedUser,
      );

      const result =
        await repository.updateUserFromClerk(
          clerkId,
          updateData,
        );

      expect(
        prismaMocks.update,
      ).toHaveBeenCalledWith({
        where: {
          clerkId,
        },
        data: {
          email: "corey@example.com",
          firstName: null,
          lastName: null,
          imageUrl: null,
        },
      });

      expect(result).toBe(
        updatedUser,
      );
    });

    it("propagates Prisma update errors", async () => {
      const error = new Error(
        "Database update failed",
      );

      prismaMocks.update.mockRejectedValue(
        error,
      );

      await expect(
        repository.updateUserFromClerk(
          clerkId,
          {
            email:
              "corey@example.com",
            firstName: "Updated",
          },
        ),
      ).rejects.toBe(error);
    });
  });

  describe("getCurrentUser", () => {
    it("retrieves the current user using their database ID", async () => {
      const currentUser = {
        id: userId,
        clerkId,
        firstName: "Corey",
        lastName: "Clarke",
        email: "corey@example.com",
      };

      prismaMocks.findFirst.mockResolvedValue(
        currentUser,
      );

      const result =
        await repository.getCurrentUser(
          userId,
        );

      expect(
        prismaMocks.findFirst,
      ).toHaveBeenCalledOnce();

      expect(
        prismaMocks.findFirst,
      ).toHaveBeenCalledWith({
        where: {
          id: userId,
        },
        select: {
          id: true,
          clerkId: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });

      expect(result).toBe(
        currentUser,
      );
    });

    it("returns null when the user does not exist", async () => {
      prismaMocks.findFirst.mockResolvedValue(
        null,
      );

      const result =
        await repository.getCurrentUser(
          userId,
        );

      expect(result).toBeNull();
    });

    it("propagates Prisma retrieval errors", async () => {
      const error = new Error(
        "Database retrieval failed",
      );

      prismaMocks.findFirst.mockRejectedValue(
        error,
      );

      await expect(
        repository.getCurrentUser(
          userId,
        ),
      ).rejects.toBe(error);
    });
  });
});