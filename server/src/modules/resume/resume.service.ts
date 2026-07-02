import { HttpError } from "../../errors/HttpError";
import { resumeRepository } from "./resume.repository";

const repository = resumeRepository()

export async function getResume(id: string) {
    const resume = await repository.getResume(id);

    if (!resume)
            throw new HttpError("Resume not found", 404, 'RESUME_NOT_FOUND')


    return resume;
}