import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/context/AuthContext.jsx"

function ProtectedRoutes() {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        )
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: { pathname: location.pathname, search: location.search, hash: location.hash } }} />
    }
    return <Outlet />
}

export default ProtectedRoutes