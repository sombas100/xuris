import express from 'express';
import { coverLetterController } from './cover-letter.controller';

const router = express.Router();
const controller = coverLetterController();

router.post('/', controller.generateCoverLetter);


export default router;