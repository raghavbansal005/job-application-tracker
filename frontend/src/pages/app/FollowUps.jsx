import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { CalendarDays, CircleAlert, Plus, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getFollowUps } from '@/services/followUpService'

import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'

function FollowUps() {
    const navigate = useNavigate()
    const location = useLocation()

    const [followUps, setFollowUps] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(location.state?.message || null)
    const [activeFilter, setActiveFilter] = useState('All')
    const [sortOption, setSortOption] = useState('earliest')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const loadFollowUps = async () => {
            try {
                setLoading(true)
                setError(null)

                const data = await getFollowUps()
                setFollowUps(data.followUps || [])
            }
            catch (error) {
                console.error('Failed to load Follow-ups:', error)
                setError(error.response?.data?.message || 'Failed to load Follow-ups.')
            }
            finally {
                setLoading(false)
            }
        }
        loadFollowUps()
    }, [])

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message)
            navigate(location.pathname, { replace: true, state: null })
        }
    }, [location.pathname, location.state, navigate])

    const isOverdue = (followUp) => followUp.status === 'Pending' && new Date(followUp.dueDate) < new Date()

    const filterOptions = ['All', 'Pending', 'Completed', 'Skipped', 'Overdue']

    const filteredFollowUps = followUps.filter((followUp) => {
        if (activeFilter === 'Overdue') {
            if (!isOverdue(followUp)) return false
        }
        else if (activeFilter !== 'All' && followUp.status !== activeFilter) {
            return false
        }

        const query = searchQuery.trim().toLowerCase()
        if (!query) return true

        const searchableText = [followUp.type, followUp.application?.company, followUp.application?.jobTitle].filter(Boolean).join(' ').toLowerCase()
        return searchableText.includes(query)
    })

    const sortedFollowUps = [...filteredFollowUps].sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime()
        const dateB = new Date(b.dueDate).getTime()

        if (sortOption === 'latest') {
            return dateB - dateA
        }
        if (sortOption === 'overdue') {
            const aOverdue = isOverdue(a)
            const bOverdue = isOverdue(b)

            if (aOverdue !== bOverdue) {
                return aOverdue ? -1 : 1
            }
        }
        return dateA - dateB
    })

    if (loading) {
        return (
            <PageContainer>
                <p className='text-sm text-muted-foreground'>Loading follow-ups...</p>
            </PageContainer>
        )
    }

    if (error) {
        return (
            <PageContainer>
                <p className='text-sm text-destructive'>{error}</p>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <div className="space-y-8">
                <PageHeader title="Follow-ups" description="Manage your application and interview follow-ups."
                    action={
                        <Button className="w-full sm:w-auto" onClick={() => navigate('/followups/new')}>
                            <Plus className="mr-2 h-4 w-4" />Add Follow-up
                        </Button>
                    } />
                <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter follow-ups">
                        {filterOptions.map((filter) => (
                            <Button key={filter} type="button" size="sm" variant={activeFilter === filter ? 'default' : 'outline'} onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter}>
                                {filter}
                            </Button>
                        ))}
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                        <label htmlFor="follow-up-sort" className="whitespace-nowrap text-sm font-medium text-muted-foreground">Sort by</label>
                        <select id="follow-up-sort" value={sortOption} onChange={(event) => setSortOption(event.target.value)}
                            className="w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground sm:w-56">
                            <option value="earliest">Due date: earliest first</option>
                            <option value="latest">Due date: latest first</option>
                            <option value="overdue">Overdue first</option>
                        </select>
                    </div>
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search follow-ups..." aria-label="Search follow-ups by company, job title, or type"
                            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                </div>
                {successMessage && (
                    <div role="status" className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">{successMessage}</div>
                )}

                {filteredFollowUps.length === 0 ? (
                    <div className="rounded-xl border border-border/60 bg-card p-10 text-center shadow-sm">
                        <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground" />

                        <h2 className="mt-4 text-lg font-semibold text-foreground">{followUps.length === 0 ? 'No follow-ups yet' : searchQuery.trim() ? 'No matching follow-ups' : `No ${activeFilter.toLowerCase()} follow-ups`}</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{followUps.length === 0 ? 'Keep track of recruiter messages, thank-you notes, and application updates by adding your first follow-up.' : searchQuery.trim() ? 'Try another company name, job title, or follow-up type.' : 'There are no follow-ups matching this filter. Try selecting another filter.'}</p>
                        <Button className="mt-6" onClick={() => navigate('/followups/new')}>
                            <Plus className="mr-2 h-4 w-4" />Add Follow-up
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {sortedFollowUps.map((followUp) => {
                            const overdue = isOverdue(followUp)
                            return (
                                <div key={followUp._id} className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex min-w-0 items-start gap-3">
                                            {overdue && (
                                                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-label="Overdue" />
                                            )}

                                            <div className="min-w-0">
                                                <h2 className="font-semibold text-foreground">
                                                    <Link to={`/followups/${followUp._id}`} className="hover:text-primary hover:underline">
                                                        {followUp.type}
                                                    </Link>
                                                </h2>

                                                <p className="mt-1 text-sm text-muted-foreground">{followUp.application?.company || 'Unknown company'}{' · '}{followUp.application?.jobTitle || 'Unknown position'}</p>
                                                <p className="mt-3 text-sm text-muted-foreground">Due{' '}{new Date(followUp.dueDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            {overdue && (
                                                <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">Overdue</span>
                                            )}

                                            <StatusBadge status={followUp.status} />
                                        </div>
                                    </div>

                                    {followUp.notes && (
                                        <p className="mt-4 border-t border-border/60 pt-4 text-sm text-muted-foreground">{followUp.notes}</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </PageContainer>
    )
}

export default FollowUps