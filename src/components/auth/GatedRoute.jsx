import React from "react";
import { useAuth } from "@/lib/AuthContext";
import LoginWall from "./LoginWall";

export default function GatedRoute({ children, pageName }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,215,0,0.2)", borderTopColor: "#ffd700" }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginWall pageName={pageName} />;
  }

  return <>{children}</>;
}