import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
}
