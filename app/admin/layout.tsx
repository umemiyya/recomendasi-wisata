
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";

import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="w-full flex flex-col gap-10 items-center">
        <nav className="w-full bg-green-100 flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <div className="space-x-3">
                <Link href="/admin/user">Pengguna</Link>
                <Link href="/admin/destination">Destinasi</Link>
              </div>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="max-w-5xl w-full p-5">
          {children}
        </div>
      </div>
    </main>
  );
}
