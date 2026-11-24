import type { ReactNode } from "react";
import { Suspense } from "react";
import Navbar from "@/components/layout/navbar";
import { NavbarLoading } from "@/components/layout/navbar-loading";
import { currentUserRole } from "@/features/auth/actions/current-user-role";

async function NavbarWithUserRole() {
  const result = await currentUserRole();
  const userRole = result.success ? result.role : null;

  return <Navbar userRole={userRole} />;
}

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<NavbarLoading />}>
        <NavbarWithUserRole />
      </Suspense>
      <div className="pt-24">{children}</div>
    </main>
  );
}
