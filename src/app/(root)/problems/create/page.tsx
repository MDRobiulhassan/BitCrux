import { ModeToggle } from "@/components/mode-toggle";
import { requireAdmin } from "@/server/auth/require-admin";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreateProblemForm } from "@/features/problems/components/create-form";

const CreateProblemPage = async () => {
  const access = await requireAdmin();

  if (!access.authorized) {
    redirect("/");
  }

  return (
    <section className="flex flex-col items-center justify-center mx-4 my-4">
      <div className="flex flex-row justify-between items-center w-full">
        <Link href={"/"}>
          <Button variant={"outline"} size={"icon"}>
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-amber-400">
          Welcome {access.user.firstName}! Create a Problem
        </h1>
        <ModeToggle />
      </div>

      <CreateProblemForm />
    </section>
  );
};

export default CreateProblemPage;
