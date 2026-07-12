import { asyncHandler } from "../../middleware/async-handler";
import { successResponse } from "../../utils/api-response";

export const authController = () => {
  const getCurrentUser = asyncHandler(async (req, res) => {
    return successResponse(res, req.user, 200);
  });

  return {
    getCurrentUser,
  };
};