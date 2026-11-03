import { useState } from "react"
import { Link } from "react-router-dom"
import { MapPin } from "lucide-react"

import StatusBadge from "@/components/common/StatusBadge"
import { APPLICATION_STATUSES } from "@/lib/applicationStatuses"

function ApplicationBoard({ applications, onStatusChange, updatingIds = [] }) {
    const [dragOverStatus, setDragOverStatus] = useState(null)

    const handleDrop = (event, status) => {
        event.preventDefault()
        setDragOverStatus(null)

        const id = event.dataTransfer.getData("text/plain")
        const application = applications.find((item) => item._id === id)

        if (application && application.status !== status) {
            onStatusChange(application, status)
        }
    }

    return (
        <div role="region" aria-label="Applications board" tabIndex={0} className="flex gap-4 overflow-x-auto pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {APPLICATION_STATUSES.map((status) => {
                const columnApplications = applications.filter((application) => application.status === status)

                return (
                    <section key={status} aria-label={`${status} column`}
                        onDragOver={(event) => {
                            event.preventDefault()
                            setDragOverStatus(status)
                        }}
                        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragOverStatus(null) }}
                        onDrop={(event) => handleDrop(event, status)}
                        className={`flex w-72 shrink-0 flex-col rounded-xl border bg-muted/30 transition-colors ${dragOverStatus === status ? "border-primary bg-primary/5" : "border-border/60"}`}>
                        <header className="flex items-center justify-between p-3">
                            <StatusBadge status={status} />
                            <span className="text-xs font-medium text-muted-foreground">{columnApplications.length}</span>
                        </header>

                        <div className="flex flex-1 flex-col gap-3 p-3 pt-0">
                            {columnApplications.length === 0 ? (
                                <p className="rounded-lg border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">No applications</p>
                            ) : (
                                columnApplications.map((application) => {
                                    const isUpdating = updatingIds.includes(application._id)

                                    return (
                                        <article key={application._id} draggable={!isUpdating} aria-busy={isUpdating}
                                            onDragStart={(event) => {
                                                event.dataTransfer.setData("text/plain", application._id)
                                                event.dataTransfer.effectAllowed = "move"
                                            }}
                                            className={`cursor-grab rounded-lg border border-border/60 bg-card p-3 shadow-sm transition-opacity ${isUpdating ? "opacity-60" : ""}`}>
                                            <Link to={`/applications/${application._id}`} className="block text-sm font-semibold text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                                {application.jobTitle}
                                            </Link>
                                            <p className="mt-0.5 text-sm text-muted-foreground">{application.company}</p>

                                            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                                                {application.location && (
                                                    <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{application.location}</p>
                                                )}
                                                <p>{application.employmentType || "Not specified"}</p>
                                                <p>Applied: {application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : "Not specified"}</p>
                                            </div>

                                            <select value={application.status} disabled={isUpdating} onChange={(event) => onStatusChange(application, event.target.value)}
                                                aria-label={`Change status for ${application.jobTitle} at ${application.company}`}
                                                className="mt-3 h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed">
                                                {APPLICATION_STATUSES.map((option) => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </article>
                                    )
                                })
                            )}
                        </div>
                    </section>
                )
            })}
        </div>
    )
}

export default ApplicationBoard