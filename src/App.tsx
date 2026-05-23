import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { PageShell } from "./components/PageShell";
import { ExplorePage } from "./pages/ExplorePage";
import { LandingPage } from "./pages/LandingPage";

export function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="explore" element={<ExplorePage />} />
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
          element={<PageShell title="Location details" description="Venue detail — shared by Where / When paths." />}
        />
        <Route
          path="vendor/:vendorId"
          element={<PageShell title="Vendor details" description="Vendor detail — from Explore path." />}
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

        <Route path="account" element={<PageShell title="Account" />} />
        <Route path="account/profile" element={<PageShell title="My profile" />} />
        <Route path="account/events" element={<PageShell title="My events" />} />
        <Route path="account/privacy" element={<PageShell title="Privacy and security" />} />
        <Route path="account/messages" element={<PageShell title="Messages (account)" />} />
        <Route path="account/docs" element={<PageShell title="My docs" />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
