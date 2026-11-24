import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function Page() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
