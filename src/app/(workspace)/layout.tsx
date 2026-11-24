import type { ReactNode } from "react";
import Navbar from "@/components/layout/navbar";
import { currentUserRole } from "@/features/auth/actions/current-user-role";

export default async function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const result = await currentUserRole();
  const userRole = result.success ? result.role : null;

  return (
    <main className="min-h-screen bg-background">
      <Navbar userRole={userRole} />
      <div className="pt-24">{children}</div>
    </main>
  );
}
