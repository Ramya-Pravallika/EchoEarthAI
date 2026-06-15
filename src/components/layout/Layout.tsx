import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 overflow-x-hidden">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
export default Layout;
