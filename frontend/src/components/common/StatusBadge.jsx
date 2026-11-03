function StatusBadge({ status }) {
    const statusStyles = {
        Wishlist: "bg-muted text-muted-foreground",
        Applied: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        Screening: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
        Interview: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        Offer: "bg-green-500/10 text-green-600 dark:text-green-400",
        Rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
        Withdrawn: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
        Scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        Completed: "bg-green-500/10 text-green-600 dark:text-green-400",
        Cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
        Pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
        Skipped: "bg-gray-500/10 text-gray-600 dark:text-gray-400"
    }

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status] || "bg-muted text-muted-foreground"}`}>
            {status}
        </span>
    )
}

export default StatusBadge