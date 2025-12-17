'use server';
import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async ({ email, password, fullName,
    country, investmentGoals, preferredIndustry }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({
            body: { email, password, name: fullName }
        })


        if (response) {
            await inngest.send({
                name: "app/user.created",
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    preferredIndustry
                }
            })
        }

        return {
            success: true,
            data: response
        }
    }
    catch (error) {
        console.log('Sign up failed:', error);
        return {
            success: false,
            error: "Sign up failed. Please try again."
        }
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({
            body: { email, password }
        })

        return {
            success: true,
            data: response
        }
    }
    catch (error) {
        console.log('Sign in failed:', error);
        return {
            success: false,
            error: "Sign in failed. Please try again."
        }
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
        return {
            success: true
        }
    }
    catch (error) {
        console.log('Sign out failed:', error)
        return {
            success: false,
            error: "Sign out failed"
        }
    }
}