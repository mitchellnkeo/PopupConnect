import type { ReactNode } from "react";
import { Navigate, Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppShell } from "./components/AppShell";
import { PageShell } from "./components/PageShell";
import { AccountLayout } from "./pages/account/AccountLayout";
import { RoleDashboardRoute } from "./components/auth/RoleDashboardRoute";
import { VendorRoute } from "./components/auth/VendorRoute";
import { AccountHomePage } from "./pages/account/AccountHomePage";
import { PlannerAccountPage } from "./pages/account/PlannerAccountPage";
import { VendorAccountPage } from "./pages/account/VendorAccountPage";
import { AccountPlaceholderPage } from "./pages/account/AccountPlaceholderPage";
import { EventsPage } from "./pages/account/EventsPage";
import { MessagesPage } from "./pages/account/MessagesPage";
import { PrivacySettingsPage } from "./pages/account/PrivacySettingsPage";
import { ProfilePage } from "./pages/account/ProfilePage";
import { VendorProfileEditPage } from "./pages/account/VendorProfileEditPage";
import { AuthCallbackPage } from "./pages/auth/AuthCallbackPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { SignInPage } from "./pages/auth/SignInPage";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { WelcomePage } from "./pages/auth/WelcomePage";
import { QuoteConfirmationPage } from "./pages/booking/QuoteConfirmationPage";
import { QuoteRequestPage } from "./pages/booking/QuoteRequestPage";
import { PaymentPage } from "./pages/booking/PaymentPage";
import { ExplorePage } from "./pages/ExplorePage";
import { LandingPage } from "./pages/LandingPage";
import { VendorDetailPage } from "./pages/VendorDetailPage";

function RoleAccountRoute({ role, children }: { role: "vendor" | "host" | "organizer"; children: ReactNode }) {
  const [params] = useSearchParams();
  if (import.meta.env.DEV && params.get("preview") === "1") return children;
  return (
    <ProtectedRoute>
      <RoleDashboardRoute role={role}>{children}</RoleDashboardRoute>
    </ProtectedRoute>
  );
}

function AccountSettingsGate() {
  const [params] = useSearchParams();
  const { pathname } = useLocation();
  const preview =
    import.meta.env.DEV &&
    params.get("preview") === "1" &&
    (pathname.startsWith("/account/settings/events") ||
      pathname.startsWith("/account/settings/messages"));
  if (preview) return <AccountLayout />;
  return (
    <ProtectedRoute>
      <AccountLayout />
    </ProtectedRoute>
  );
}

export function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="vendors" element={<LandingPage />} />
      <Route path="explore" element={<ExplorePage />} />
      <Route path="vendor/:vendorId" element={<VendorDetailPage />} />

      <Route path="booking/quote" element={<QuoteRequestPage />} />
      <Route path="booking/confirm" element={<QuoteConfirmationPage />} />
      <Route path="booking/payment" element={<PaymentPage />} />

      <Route path="sign-in" element={<SignInPage />} />
      <Route path="sign-up" element={<SignUpPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="auth/callback" element={<AuthCallbackPage />} />
      <Route path="welcome" element={<WelcomePage />} />

      <Route
        path="account"
        element={
          <ProtectedRoute>
            <AccountHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="account/vendor"
        element={
          <RoleAccountRoute role="vendor">
            <VendorAccountPage />
          </RoleAccountRoute>
        }
      />
      <Route
        path="account/planner"
        element={
          <RoleAccountRoute role="organizer">
            <PlannerAccountPage previewRole="organizer" />
          </RoleAccountRoute>
        }
      />
      <Route
        path="account/host"
        element={
          <RoleAccountRoute role="host">
            <PlannerAccountPage previewRole="host" />
          </RoleAccountRoute>
        }
      />

      <Route path="account/settings" element={<AccountSettingsGate />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="vendor"
          element={
            <VendorRoute>
              <VendorProfileEditPage />
            </VendorRoute>
          }
        />
        <Route path="events" element={<EventsPage />} />
        <Route path="privacy" element={<PrivacySettingsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route
          path="docs"
          element={
            <AccountPlaceholderPage
              title="My docs"
              description="Uploaded documents will be stored in Supabase Storage and listed here."
            />
          }
        />
      </Route>

      <Route element={<AppShell />}>
        <Route
          path="where"
          element={<PageShell title="Where" description="Search and filter by location." />}
        />
        <Route
          path="where/results"
          element={<PageShell title="Location results" description="Listings from the Where flow." />}
        />

        <Route
          path="when"
          element={<PageShell title="When" description="Choose dates or availability windows." />}
        />
        <Route
          path="when/results"
          element={
            <PageShell
              title="Date results"
              description="Locations near you for the selected timeframe."
            />
          }
        />

        <Route path="booking" element={<Navigate to="/booking/quote" replace />} />
        <Route path="booking/review" element={<Navigate to="/booking/quote" replace />} />

        <Route path="messages" element={<Navigate to="/account/settings/messages" replace />} />
        <Route
          path="messages/:threadId"
          element={<Navigate to="/account/settings/messages" replace />}
        />

        <Route
          path="location/:locationId"
          element={
            <PageShell
              title="Location details"
              description="Venue detail — shared by Where / When paths."
            />
          }
        />

        <Route path="about" element={<PageShell title="About" />} />
        <Route path="about/contact" element={<PageShell title="Contact us" />} />
        <Route path="about/social" element={<PageShell title="Social media" />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
