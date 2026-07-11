import { asyncHandler } from "../../middleware/async-handler";
import { successResponse } from "../../utils/api-response";
import { authRepository } from "./auth.repository";

const repository = authRepository();

export const authController = () => {
  const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = String(req.user)
    return successResponse(res, userId, 200);
  });

  return {
    getCurrentUser,
  };
};