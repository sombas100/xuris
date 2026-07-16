import {
  asyncHandler,
} from "../../middleware/async-handler";

import {
  successResponse,
} from "../../utils/api-response";

import {
  usageService,
} from "./usage.service";

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