/// <reference types="@clerk/express/env" />

import type { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};