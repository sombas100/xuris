import type { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";

import { UnauthorizedError } from "../errors/UnauthorizedError";
import { authRepository } from "../modules/auth/auth.repository";

const users = authRepository();

export async function requireUser(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const { userId: clerkId } = getAuth(req);

  if (!clerkId) {
    throw new UnauthorizedError("Unauthorized", "UNAUTHORIZED");
  }

  const clerkUser = await clerkClient.users.getUser(clerkId);

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) {
    throw new UnauthorizedError("User email not found", "USER_EMAIL_NOT_FOUND");
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