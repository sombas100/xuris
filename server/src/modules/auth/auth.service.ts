import { prisma } from "../../lib/prisma.js";
import { UpdateUserData } from "./auth.types.js";

type CreateUserData = {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
};

export const authRepository = () => {
  async function findByClerkId(clerkId: string) {
    return prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async function createUser(data: CreateUserData) {
    return prisma.user.create({
      data: {
        clerkId: data.clerkId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        imageUrl: data.imageUrl,
      },
    });
  }

  async function findOrCreateUser(data: CreateUserData) {
    const existingUser = await findByClerkId(data.clerkId);

    if (existingUser) {
      return existingUser;
    }

    return createUser(data);
  }

  async function updateUserFromClerk(clerkId: string, data: UpdateUserData,) {
    return prisma.user.update({
        where: { clerkId },
        data,
    });
  }

    async function getCurrentUser(id: string) {
      return prisma.user.findFirst({
        where: { id },
        select: {
          id: true,
          clerkId: true,
          firstName: true,
          lastName: true,
          email: true,
        }
      })
    }

  return {
    findByClerkId,
    createUser,
    findOrCreateUser,
    updateUserFromClerk,
    getCurrentUser,
  };
};
