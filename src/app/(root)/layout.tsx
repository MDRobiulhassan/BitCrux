import React from "react";
import { Suspense } from "react";
import Navbar from "@/components/layout/navbar";
import { NavbarLoading } from "@/components/layout/navbar-loading";
import { currentUserRole } from "@/features/auth/actions/current-user-role";

export const dynamic = "force-dynamic";

async function NavbarWithUserRole() {
  const result = await currentUserRole();
  const userRole = result?.success ? result.role : null;

  return <Navbar userRole={userRole} />;
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col">
      <Suspense fallback={<NavbarLoading />}>
        <NavbarWithUserRole />
      </Suspense>

      <div className="flex-1 flex flex-col px-4 pb-4">
        <div
          className="absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] 
          dark:bg-size-[16px_16px] bg-[radial-gradient(#dadde2_1px,transparent_1px)] bg-size-[16px_16px]"
        />
        {children}
      </div>
    </main>
  );
};

export default RootLayout;
