import { s3Service } from "../aws/s3.service.js";
import { resumeRepository } from "./resume.repository.js";
import { extractResumeText } from "./resume-text.service.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { InternalServerError } from "../../errors/InternalServerError.js";

const repository = resumeRepository();
const storage = s3Service();
 

export const resumeService = () => {
  async function uploadResume(file: Express.Multer.File, userId: string) {
    
  let uploadedFile: {
    fileKey: string;
    fileUrl: string;
  } | null = null;

  try {
    uploadedFile = await storage.uploadResumeToS3({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });

    const extractedText = await extractResumeText(file);

    const resume = await repository.createResume({
      userId,
      title: file.originalname,
      originalName: file.originalname,
      fileUrl: uploadedFile.fileUrl,
      fileKey: uploadedFile.fileKey,
      mimeType: file.mimetype,
      fileSize: file.size,
      extractedText: extractedText,
      status: "EXTRACTED",
    });

    return resume;
  } catch (error) {
    if (uploadedFile?.fileKey) {
      await storage.deleteResumeFromS3(uploadedFile.fileKey);
    }

    throw error;
  }
}

  async function getResume(id: string, userId: string) {
    const resume = await repository.retrieveResume(id, userId);

    if (!resume) {
      throw new NotFoundError("Resume not found", "RESUME_NOT_FOUND");
    }

    if(!resume.fileKey)
      throw new InternalServerError('Resume file key is missing', "RESUME_FILE_KEY_MISSING")

    const downloadUrl = await storage.getResumeDownloadUrl(resume.fileKey);

    return {
      ...resume,
      downloadUrl,
    };
  }

  async function getAllResumes(userId: string) {
    return repository.retrieveAllResumes(userId); 
  }

  async function deleteResume(id: string, userId: string) {
    const resume = await repository.retrieveResume(id, userId);

    if (!resume)
      throw new NotFoundError("Resume not found", "RESUME_NOT_FOUND");

    if (!resume.fileKey)
      throw new NotFoundError("Resume file key not found", "FILE_KEY_NOT_FOUND")

    await storage.deleteResumeFromS3(resume.fileKey);
    const deletedResume = repository.deleteResume(id, userId);

    return deletedResume;
  }

  return {
    uploadResume,
    getAllResumes,
    getResume,
    deleteResume,
  };
};