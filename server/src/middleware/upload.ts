import multer from 'multer';
import { HttpError } from '../errors/HttpError.js';

const allowedMimeTypes = [
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (_req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
                new HttpError(
                    "Only PDF and DOCX files are allowed",
                     400, 
                     "INVALID_FILE_TYPE"
                    )
            )
        }
        cb(null, true)
    }
    
})