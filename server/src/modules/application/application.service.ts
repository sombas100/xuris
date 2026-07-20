import { ApplicationStatus } from "../../generated/prisma/enums.js";

import { BadRequestError } from "../../errors/BadRequestError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";

import { coverLetterRepository } from "../cover-letter/cover-letter.repository.js";
import { jobRepository } from "../job/job.repository.js";
import { resumeRepository } from "../resume/resume.repository.js";

import { applicationRepository } from "./application.repository.js";
import type {
  ApplicationListQuery,
  CreateApplicationInput,
  UpdateApplicationInput,
  UpdateApplicationStatusInput,
} from "./application.validation.js";

const repository = applicationRepository();
const resumeRepo = resumeRepository();
const jobRepo = jobRepository();
const coverLetterRepo = coverLetterRepository();

function parseDate(
  value: string | null | undefined,
): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  return new Date(value);
}

function isInterviewStatus(status: ApplicationStatus) {
  return (
    status === ApplicationStatus.INTERVIEW ||
    status === ApplicationStatus.FINAL_INTERVIEW
  );
}

function isClosedStatus(status: ApplicationStatus) {
  return (
    status === ApplicationStatus.REJECTED ||
    status === ApplicationStatus.WITHDRAWN
  );
}

export const applicationService = () => {
  async function createApplication(
    data: CreateApplicationInput,
    userId: string,
  ) {
    let company = data.company;
    let role = data.role;
    let jobUrl = data.jobUrl;
    let location = data.location;
    let salary = data.salary;

    if (data.jobPostId) {
      const jobPost = await jobRepo.retrieveJobPost(
        data.jobPostId,
        userId,
      );

      if (!jobPost) {
        throw new NotFoundError(
          "Job post not found",
          "JOB_POST_NOT_FOUND",
        );
      }

      company =
        data.company ??
        jobPost.company ??
        "Unknown company";

      role = data.role ?? jobPost.title;
      jobUrl = data.jobUrl ?? jobPost.jobUrl;
      location = data.location ?? jobPost.location;
      salary = data.salary ?? jobPost.salary;
    }

    if (!company || !role) {
      throw new BadRequestError(
        "Company and role are required",
        "APPLICATION_COMPANY_ROLE_REQUIRED",
      );
    }

    if (data.resumeId) {
      const resume = await resumeRepo.retrieveResume(
        data.resumeId,
        userId,
      );

      if (!resume) {
        throw new NotFoundError(
          "Resume not found",
          "RESUME_NOT_FOUND",
        );
      }
    }

    if (data.coverLetterId) {
      const coverLetter =
        await coverLetterRepo.retrieveCoverLetterById(
          data.coverLetterId,
          userId,
        );

      if (!coverLetter) {
        throw new NotFoundError(
          "Cover letter not found",
          "COVER_LETTER_NOT_FOUND",
        );
      }

      if (
        data.resumeId &&
        coverLetter.resumeId !== data.resumeId
      ) {
        throw new BadRequestError(
          "The selected cover letter does not belong to the selected resume",
          "COVER_LETTER_RESUME_MISMATCH",
        );
      }

      if (
        data.jobPostId &&
        coverLetter.jobPostId !== data.jobPostId
      ) {
        throw new BadRequestError(
          "The selected cover letter does not belong to the selected job post",
          "COVER_LETTER_JOB_MISMATCH",
        );
      }
    }

    const now = new Date();
    const status = data.status;

    return repository.createApplication({
      userId,

      resumeId: data.resumeId,
      jobPostId: data.jobPostId,
      coverLetterId: data.coverLetterId,

      company,
      role,

      jobUrl,
      location,
      salary,
      notes: data.notes,

      status,

      appliedAt:
        parseDate(data.appliedAt) ??
        (status !== ApplicationStatus.SAVED
          ? now
          : null),

      interviewAt:
        parseDate(data.interviewAt) ??
        (isInterviewStatus(status) ? now : null),

      followUpDate: parseDate(data.followUpDate),

      offerAt:
        parseDate(data.offerAt) ??
        (status === ApplicationStatus.OFFER
          ? now
          : null),

      closedAt:
        parseDate(data.closedAt) ??
        (isClosedStatus(status) ? now : null),
    });
  }

  async function getApplications(
    query: ApplicationListQuery,
    userId: string,
  ) {
    return repository.retrieveApplications({
      userId,
      status: query.status,
      search: query.search,
      sort: query.sort,
      order: query.order,
      page: query.page,
      limit: query.limit,
    });
  }

  async function getApplicationById(
    applicationId: string,
    userId: string,
  ) {
    const application =
      await repository.retrieveApplicationById(
        applicationId,
        userId,
      );

    if (!application) {
      throw new NotFoundError(
        "Application not found",
        "APPLICATION_NOT_FOUND",
      );
    }

    return application;
  }

  async function updateApplication(
    applicationId: string,
    data: UpdateApplicationInput,
    userId: string,
  ) {
    await getApplicationById(applicationId, userId);

    if (data.resumeId) {
      const resume = await resumeRepo.retrieveResume(
        data.resumeId,
        userId,
      );

      if (!resume) {
        throw new NotFoundError(
          "Resume not found",
          "RESUME_NOT_FOUND",
        );
      }
    }

    if (data.jobPostId) {
      const jobPost = await jobRepo.retrieveJobPost(
        data.jobPostId,
        userId,
      );

      if (!jobPost) {
        throw new NotFoundError(
          "Job post not found",
          "JOB_POST_NOT_FOUND",
        );
      }
    }

    if (data.coverLetterId) {
      const coverLetter =
        await coverLetterRepo.retrieveCoverLetterById(
          data.coverLetterId,
          userId,
        );

      if (!coverLetter) {
        throw new NotFoundError(
          "Cover letter not found",
          "COVER_LETTER_NOT_FOUND",
        );
      }
    }

    return repository.updateApplication(
      applicationId,
      userId,
      {
        resumeId: data.resumeId,
        jobPostId: data.jobPostId,
        coverLetterId: data.coverLetterId,

        company: data.company,
        role: data.role,

        jobUrl: data.jobUrl,
        location: data.location,
        salary: data.salary,
        notes: data.notes,

        appliedAt: parseDate(data.appliedAt),
        interviewAt: parseDate(data.interviewAt),
        followUpDate: parseDate(data.followUpDate),
        offerAt: parseDate(data.offerAt),
        closedAt: parseDate(data.closedAt),
      },
    );
  }

  async function updateApplicationStatus(
    applicationId: string,
    data: UpdateApplicationStatusInput,
    userId: string,
  ) {
    const application = await getApplicationById(
      applicationId,
      userId,
    );

    if (application.status === data.status) {
      throw new BadRequestError(
        "Application already has this status",
        "APPLICATION_STATUS_UNCHANGED",
      );
    }

    const now = new Date();

    let appliedAt = application.appliedAt;
    let interviewAt = application.interviewAt;
    let offerAt = application.offerAt;
    let closedAt = application.closedAt;

    if (
      data.status !== ApplicationStatus.SAVED &&
      !appliedAt
    ) {
      appliedAt = now;
    }

    if (
      isInterviewStatus(data.status) &&
      !interviewAt
    ) {
      interviewAt =
        parseDate(data.interviewAt) ?? now;
    }

    if (
      data.status === ApplicationStatus.OFFER &&
      !offerAt
    ) {
      offerAt = now;
    }

    if (
      isClosedStatus(data.status) &&
      !closedAt
    ) {
      closedAt = now;
    }

    return repository.updateApplicationStatus({
      applicationId,
      userId,

      fromStatus: application.status,
      toStatus: data.status,
      note: data.note,

      appliedAt,
      interviewAt,
      followUpDate:
        parseDate(data.followUpDate) ??
        application.followUpDate,
      offerAt,
      closedAt,
    });
  }

  async function deleteApplication(
    applicationId: string,
    userId: string,
  ) {
    await getApplicationById(applicationId, userId);

    return repository.deleteApplication(
      applicationId,
      userId,
    );
  }

  return {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
  };
};
