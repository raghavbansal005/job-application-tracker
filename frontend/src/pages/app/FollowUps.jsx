import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, CircleAlert, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getFollowUps } from '@/services/followUpService'

import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'

function FollowUps() {
    const navigate = useNavigate()

    const [followUps, setFollowUps] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    const isOverdue = (followUp) => followUp.status === 'Pending' && new Date(followUp.dueDate) < new Date()

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
                        <Button className="w-full sm:w-auto" onClick={() => navigate('/follow-ups/new')}>
                            <Plus className="mr-2 h-4 w-4" />Add Follow-up
                        </Button>
                    } />

                {followUps.length === 0 ? (
                    <div className="rounded-xl border border-border/60 bg-card p-10 text-center shadow-sm">
                        <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground" />

                        <h2 className="mt-4 text-lg font-semibold text-foreground">No follow-ups yet</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Keep track of recruiter messages, thank-you notes, and application updates by adding your first follow-up.</p>

                        <Button className="mt-6" onClick={() => navigate('/follow-ups/new')}>
                            <Plus className="mr-2 h-4 w-4" />Add Follow-up
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {followUps.map((followUp) => {
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
                                                    <Link to={`/follow-ups/${followUp._id}`} className="hover:text-primary hover:underline">
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