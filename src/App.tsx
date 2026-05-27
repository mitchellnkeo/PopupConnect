import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppShell } from "./components/AppShell";
import { PageShell } from "./components/PageShell";
import { AccountLayout } from "./pages/account/AccountLayout";
import { AccountPlaceholderPage } from "./pages/account/AccountPlaceholderPage";
import { ProfilePage } from "./pages/account/ProfilePage";
import { SignInPage } from "./pages/auth/SignInPage";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { WelcomePage } from "./pages/auth/WelcomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { LandingPage } from "./pages/LandingPage";

export function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="explore" element={<ExplorePage />} />

      <Route path="sign-in" element={<SignInPage />} />
      <Route path="sign-up" element={<SignUpPage />} />
      <Route path="welcome" element={<WelcomePage />} />

      <Route
        path="account"
        element={
          <ProtectedRoute>
            <AccountLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="events"
          element={
            <AccountPlaceholderPage
              title="My events"
              description="Your booked and hosted events will appear here once reservations are connected to Supabase."
            />
          }
        />
        <Route
          path="privacy"
          element={
            <AccountPlaceholderPage
              title="Privacy and security"
              description="Password reset, email preferences, and data export will be managed here."
            />
          }
        />
        <Route
          path="messages"
          element={
            <AccountPlaceholderPage
              title="Messages"
              description="Inbox and chat threads will sync here when messaging is implemented."
            />
          }
        />
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

        <Route
          path="explore/results"
          element={<PageShell title="Explore results" description="Discovery results." />}
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
        <Route
          path="vendor/:vendorId"
          element={
            <PageShell title="Vendor details" description="Vendor detail — from Explore path." />
          }
        />

        <Route path="booking" element={<PageShell title="Booking" />} />
        <Route path="booking/review" element={<PageShell title="Review booking" />} />
        <Route path="booking/payment" element={<PageShell title="Select payment" />} />
        <Route path="booking/confirm" element={<PageShell title="Confirm booking" />} />

        <Route path="messages" element={<PageShell title="Messages" />} />
        <Route path="messages/:threadId" element={<PageShell title="Individual chat" />} />

        <Route path="about" element={<PageShell title="About" />} />
        <Route path="about/contact" element={<PageShell title="Contact us" />} />
        <Route path="about/social" element={<PageShell title="Social media" />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
