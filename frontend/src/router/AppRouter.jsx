import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import ComposterLoading from "../components/ui/ComposterLoading.jsx";

// Lazy load pages for better performance
const LandingPage = lazy(() => import("../pages/LandingPage.jsx"));
const Docs = lazy(() => import("../pages/Docs.jsx"));

// Auth Pages
const Login = lazy(() => import("../pages/Auth/Login.jsx"));
const Signup = lazy(() => import("../pages/Auth/Signup.jsx"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword.jsx"));
const NewPassword = lazy(() => import("../pages/Auth/NewPassword.jsx"));

// Dashboard Pages
const DashboardLayout = lazy(() => import("../components/layout/DashboardLayout.jsx"));
const DashboardHome = lazy(() => import("../pages/Dashboard/DashboardHome.jsx"));
const ComponentsList = lazy(() => import("../pages/Dashboard/ComponentsList.jsx"));
const ComponentDetail = lazy(() => import("../pages/Dashboard/ComponentDetail.jsx"));
const UploadComponent = lazy(() => import("../pages/Dashboard/UploadComponent.jsx"));
const Settings = lazy(() => import("../pages/Dashboard/Settings.jsx"));

// Simple loading state that matches the dark theme
const PageLoader = () => (
  <div className="w-screen h-screen bg-[#050505] flex items-center justify-center">
    <ComposterLoading size={64} />
  </div>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/docs" element={<Docs />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password" element={<NewPassword />} />

          {/* Dashboard Routes - Protected */}
          <Route path="/app" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="components" element={<ComponentsList />} />
            <Route path="components/:id" element={<ComponentDetail />} />
            <Route path="upload" element={<UploadComponent />} />
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Navigate to="/app/settings" replace />} />
            <Route path="tags" element={<div className="text-white p-8">Tags Page (Coming Soon)</div>} />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
