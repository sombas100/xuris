import { asyncHandler } from "../../middleware/async-handler.js";
import { successResponse } from "../../utils/api-response.js";

export const authController = () => {
  const getCurrentUser = asyncHandler(async (req, res) => {
    return successResponse(res, req.user, 200);
  });

  return {
    getCurrentUser,
  };
};