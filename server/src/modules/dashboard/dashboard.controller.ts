import { asyncHandler } from "../../middleware/async-handler";
import { successResponse } from "../../utils/api-response";

import {
  dashboardService as createDashboardService,
} from "./dashboard.service";

const dashboardService = createDashboardService();

export const dashboardController = () => {
  const getSummary = asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const result =
      await dashboardService.getDashboardSummary(userId);

    return successResponse(res, result, 200);
  });

  return {
    getSummary,
  };
};