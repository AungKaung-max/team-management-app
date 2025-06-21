"use client";

import { useApp } from "@/app/contexts/auth-context";
import { LoginForm } from "./login-form";
import { Dashboard } from "./dashboard";

export function App() {
  const { isAuthenticated } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated ? <Dashboard /> : <LoginForm />}
    </div>
  );
}
