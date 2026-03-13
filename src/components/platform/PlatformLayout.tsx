import { Outlet } from "react-router-dom";
import PlatformSidebar from "./PlatformSidebar";

export default function PlatformLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-body transition-colors duration-300">
      <PlatformSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
