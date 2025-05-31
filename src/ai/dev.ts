import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-repository.ts';
import '@/ai/flows/inquire-about-code.ts';
import '@/ai/flows/readme-generation.ts';
import '@/ai/flows/solution-planning.ts';
import '@/ai/flows/pr-review.ts';