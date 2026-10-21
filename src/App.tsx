import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Landing from "./landing/Landing";
import NotFound from "./NotFound";
import Login, { RequireAuth } from "./Login";

const Shell = lazy(() => import("./app/Shell"));
const Calls = lazy(() => import("./app/Calls"));
const Leads = lazy(() => import("./app/Leads"));
const Team = lazy(() => import("./app/Team"));
const Hire = lazy(() => import("./app/Hire"));

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!pathname.startsWith("/app/calls/")) window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<RequireAuth><Shell /></RequireAuth>}>
            <Route index element={<Navigate to="calls" replace />} />
            <Route path="calls" element={<Calls />} />
            <Route path="calls/:id" element={<Calls />} />
            <Route path="leads" element={<Leads />} />
            <Route path="team" element={<Team />} />
            <Route path="team/new" element={<Hire />} />
            <Route path="*" element={<NotFound inApp />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
