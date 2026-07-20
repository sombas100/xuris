import {
  asyncHandler,
} from "../../middleware/async-handler.js";

import {
  successResponse,
} from "../../utils/api-response.js";

import {
  usageService,
} from "./usage.service.js";

const service = usageService();

export const usageController = () => {
  const getUsageSummary =
    asyncHandler(async (req, res) => {
      const userId = req.user!.id;

      const result =
        await service.getUsageSummary(
          userId,
        );

      return successResponse(
        res,
        result,
        200,
      );
    });

  return {
    getUsageSummary,
  };
};