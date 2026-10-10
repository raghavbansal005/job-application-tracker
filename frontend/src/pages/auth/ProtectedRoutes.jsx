import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/context/AuthContext.jsx"

function ProtectedRoutes() {
    const { isAuthenticated, loading } = useAuth()

    if(loading){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        )
    }
    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }
    return <Outlet />
}

export default ProtectedRoutes