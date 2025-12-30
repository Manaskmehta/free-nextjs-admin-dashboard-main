import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Signin Page NextAdmin Dashboard Kit",
};

export default function SignIn() {
  return (
    <SignInForm />
  );
}
