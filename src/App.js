import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/login";
import { VehicleDetailPage } from "./pages/vehicle-detail";
import { ReportsPage } from "./pages/report";
import { BottomNavigation } from "./components/bottom-navigation";
import { AuthProvider, useAuth } from "./context/auth-context";
import { Main } from "./pages/main-list";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {children}
      <BottomNavigation />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/list"
            element={
              <PrivateRoute>
                <Main />
              </PrivateRoute>
            }
          />

          <Route
            path="/vehicle/:id"
            element={
              <PrivateRoute>
                <VehicleDetailPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <ReportsPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
