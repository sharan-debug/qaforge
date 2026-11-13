import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";
import FeatureDetail from "./pages/FeatureDetails";
import FeatureEdit from "./pages/FeatureEdit";
import ClosureReport from "./pages/ClosureReport";
import ImportPage from "./pages/ImportPage";
import AdminCoreFeatures from "./pages/AdminCoreFeatures";
import AdminUsers from "./pages/AdminUsers";
import QuickAdd from "./pages/QuickAdd";
import QAActionsPage from "./pages/QAActionsPage";
import AgentPage from "./pages/AgentPage";
import AdminAIFeedback from "./pages/AdminAIFeedback";
import Layout from "./components/Layout";
import { Toaster } from "sonner";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-zinc-400">Loading…</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

// Root gate: authenticated → dashboard, unauthenticated → landing page
function RootGate() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-zinc-400">Loading…</div>
      </div>
    );
  }
  if (!user) return <LandingPage />;
  return (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RootGate />}>
        <Route index element={<Dashboard />} />
        <Route path="features" element={<Features />} />
        <Route path="features/quick-add" element={<QuickAdd />} />
        <Route path="features/new" element={<FeatureEdit />} />
        <Route path="features/:id" element={<FeatureDetail />} />
        <Route path="features/:id/edit" element={<FeatureEdit />} />
        <Route path="features/:id/closure-report" element={<ClosureReport />} />
        <Route path="import" element={<ImportPage />} />
        <Route path="admin/core-features" element={<RoleRoute roles={["admin"]}><AdminCoreFeatures /></RoleRoute>} />
        <Route path="admin/users" element={<RoleRoute roles={["admin"]}><AdminUsers /></RoleRoute>} />
        <Route path="admin/ai-feedback" element={<RoleRoute roles={["admin", "approver"]}><AdminAIFeedback /></RoleRoute>} />
        <Route path="qa" element={<QAActionsPage />} />
        <Route path="agent" element={<AgentPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="App">
          <BrowserRouter>
            <AuthProvider>
              <AppRouter />
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </BrowserRouter>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
