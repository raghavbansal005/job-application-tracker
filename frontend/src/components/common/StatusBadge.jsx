function StatusBadge({ status }) {
    const statusStyles = {
        Wishlist: "bg-muted text-muted-foreground",
        Applied: "bg-blue-500/10 text-blue-600",
        Screening: "bg-yellow-500/10 text-yellow-600",
        Interview: "bg-purple-500/10 text-purple-600",
        Offer: "bg-green-500/10 text-green-600",
        Rejected: "bg-red-500/10 text-red-600",
        Withdrawn: "bg-gray-500/10 text-gray-600",
        Scheduled: "bg-blue-500/10 text-blue-600",
        Completed: "bg-green-500/10 text-green-600",
        Cancelled: "bg-red-500/10 text-red-600",
        Pending: "bg-yellow-500/10 text-yellow-600",
        Skipped: "bg-gray-500/10 text-gray-600"
    }

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status] || "bg-muted text-muted-foreground"}`}>
            {status}
        </span>
    )
}

export default StatusBadge