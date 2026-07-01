"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { getToken } from "@/lib/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";
  const [authorized, setAuthorized] = useState(false);

  // Client-side route guard: any admin page without a token bounces to login.
  useEffect(() => {
    if (isLoginPage) return;

    if (getToken()) {
      setAuthorized(true);
    } else {
      router.replace("/admin/login");
    }
  }, [isLoginPage, pathname, router]);

  // Login page shouldn't show sidebar/topbar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Hold rendering until the token check resolves so protected content
  // never flashes for signed-out visitors.
  if (!authorized) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f5ef",
          color: "#8d6a29",
          fontFamily: "var(--font-cormorant)",
          fontSize: 22,
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <div className="adminLayout">

      <Sidebar />

      <div className="mainContent">

        <Topbar />

        <div className="pageContent">
          {children}
        </div>

      </div>

      <style jsx>{`
        .adminLayout {
          display: flex;
          min-height: 100vh;
          background: #f8f5ef;
        }

        .mainContent {
          flex: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
        }

        .pageContent {
          padding: 32px;
        }

        @media (max-width: 992px) {
          .mainContent {
            margin-left: 0;
          }

          .pageContent {
            padding: 20px;
          }
        }
      `}</style>

    </div>
  );
}