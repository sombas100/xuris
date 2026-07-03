import { HttpError } from "../../errors/HttpError";
import { s3Service } from "../aws/s3.service";
import { resumeRepository } from "./resume.repository";

const repository = resumeRepository();
const storage = s3Service();

export const resumeService = () => {
  async function uploadResume(file: Express.Multer.File, userId: string) {
    const uploadedFile = await storage.uploadResumeToS3({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });

    const resume = await repository.createResume({
      userId,
      title: file.originalname,
      originalName: file.originalname,
      fileUrl: uploadedFile.fileUrl,
      fileKey: uploadedFile.fileKey,
      mimeType: file.mimetype,
      fileSize: file.size,
      status: "UPLOADED",
    });

    return resume;
  }

  async function getResume(id: string) {
    const resume = await repository.retrieveResume(id);

    if (!resume) {
      throw new HttpError("Resume not found", 404, "RESUME_NOT_FOUND");
    }

    if(!resume.fileKey)
      throw new HttpError('Resume file key is missing', 500, "RESUME_FILE_KEY_MISSING")

    const downloadUrl = await storage.getResumeDownloadUrl(resume.fileKey);

    return {
      ...resume,
      downloadUrl,
    };
  }

  return {
    uploadResume,
    getResume,
  };
};