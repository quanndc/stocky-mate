import { Inngest } from 'inngest';


export const inngest = new Inngest({
    id: "stocky-mate",
    ai: {
        gemini: { apiKey: process.env.GEMINI_API_KEY! }
    }
})