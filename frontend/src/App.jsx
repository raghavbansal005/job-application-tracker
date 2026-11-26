import { lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoutes from "./pages/auth/ProtectedRoutes";

import AppLayout from "./components/layout/AppLayout";

import LandingPage from "./pages/public/LandingPage"

const Dashboard = lazy(() => import("./pages/app/Dashboard"))
const Settings = lazy(() => import("./pages/app/Settings"))
const Applications = lazy(() => import("./pages/app/Applications"))
const NewApplication = lazy(() => import("./pages/app/NewApplication"))
const ApplicationDetails = lazy(() => import("./pages/app/ApplicationDetails"))
const EditApplication = lazy(() => import("./pages/app/EditApplication"))
const Interviews = lazy(() => import("./pages/app/Interviews"))
const NewInterview = lazy(() => import("./pages/app/NewInterview"))
const InterviewDetails = lazy(() => import("./pages/app/InterviewDetails"))
const EditInterview = lazy(() => import("./pages/app/EditInterview"))
const FollowUps = lazy(() => import("./pages/app/FollowUps"))
const NewFollowUp = lazy(() => import("./pages/app/NewFollowUp"))
const FollowUpDetails = lazy(() => import("./pages/app/FollowUpDetails"))
const EditFollowUp = lazy(() => import("./pages/app/EditFollowUp"))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/applications" element={<Applications />} />
            <Route path="/applications/new" element={<NewApplication />} />
            <Route path="/applications/:id/edit" element={<EditApplication />} />
            <Route path="/applications/:id" element={<ApplicationDetails />} />

            <Route path="/interviews" element={<Interviews />} />
            <Route path="/interviews/new" element={<NewInterview />} />
            <Route path="/interviews/:id/edit" element={<EditInterview />} />
            <Route path="/interviews/:id" element={<InterviewDetails />} />

            <Route path='/followups' element={<FollowUps />} />
            <Route path='/followups/new' element={<NewFollowUp />} />
            <Route path='/followups/:id/edit' element={<EditFollowUp />} />
            <Route path='/followups/:id' element={<FollowUpDetails />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App