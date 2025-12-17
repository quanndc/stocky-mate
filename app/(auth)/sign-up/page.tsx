'use client';
import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { useForm } from "react-hook-form";

const SignUp = () => {

	const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
		defaultValues: {
			fullName: '',
			email: '',
			password: '',
			country: 'US',
			investmentGoals: "Growth",
			riskTolerance: "Medium",
			preferredIndustry: "Technology",
		},
		mode: 'onBlur'
	});

	const onSubmit = async (data: SignUpFormData) => {
		try {
			console.log(data);
		}
		catch (error) {
			console.error("Error during sign up:", error);
		}
	};

	return (
		<>
			<h1 className="form-title">Sign Up & Personalize</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				<InputField
					name="fullname"
					label="Full Name"
					placeholder="John Doe"
					register={register}
					error={errors.fullName}
					validation={{ required: "Full Name is required", minLength: 2 }}
				/>

				<InputField
					name="email"
					label="Email"
					placeholder="gideontmq.dev@gmail.com"
					register={register}
					error={errors.email}
					validation={{ required: "Email is required", pattern: /^\w+@\w+\.\w+$/, message: "Invalid email address" }}
				/>

				<InputField
					name="password"
					label="Password"
					placeholder="Enter a strong password"
					type="password"
					register={register}
					error={errors.password}
					validation={{ required: "Password is required", minLength: 8 }}
				/>

				<CountrySelectField
					name="country"
					label="Country"
					control={control}
					error={errors.country}
					required
				/>


				<SelectField
					name="investmentGoals"
					label="Investment Goals"
					control={control}
					placeholder="Select your investment goals"
					options={INVESTMENT_GOALS}
					error={errors.investmentGoals}
				/>

				<SelectField
					name="riskTolerance"
					label="Risk Tolerance"
					control={control}
					placeholder="Select your risk level"
					options={RISK_TOLERANCE_OPTIONS}
					error={errors.riskTolerance}
				/>

				<SelectField
					name="preferredIndustry"
					label="Preferred Industry"
					control={control}
					placeholder="Select your preferred industry"
					options={PREFERRED_INDUSTRIES}
					error={errors.preferredIndustry}
				/>

				<Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
					{isSubmitting ? 'Creating account...' : 'Start Your Investing Journey'}
				</Button>

				<FooterLink text="Alreay have an account" linkText="Sign in" href="/sign-in" />
			</form>
		</>
	)
}

export default SignUp