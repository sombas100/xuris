import { asyncHandler } from "../../middleware/async-handler";
import { successResponse } from "../../utils/api-response";

import {
  billingService as createBillingService,
} from "./billing.service";

const service = createBillingService();

export const billingController = () => {
  const createCheckoutSession =
    asyncHandler(async (req, res) => {
      const userId = req.user!.id;

      const result =
        await service.createCheckoutSession(
          userId,
        );

      return successResponse(
        res,
        result,
        201,
      );
    });

  const createPortalSession =
    asyncHandler(async (req, res) => {
      const userId = req.user!.id;

      const result =
        await service.createPortalSession(
          userId,
        );

      return successResponse(
        res,
        result,
        201,
      );
    });

  const getBillingStatus =
    asyncHandler(async (req, res) => {
      const userId = req.user!.id;

      const result =
        await service.getBillingStatus(
          userId,
        );

      return successResponse(
        res,
        result,
        200,
      );
    });

  return {
    createCheckoutSession,
    createPortalSession,
    getBillingStatus,
  };
};