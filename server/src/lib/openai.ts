import Openai from 'openai'
import { env } from '../config/env.js';

export const openai = new Openai({
    apiKey: env.OPENAI_API_KEY,
});
