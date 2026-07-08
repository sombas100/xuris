import express from 'express';
import { coverLetterController } from './cover-letter.controller';

const router = express.Router();
const controller = coverLetterController();

router.post('/', controller.generateCoverLetter);

router.get('/:id', controller.getCoverLetterById);
router.get('/resume/:resumeId', controller.getCoverLettersByResumeId);
router.get('/job/:jobPostId', controller.getCoverLettersByJobPostId)


export default router;