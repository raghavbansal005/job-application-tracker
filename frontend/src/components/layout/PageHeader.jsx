function PageHeader({ title, description, action }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            {action && <div className="w-full sm:w-auto">{action}</div>}
        </div>
    )
}

export default PageHeader