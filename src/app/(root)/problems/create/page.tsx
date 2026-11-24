import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth/require-admin";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreateProblemForm } from "@/features/problems";

export const metadata: Metadata = {
  title: "Create Problem",
  description: "Create and publish a coding problem.",
};

const CreateProblemPage = async () => {
  const access = await requireAdmin();

  if (!access.authorized) {
    redirect("/");
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-12 pt-32">
      <div className="mb-8 flex w-full items-center justify-between gap-4">
        <Link href={"/"}>
          <Button variant={"outline"} size={"icon"}>
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="text-center text-xl font-bold text-amber-400 md:text-3xl">
          Welcome {access.user.firstName}! Create a Problem
        </h1>
        <div className="size-10" aria-hidden="true" />
      </div>

      <CreateProblemForm />
    </section>
  );
};

export default CreateProblemPage;
