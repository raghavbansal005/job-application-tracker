import { useState, useEffect, useMemo } from "react";
import { ArrowRight, BriefcaseBusiness, ExternalLink, Plus, Search } from "lucide-react";

import { getApplication } from "@/services/applicationService";

import PageHeader from "@/components/layout/PageHeader";
import PageContainer from "@/components/layout/PageContainer";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Applications() {
    const navigate = useNavigate()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')

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
        return applications.filter((application) => {
            const search = searchTerm.toLowerCase().trim()
            const matchesSearch = application.company?.toLowerCase().includes(search) || application.jobTitle?.toLowerCase().includes(search)
            const matchesStatus = statusFilter === 'All' || application.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [applications, searchTerm, statusFilter])

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

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" placeholder="Search by company or job title" value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20" />
                    </div>
                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20">
                        <option value="All">All Statuses</option>
                        <option value="Wishlist">Wishlist</option>
                        <option value="Applied">Applied</option>
                        <option value="Screening">Screening</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Withdrawn">Withdrawn</option>
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {filteredApplication.length}{" "}{filteredApplication.length === 1 ? "application" : "applications"}
                    </p>
                </div>

                {filteredApplication.length === 0 ? (
                    <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border/60 bg-card">
                        <div className="text-center">
                            <BriefcaseBusiness className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                            <h2 className="font-semibold text-foreground">{applications.length === 0 ? "No applications yet" : "No applications found"}</h2>
                            <p className="mt-1 text-sm text-muted-foreground">{applications.length === 0 ? "Start tracking your job applications here." : "Try changing your search or status filter."}</p>
                        </div>
                    </div>
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

                                        <span className="w-fit shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{application.status}</span>
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
                                        <div className="text-sm text-muted-foreground">
                                            {application.appliedDate ? `Applied on ${new Date(application.appliedDate).toLocaleDateString()}` : 'Application Date not specified'}
                                        </div>
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
        </PageContainer>
    )
}

export default Applications