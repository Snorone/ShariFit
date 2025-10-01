import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />; // skicka hem vanliga användare
  }

  return <>{children}</>;
}
