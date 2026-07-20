import type { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";

import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { authRepository } from "../modules/auth/auth.repository.js";
import { asyncHandler } from "./async-handler.js";

const users = authRepository();

export const requireUser = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      throw new UnauthorizedError(
        "Authentication token is missing or invalid",
        "UNAUTHORIZED"
      );
    }

    const clerkUser = await clerkClient.users.getUser(clerkId);

    const primaryEmail =
      clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId
      )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

    if (!primaryEmail) {
      throw new UnauthorizedError(
        "User email not found",
        "USER_EMAIL_NOT_FOUND"
      );
    }

    const user = await users.findOrCreateUser({
      clerkId,
      email: primaryEmail,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    });

    req.user = user;

    next();
  }
);