import { useState, useEffect, useMemo, useRef } from "react";
import { ArrowRight, BriefcaseBusiness, Columns3, ExternalLink, List, Plus, Search } from "lucide-react";

import { getApplication, updateApplication } from "@/services/applicationService";
import { useAuth } from "@/context/AuthContext";

import PageHeader from "@/components/layout/PageHeader";
import PageContainer from "@/components/layout/PageContainer";
import StatusBadge from "@/components/common/StatusBadge";
import ApplicationBoard from "@/components/applications/ApplicationBoard";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Applications() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [sortBy, setSortBy] = useState('newest')
    const [view, setView] = useState(user?.preferences?.defaultApplicationView === 'board' ? 'board' : 'list')
    const [updatingIds, setUpdatingIds] = useState([])
    const [statusMessage, setStatusMessage] = useState(null)
    const updatingRef = useRef(new Set())
    const messageTimer = useRef(null)

    useEffect(() => {
        const loadApplication = async () => {
            try {
                setLoading(true)
                setError(null)

                const data = await getApplication()
                setApplications(data.applications)
            }
            catch (error) {
                console.error("Failed to load application:", error)
                setError(error.response?.data?.message || 'Failed to load applications.')
            }
            finally {
                setLoading(false)
            }
        }
        loadApplication();
    }, [])

    const filteredApplication = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();
        const filtered = applications.filter((application) => {
            const matchesSearch = application.company?.toLowerCase().includes(search) || application.jobTitle?.toLowerCase().includes(search);
            const matchesStatus = view === "board" || statusFilter === "All" || application.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === "company") return (a.company || "").localeCompare(b.company || "");
            if (sortBy === "jobTitle") return (a.jobTitle || "").localeCompare(b.jobTitle || "");

            const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : null;
            const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : null;

            if (dateA === null && dateB === null) return 0;
            if (dateA === null) return 1;
            if (dateB === null) return -1;

            if (sortBy === "oldest") {
                return dateA - dateB;
            }

            return dateB - dateA;
        });
    }, [applications, searchTerm, statusFilter, sortBy, view])

    useEffect(() => {
        return () => {
            if (messageTimer.current) {
                clearTimeout(messageTimer.current)
            }
        }
    }, [])

    const showStatusMessage = (type, text) => {
        setStatusMessage({ type, text })

        if (messageTimer.current) {
            clearTimeout(messageTimer.current)
        }
        messageTimer.current = setTimeout(() => setStatusMessage(null), 4000)
    }

    const handleStatusChange = async (application, newStatus) => {
        const id = application._id
        const previousStatus = application.status

        if (newStatus === previousStatus) return
        if (updatingRef.current.has(id)) return

        updatingRef.current.add(id)
        setUpdatingIds(Array.from(updatingRef.current))
        setApplications((current) => current.map((item) => item._id === id ? { ...item, status: newStatus } : item))

        try {
            const data = await updateApplication(id, { status: newStatus })
            setApplications((current) => current.map((item) => item._id === id ? data.application : item))
            showStatusMessage("success", `Moved "${application.jobTitle}" to ${newStatus}.`)
        }
        catch (error) {
            console.error("Failed to update status:", error)
            setApplications((current) => current.map((item) => item._id === id ? { ...item, status: previousStatus } : item))
            showStatusMessage("error", error.response?.data?.message || "Failed to update status. The change was reverted.")
        }
        finally {
            updatingRef.current.delete(id)
            setUpdatingIds(Array.from(updatingRef.current))
        }
    }

    if (loading) {
        return (
            <PageContainer>
                <p className="text-sm text-muted-foreground">Loading applications...</p>
            </PageContainer>
        )
    }

    if (error) {
        return (
            <PageContainer>
                <p className="text-sm text-destructive">{error}</p>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <div className="space-y-8">
                <PageHeader title='Applications' description='Manage and track your applications.' action={
                    <Button className="w-full sm:w-auto" onClick={() => navigate('/applications/new')}>
                        <Plus className="mr-2 h-4 w-4" />Add Application
                    </Button>
                } />

                <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" placeholder="Search by company or job title" value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20" />
                    </div>
                    {view === 'list' && (
                        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full sm:w-auto h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20">
                            <option value="All">All Statuses</option>
                            <option value="Wishlist">Wishlist</option>
                            <option value="Applied">Applied</option>
                            <option value="Screening">Screening</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Withdrawn">Withdrawn</option>
                        </select>
                    )}
                    <div role="group" aria-label="Application view" className="flex h-10 shrink-0 overflow-hidden rounded-md border border-input">
                        <button type="button" onClick={() => setView('list')} aria-pressed={view === 'list'}
                            className={`flex flex-1 items-center justify-center gap-2 px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}>
                            <List className="h-4 w-4" />List
                        </button>
                        <button type="button" onClick={() => setView('board')} aria-pressed={view === 'board'}
                            className={`flex flex-1 items-center justify-center gap-2 px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${view === 'board' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}>
                            <Columns3 className="h-4 w-4" />Board
                        </button>
                    </div>
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort applications" className="w-full sm:w-auto h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20">
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="company">Company A–Z</option>
                        <option value="jobTitle">Job title A–Z</option>
                    </select>
                </div>

                <div role="status" aria-live="polite">
                    {statusMessage && (
                        <p className={`rounded-md border px-3 py-2 text-sm ${statusMessage.type === "error" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"}`}>
                            {statusMessage.text}
                        </p>
                    )}
                </div>
                {filteredApplication.length === 0 ? (
                    <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border/60 bg-card">
                        <div className="text-center">
                            <BriefcaseBusiness className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                            <h2 className="font-semibold text-foreground">{applications.length === 0 ? "No applications yet" : "No applications found"}</h2>
                            <p className="mt-1 text-sm text-muted-foreground">{applications.length === 0 ? "Start tracking your job applications here." : "Try changing your search or status filter."}</p>
                        </div>
                    </div>
                ) : view === 'board' ? (
                    <ApplicationBoard applications={filteredApplication} onStatusChange={handleStatusChange} updatingIds={updatingIds} />
                ) : (
                    <div className="space-y-4">
                        {filteredApplication.map((application) => {
                            return (
                                <div key={application._id} className="rounded-xl border border-border/60 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                        <div className="flex min-w-0 items-start gap-4">
                                            <div className="hidden shrink-0 rounded-lg bg-primary/10 p-2.5 sm:block">
                                                <BriefcaseBusiness className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="font-semibold text-foreground">{application.jobTitle}</h2>
                                                <p className="mt-1 text-sm text-muted-foreground">{application.company}</p>
                                                {application.jobUrl && (
                                                    <a href={application.jobUrl} target="_blank" rel="noreferrer"
                                                        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                                                        View Job
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <StatusBadge status={application.status} />
                                    </div>
                                    <div className="mt-5 grid gap-4 border-t border-border/60 pt-4 text-sm sm:grid-cols-3">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Location</p>
                                            <p className="mt-1 font-medium text-foreground">{application.location || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Employment</p>
                                            <p className="mt-1 font-medium text-foreground">{application.employmentType || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Applied</p>
                                            <p className="mt-1 font-medium text-foreground">{application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                                        <Button variant="ghost" size="sm" onClick={() => navigate(`/applications/${application._id}`)}>
                                            View Details<ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </PageContainer >
    )
}

export default Applications