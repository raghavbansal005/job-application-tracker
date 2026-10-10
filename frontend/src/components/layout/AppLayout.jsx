import { BriefcaseBusiness, CalendarDays, ChevronLeft, ChevronRight, LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

function AppLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const navigationItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Applications', path: '/applications', icon: BriefcaseBusiness },
        { label: 'Interviews', path: '/interviews', icon: CalendarDays },
    ]

    const handleLogout = () => {
        logout()
    }

    const isActiveRoute = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard'
        }
        return location.pathname.startsWith(path)
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {mobileSidebarOpen && (<button type="button" aria-label="Close navigation" onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />)}
            <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar transition-all duration-200 lg:translate-x-0 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} ${sidebarCollapsed ? "lg:w-20" : "lg:w-64"} w-72`}>
                <div className="relative flex h-16 items-center border-b border-sidebar-border px-4">
                    <div className={`flex min-w-0 items-center gap-3 ${sidebarCollapsed ? "w-full justify-center" : "flex-1"}`}>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <BriefcaseBusiness className="h-5 w-5" />
                        </div>

                        {!sidebarCollapsed && (
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">JobTrack</p>
                                <p className="truncate text-xs text-muted-foreground">Career command center</p>
                            </div>
                        )}
                    </div>

                    <button type="button" onClick={() => setSidebarCollapsed((previous) => !previous)}
                        className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground lg:flex"
                        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                        {sidebarCollapsed ? (<ChevronRight className="h-4 w-4" />) : (<ChevronLeft className="h-4 w-4" />)}
                    </button>

                    <button type="button" onClick={() => setMobileSidebarOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground lg:hidden"
                        aria-label="Close sidebar">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                    {!sidebarCollapsed && (
                        <p className="mb-2 px-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Workspace</p>
                    )}

                    {navigationItems.map((item) => {
                        const Icon = item.icon
                        const active = isActiveRoute(item.path)

                        return (
                            <NavLink key={item.path} to={item.path} onClick={() => setMobileSidebarOpen(false)} title={sidebarCollapsed ? item.label : undefined}
                                className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors
                                    ${sidebarCollapsed ? "justify-center" : ""}
                                    ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
                                <Icon className="h-4 w-4 shrink-0" />

                                {!sidebarCollapsed && (<span>{item.label}</span>)}
                            </NavLink>
                        )
                    })}

                </nav>

                <div className="border-t border-sidebar-border p-3">
                    {!sidebarCollapsed && (
                        <div className="mb-3 flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <UserRound className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">JobTrack User</p>
                                <p className="truncate text-xs text-muted-foreground">ID: {user?.userId || "Authenticated"}</p>
                            </div>
                        </div>
                    )}

                    <Button variant="ghost" onClick={handleLogout} title={sidebarCollapsed ? "Logout" : undefined}
                        className={`w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive ${sidebarCollapsed ? "justify-center px-0" : "justify-start"}`}>
                        <LogOut className="h-4 w-4" />
                        {!sidebarCollapsed && (<span className="ml-3">Logout</span>)}
                    </Button>
                </div>
            </aside>

            <div className={`min-h-screen transition-[padding] duration-200 ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>
                <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
                    <div className="flex flex-1 items-center gap-3">
                        <button type="button" onClick={() => setMobileSidebarOpen(true)}
                            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
                            aria-label="Open navigation">
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                                {location.pathname === "/dashboard" ? "Dashboard" : location.pathname.startsWith("/applications") ? "Applications" : location.pathname.startsWith("/interviews") ? "Interviews" : "JobTrack"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-medium">JobTrack User</p>
                            <p className="text-xs text-muted-foreground">Career workspace</p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <UserRound className="h-4 w-4" />
                        </div>
                    </div>
                </header>

                <main className="min-h-[calc(100vh-4rem)]">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AppLayout