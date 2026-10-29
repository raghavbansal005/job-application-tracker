import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoutes from "./pages/auth/ProtectedRoutes";

import AppLayout from "./components/layout/AppLayout";

import LandingPage from "./pages/public/LandingPage"
import Dashboard from "./pages/app/Dashboard";

import Applications from "./pages/app/Applications";
import NewApplication from "./pages/app/NewApplication";
import ApplicationDetails from "./pages/app/ApplicationDetails";
import EditApplication from "./pages/app/EditApplication";

import Interviews from "./pages/app/Interviews";
import NewInterview from "./pages/app/NewInterview";
import InterviewDetails from "./pages/app/InterviewDetails";
import EditInterview from "./pages/app/EditInterview";

import FollowUps from './pages/app/FollowUps'
import NewFollowUp from './pages/app/NewFollowUp'
import FollowUpDetails from './pages/app/FollowUpDetails'
import EditFollowUp from './pages/app/EditFollowUp'

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