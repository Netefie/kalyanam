"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login page shouldn't show sidebar/topbar
  if (pathname === "/admin/login") {
    return <>{children}</>;
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