import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DarkVeil from "../components/external/DarkVeil.jsx"; // Keep critical UI eager

// Lazy load pages for better performance
// This splits the bundle so users only download what they need
const LandingPage = lazy(() => import("../pages/LandingPage.jsx"));
const Docs = lazy(() => import("../pages/Docs.jsx"));

// Auth Pages
const Login = lazy(() => import("../pages/Auth/Login.jsx"));
const Signup = lazy(() => import("../pages/Auth/Signup.jsx"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword.jsx"));

// Dashboard Pages
const DashboardLayout = lazy(() => import("../components/layout/DashboardLayout.jsx"));
const DashboardHome = lazy(() => import("../pages/Dashboard/DashboardHome.jsx"));
const ComponentsList = lazy(() => import("../pages/Dashboard/ComponentsList.jsx"));
const ComponentDetail = lazy(() => import("../pages/Dashboard/ComponentDetail.jsx"));
const UploadComponent = lazy(() => import("../pages/Dashboard/UploadComponent.jsx"));
const Settings = lazy(() => import("../pages/Dashboard/Settings.jsx"));

// Docs Pages
const DocsLayout = lazy(() => import("../components/layout/DocsLayout.jsx"));
const DocsContent = lazy(() => import("../pages/Docs/DocsContent.jsx"));
const TerminalPage = lazy(() => import("../pages/Docs/TerminalPage.jsx"));

// Simple loading state that matches the dark theme
const PageLoader = () => (
  <div className="w-screen h-screen bg-[#050505] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
  </div>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* Legacy Docs Route - Redirect to new docs */}
          <Route path="/docs" element={<Navigate to="/dashboard/docs" replace />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Dashboard Routes */}
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="components" element={<ComponentsList />} />
            <Route path="components/:id" element={<ComponentDetail />} />
            <Route path="upload" element={<UploadComponent />} />
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Navigate to="/app/settings" replace />} />
            <Route path="tags" element={<div className="text-white p-8">Tags Page (Coming Soon)</div>} />
          </Route>

          {/* New Documentation Routes */}
          <Route path="/dashboard/docs" element={<DocsLayout />}>
            <Route index element={<DocsContent />} />
            <Route path="terminal" element={<TerminalPage />} />
            {/* Catch-all for other docs sections to render the main content */}
            <Route path="*" element={<DocsContent />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
