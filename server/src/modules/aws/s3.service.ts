import { 
    GetObjectCommand, 
    PutObjectCommand, 
    DeleteObjectCommand 
} from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from "../../lib/s3";
import crypto from 'crypto';
import { env } from "../../config/env";

const bucketName = env.AWS_S3_BUCKET_NAME;

type UploadFileParams = {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
}

export const s3Service = () => {
    async function uploadResumeToS3({ buffer, originalName, mimeType }: UploadFileParams) {
        const fileKey = `resumes/${crypto.randomUUID()}-${originalName}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            Body: buffer,
            ContentType: mimeType,
        })

        await s3.send(command);

        return { 
            fileKey, 
            fileUrl: `https://${bucketName}.s3.${env.AWS_REGION}.amazonaws.com/${fileKey}`,
        };
    }

    async function deleteResumeFromS3(fileKey: string) {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        })

        await s3.send(command);
    }

    async function getResumeDownloadUrl(fileKey: string) {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        })

        return getSignedUrl(s3, command, {
            expiresIn: 60 * 5
        })
    }

    return { uploadResumeToS3, deleteResumeFromS3, getResumeDownloadUrl }
}
