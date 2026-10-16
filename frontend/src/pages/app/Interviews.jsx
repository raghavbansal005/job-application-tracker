import { useState, useEffect, useMemo } from "react";
import { Calendar, Plus, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { getInterviews } from "@/services/interviewService";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";

const getTimestamp = (value) => {
    if (!value) return null;
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
}

function Interviews() {
    const navigate = useNavigate()

    const [interviews, setInterviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        const loadInterviews = async () => {
            try {
                setLoading(true)
                setError(null)

                const data = await getInterviews()
                setInterviews(data.interviews)
            }
            catch (error) {
                console.error('Failed to load interview.', error)
                setError(error.response?.data?.message || 'Failed to load interviews.')
            }
            finally {
                setLoading(false)
            }
        }
        loadInterviews()
    }, [])

    const filteredInterviews = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();
        const filtered = interviews.filter((interview) => {
            const matchesSearch = [interview.round, interview.type, interview.interviewer].some((value) => value?.toLowerCase().includes(search));
            const matchesStatus = statusFilter === "All" || interview.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === "round") {
                return (a.round || "").localeCompare(b.round || "");
            }

            const dateA = getTimestamp(a.scheduledAt);
            const dateB = getTimestamp(b.scheduledAt);

            if (dateA === null && dateB === null) return 0;
            if (dateA === null) return 1;
            if (dateB === null) return -1;

            return sortBy === "oldest" ? dateA - dateB : dateB - dateA;
        });
    }, [interviews, searchTerm, statusFilter, sortBy]);

    if (loading) {
        return (
            <PageContainer>
                <p className="text-sm text-muted-foreground">Loading interviews...</p>
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
                <PageHeader title='Interviews' description='Manage and track your upcoming and completed interviews.' action={
                    <Button className="w-full sm:w-auto" onClick={() => navigate("/interviews/new")}>
                        <Plus className="mr-2 h-4 w-4" />Add Interview
                    </Button>
                } />
                <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" placeholder="Search by round, type, or interviewer" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} aria-label="Search interviews"
                            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20" />
                    </div>
                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter interviews by status"
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 sm:w-auto">
                        <option value="All">All Statuses</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort interviews" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 sm:w-auto">
                        <option value="newest">Latest scheduled</option>
                        <option value="oldest">Earliest scheduled</option>
                        <option value="round">Interview round A–Z</option>
                    </select>
                </div>

                {filteredInterviews.length === 0 ? (
                    <div className="rounded-xl border border-border/60 bg-card p-10 text-center shadow-sm">
                        <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />

                        <h2 className="mt-4 text-lg font-semibold text-foreground">{interviews.length === 0 ? "No interviews yet" : "No interviews found"}</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{interviews.length === 0 ? "Start tracking your interviews by adding your first interview." : "Try changing your search or status filter."}</p>

                        <Button className="mt-6" onClick={() => navigate("/interviews/new")}><Plus className="mr-2 h-4 w-4" />Add Interview</Button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredInterviews.map((interview) => (
                            <div key={interview._id} className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h2 className="font-semibold text-foreground"><Link to={`/interviews/${interview._id}`} className="hover:text-primary hover:underline">{interview.round}</Link></h2>
                                        <p className="mt-1 text-sm text-muted-foreground">{interview.type}</p>
                                    </div>
                                    <StatusBadge status={interview.status} />
                                </div>
                                <div className="mt-6 grid gap-4 border-t border-border/60 pt-6 sm:grid-cols-3">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Interviewer</p>
                                        <p className="mt-1 text-sm font-medium text-foreground">{interview.interviewer || "Not specified"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Scheduled At</p>
                                        <p className="mt-1 text-sm font-medium text-foreground">{interview.scheduledAt ? new Date(interview.scheduledAt).toLocaleString() : "Not scheduled"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    )
}

export default Interviews