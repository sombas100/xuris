import type {
  ApplicationStatus,
  Prisma,
} from "../../../generated/prisma/client";

import { prisma } from "../../lib/prisma";

type CreateApplicationData = {
  userId: string;

  resumeId?: string | null;
  jobPostId?: string | null;
  coverLetterId?: string | null;

  company: string;
  role: string;

  jobUrl?: string | null;
  location?: string | null;
  salary?: string | null;
  notes?: string | null;

  status: ApplicationStatus;

  appliedAt?: Date | null;
  interviewAt?: Date | null;
  followUpDate?: Date | null;
  offerAt?: Date | null;
  closedAt?: Date | null;
};

type UpdateApplicationData = {
  resumeId?: string | null;
  jobPostId?: string | null;
  coverLetterId?: string | null;

  company?: string;
  role?: string;

  jobUrl?: string | null;
  location?: string | null;
  salary?: string | null;
  notes?: string | null;

  appliedAt?: Date | null;
  interviewAt?: Date | null;
  followUpDate?: Date | null;
  offerAt?: Date | null;
  closedAt?: Date | null;
};

type ListApplicationsOptions = {
  userId: string;
  status?: ApplicationStatus;
  search?: string;
  sort:
    | "createdAt"
    | "updatedAt"
    | "appliedAt"
    | "followUpDate"
    | "company"
    | "role";
  order: "asc" | "desc";
  page: number;
  limit: number;
};

const applicationInclude = {
  resume: {
    select: {
      id: true,
      title: true,
      originalName: true,
      status: true,
    },
  },

  jobPost: {
    select: {
      id: true,
      title: true,
      company: true,
      location: true,
      jobUrl: true,
    },
  },

  coverLetter: {
    select: {
      id: true,
      title: true,
      tone: true,
    },
  },
} satisfies Prisma.JobApplicationInclude;

export const applicationRepository = () => {
  async function createApplication(
    data: CreateApplicationData,
  ) {
    return prisma.$transaction(async (transaction) => {
      const application =
        await transaction.jobApplication.create({
          data,
          include: applicationInclude,
        });

      await transaction.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          fromStatus: null,
          toStatus: data.status,
          note: "Application created",
        },
      });

      return application;
    });
  }

  async function retrieveApplications({
    userId,
    status,
    search,
    sort,
    order,
    page,
    limit,
  }: ListApplicationsOptions) {
    const where: Prisma.JobApplicationWhereInput = {
      userId,

      ...(status ? { status } : {}),

      ...(search
        ? {
            OR: [
              {
                company: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                role: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                location: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    };

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,

        orderBy: {
          [sort]: order,
        },

        skip: (page - 1) * limit,
        take: limit,

        include: applicationInclude,
      }),

      prisma.jobApplication.count({
        where,
      }),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async function retrieveApplicationById(
    applicationId: string,
    userId: string,
  ) {
    return prisma.jobApplication.findFirst({
      where: {
        id: applicationId,
        userId,
      },

      include: {
        ...applicationInclude,

        statusHistory: {
          orderBy: {
            changedAt: "desc",
          },
        },
      },
    });
  }

  async function updateApplication(
    applicationId: string,
    userId: string,
    data: UpdateApplicationData,
  ) {
    return prisma.jobApplication.update({
      where: {
        id: applicationId,
        userId,
      },

      data,
      include: applicationInclude,
    });
  }

  async function updateApplicationStatus({
    applicationId,
    userId,
    fromStatus,
    toStatus,
    note,
    appliedAt,
    interviewAt,
    followUpDate,
    offerAt,
    closedAt,
  }: {
    applicationId: string;
    userId: string;
    fromStatus: ApplicationStatus;
    toStatus: ApplicationStatus;
    note?: string | null;
    appliedAt?: Date | null;
    interviewAt?: Date | null;
    followUpDate?: Date | null;
    offerAt?: Date | null;
    closedAt?: Date | null;
  }) {
    return prisma.$transaction(async (transaction) => {
      const application =
        await transaction.jobApplication.update({
          where: {
            id: applicationId,
            userId,
          },

          data: {
            status: toStatus,
            appliedAt,
            interviewAt,
            followUpDate,
            offerAt,
            closedAt,
          },

          include: applicationInclude,
        });

      await transaction.applicationStatusHistory.create({
        data: {
          applicationId,
          fromStatus,
          toStatus,
          note,
        },
      });

      return application;
    });
  }

  async function deleteApplication(
    applicationId: string,
    userId: string,
  ) {
    return prisma.jobApplication.delete({
      where: {
        id: applicationId,
        userId,
      },
    });
  }

  return {
    createApplication,
    retrieveApplications,
    retrieveApplicationById,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
  };
};