import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { CheckCircle2, CircleAlert } from 'lucide-react'

function FollowUpList({ followUps, overdueFollowUps }) {
    const allFollowUps = [...overdueFollowUps.map((followUp) => ({ ...followUp, isOverdue: true })),
    ...followUps.filter((followUp) => !overdueFollowUps.some((overdue) => overdue._id === followUp._id)).map((followUp) => ({
        ...followUp, isOverdue: false
    }))]

    if (allFollowUps.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Follow-ups</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className='flex h-[220px] items-center justify-center'>
                        <div className='text-center'>
                            <CheckCircle2 className='mx-auto mb-3 h-8 w-8 text-muted-foreground' />
                            <p className='text-sm font-medium text-foreground'>No pending follow-ups</p>
                            <p className='mt-1 text-sm text-muted-foreground'>You're all caught up.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Follow-ups</CardTitle>
            </CardHeader>

            <CardContent>
                <div className='space-y-3'>
                    {allFollowUps.map((followUp) => (
                        <div key={followUp._id} className='rounded-xl border border-border/60 p-4 transition-colors hover:bg-muted/30'>
                            <div className='flex items-start justify-between gap-4'>
                                <div className='flex min-w-0 items-start gap-3'>
                                    {followUp.isOverdue ? (
                                        <CircleAlert className='mt-0.5 h-5 w-5 shrink-0 text-destructive' />
                                    ) : (
                                        <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0 text-primary' />
                                    )}
                                    <div className='min-w-0'>
                                        <h3 className='font-semibold text-foreground'>{followUp.type}</h3>
                                        <p className='mt-1 text-sm text-muted-foreground'>{followUp.application?.company}{' · '}{followUp.application?.jobTitle}</p>
                                        <p className='mt-2 text-sm text-muted-foreground'>Due{' '} {new Date(followUp.dueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={followUp.isOverdue ? "rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive" : "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"}>
                                    {followUp.isOverdue ? "Overdue" : "Pending"}
                                </span>
                            </div>
                            {followUp.notes && (
                                <p className='mt-3 text-sm text-muted-foreground'>{followUp.notes}</p>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default FollowUpList