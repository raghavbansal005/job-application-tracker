import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, ExternalLink, UserRound } from 'lucide-react'

import StatusBadge from "@/components/common/StatusBadge"

function UpcomingInterviews({ interviews }) {
    if (interviews.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Interviews</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className='flex h-[220px] items-center justify-center'>
                        <div className='text-center'>
                            <CalendarDays className='mx-auto mb-3 h-8 w-8 text-muted-foreground' />
                            <p className='text-sm font-medium text-foreground'>No upcoming interviews</p>
                            <p className='mt-1 text-sm text-muted-foreground'>Your scheduled interviews will appear here.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
            </CardHeader>

            <CardContent>
                <div className='space-y-3'>
                    {interviews.map((interview) => (
                        <div key={interview._id} className='rounded-xl border border-border/60 p-4 transition-colors hover:bg-muted/30'>
                            <div className='flex items-start justify-between gap-4'>
                                <div className='min-w-0'>
                                    <h3 className='font-semibold text-foreground'>{interview.round}</h3>
                                    <p className='mt-1 text-sm text-muted-foreground'>{interview.application?.company}{' · '}{interview.application?.jobTitle}</p>
                                </div>
                                <StatusBadge status={interview.status} />
                            </div>
                            <div className='mt-4 grid gap-3 text-sm sm:grid-cols-2'>
                                <div className='flex items-center gap-2 text-muted-foreground'>
                                    <CalendarDays className='h-4 w-4' />
                                    <span>{interview.scheduledAt ? new Date(interview.scheduledAt).toLocaleString() : 'Not Scheduled'}</span>
                                </div>
                                <div className='flex items-center gap-2 text-muted-foreground'>
                                    <UserRound className='h-4 w-4' />
                                    <span>{interview.interviewer || 'Interviewer not specified'}</span>
                                </div>
                            </div>
                            <div className='mt-4 flex items-center justify-between border-t border-border/60 pt-4'>
                                <span className='text-sm text-muted-foreground'>{interview.type} Interview</span>
                                {interview.meetingLink && (
                                    <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className='inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline'>
                                        Join Meeting
                                        <ExternalLink className='h-3.5 w-3.5' />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default UpcomingInterviews