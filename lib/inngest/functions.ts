import { inngest } from "@/lib/inngest/client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./promts";
import { sendWelcomeEmail } from "@/lib/nodemailer";

export const sendSignUpEmail = inngest.createFunction(
    { id: "sign-up-email" },
    { event: 'app/user.created' },
    async ({ event, step }) => {
        const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
        `

        const promts = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace("{{user_profile}}", userProfile)

        const response = await step.ai.infer("generate-welcome-intro", {
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: promts }
                        ]
                    }
                ]
            }
        })

        await step.run('send-welcome-email', async () => {
            const part = response.candidates?.[0].content?.parts?.[0];

            const introText = (part && 'text' in part ? part.text : null) ||
                "Thank for joining Stocky Mate! You now have the tools to track markets and make smarter moves."


            // send mail logic...
            const { data: { email, name } } = event
            return await sendWelcomeEmail({ email, name, intro: introText })
        })

        return {
            success: true,
            message: 'Welcome email sent successfully'
        }
    }
)