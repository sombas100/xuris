import { asyncHandler } from "../../middleware/async-handler";
import { successResponse } from "../../utils/api-response";

import {
  applicationService as createApplicationService,
} from "./application.service";

import {
  applicationListQuerySchema,
  createApplicationSchema,
  updateApplicationSchema,
  updateApplicationStatusSchema,
} from "./application.validation";

const service = createApplicationService();

export const applicationController = () => {
  const createApplication = asyncHandler(
    async (req, res) => {
      const userId = req.user!.id;

      const input = createApplicationSchema.parse(
        req.body,
      );

      const result =
        await service.createApplication(
          input,
          userId,
        );

      return successResponse(res, result, 201);
    },
  );

  const getApplications = asyncHandler(
    async (req, res) => {
      const userId = req.user!.id;

      const query =
        applicationListQuerySchema.parse(
          req.query,
        );

      const result =
        await service.getApplications(
          query,
          userId,
        );

      return successResponse(res, result, 200);
    },
  );

  const getApplicationById = asyncHandler(
    async (req, res) => {
      const userId = req.user!.id;
      const applicationId = String(
        req.params.applicationId,
      );

      const result =
        await service.getApplicationById(
          applicationId,
          userId,
        );

      return successResponse(res, result, 200);
    },
  );

  const updateApplication = asyncHandler(
    async (req, res) => {
      const userId = req.user!.id;
      const applicationId = String(
        req.params.applicationId,
      );

      const input = updateApplicationSchema.parse(
        req.body,
      );

      const result =
        await service.updateApplication(
          applicationId,
          input,
          userId,
        );

      return successResponse(res, result, 200);
    },
  );

  const updateApplicationStatus = asyncHandler(
    async (req, res) => {
      const userId = req.user!.id;
      const applicationId = String(
        req.params.applicationId,
      );

      const input =
        updateApplicationStatusSchema.parse(
          req.body,
        );

      const result =
        await service.updateApplicationStatus(
          applicationId,
          input,
          userId,
        );

      return successResponse(res, result, 200);
    },
  );

  const deleteApplication = asyncHandler(
    async (req, res) => {
      const userId = req.user!.id;
      const applicationId = String(
        req.params.applicationId,
      );

      await service.deleteApplication(
        applicationId,
        userId,
      );

      return res.status(204).send();
    },
  );

  return {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
  };
};