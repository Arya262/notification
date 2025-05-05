import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import Loader from "./components/Loader"; 

// Lazy load components
const ContactList = lazy(() => import("./features/contacts/ContactList"));
const Templates = lazy(() => import("./features/templates/Templates"));
const Chats = lazy(() => import("./features/chats/Chats"));
const Help = lazy(() => import("./features/help/Help"));
const Setting = lazy(() => import("./features/settings/Setting"));
const Broadcast = lazy(() => import("./features/broadcast/Broadcast"));
const NotFound = lazy(() => import("./components/NotFound"));
const DashboardHome = lazy(() => import("./features/dashboard/DashboardHome"));
const ExploreTemplates = lazy(() => import("./features/templates/ExploreTemplates"));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          {/* Dashboard default */}
          <Route
            index
            element={
              <ErrorBoundary>
                <DashboardHome />
              </ErrorBoundary>
            }
          />

          {/* Child Routes */}
          <Route
            path="contact"
            element={
              <ErrorBoundary>
                <ContactList />
              </ErrorBoundary>
            }
          />
          <Route
            path="templates"
            element={
              <ErrorBoundary>
                <Templates />
              </ErrorBoundary>
            }
          />
                    <Route
            path="templates/explore"
            element={
              <ErrorBoundary>
                <ExploreTemplates />
              </ErrorBoundary>
            }
          />
          <Route
            path="chats"
            element={
              <ErrorBoundary>
                <Chats />
              </ErrorBoundary>
            }
          />
          <Route
            path="broadcast"
            element={
              <ErrorBoundary>
                <Broadcast />
              </ErrorBoundary>
            }
          />
          <Route
            path="settings"
            element={
              <ErrorBoundary>
                <Setting />
              </ErrorBoundary>
            }
          />
          <Route
            path="help"
            element={
              <ErrorBoundary>
                <Help />
              </ErrorBoundary>
            }
          />

          {/* Redirect legacy path */}
          <Route path="contacts" element={<Navigate to="/contact" replace />} />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <ErrorBoundary>
                <NotFound />
              </ErrorBoundary>
            }
          />
        </Route>

        {/* Optional: Root-level fallback for unmatched routes outside of layout */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;
