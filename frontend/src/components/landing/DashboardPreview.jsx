import { Bell, BriefcaseBusiness, CalendarDays, ChevronDown, Clock3, LayoutDashboard, TrendingUp, UserCheck, Gift } from "lucide-react"

const trendData = [2, 4, 4, 7, 8, 7, 10, 9, 12, 14]
const statusData = [
    { label: "Applied", value: 40, color: "var(--chart-1)" },
    { label: "Interview", value: 30, color: "var(--chart-2)" },
    { label: "Offer", value: 15, color: "var(--chart-3)" },
    { label: "Others", value: 15, color: "var(--chart-4)" },
]
const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Applications", icon: BriefcaseBusiness },
    { label: "Interviews", icon: CalendarDays },
    { label: "Follow-ups", icon: Bell },
]
const stats = [
    { label: "Total Applications", value: 12, icon: TrendingUp, tone: "bg-chart-1/15 text-chart-1" },
    { label: "Interviews", value: 4, icon: UserCheck, tone: "bg-chart-2/15 text-chart-2" },
    { label: "Offers", value: 2, icon: Gift, tone: "bg-chart-3/15 text-chart-3" },
]

const TREND_WIDTH = 200
const TREND_HEIGHT = 70
const DONUT_RADIUS = 38
const DONUT_LENGTH = 2 * Math.PI * DONUT_RADIUS

function TrendChart() {
    const max = Math.max(...trendData)
    const points = trendData.map((value, index) => {
        const x = (index / (trendData.length - 1)) * TREND_WIDTH
        const y = TREND_HEIGHT - (value / max) * (TREND_HEIGHT - 6) - 3
        return [x, y]
    })
    const line = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")
    const area = `${line} L${TREND_WIDTH} ${TREND_HEIGHT} L0 ${TREND_HEIGHT} Z`

    return (
        <svg viewBox={`0 0 ${TREND_WIDTH} ${TREND_HEIGHT}`} className="h-full w-full" preserveAspectRatio="none">
            {[0.25, 0.5, 0.75].map((ratio) => (
                <line key={ratio} x1="0" x2={TREND_WIDTH} y1={TREND_HEIGHT * ratio} y2={TREND_HEIGHT * ratio} stroke="var(--border)" strokeWidth="0.6" />
            ))}
            <path d={area} fill="var(--chart-1)" fillOpacity="0.14" />
            <path d={line} fill="none" stroke="var(--chart-1)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )
}

const donutSegments = statusData.map((item, index) => ({
    ...item, length: (item.value / 100) * DONUT_LENGTH, offset: statusData.slice(0, index).reduce((sum, previous) => sum + (previous.value / 100) * DONUT_LENGTH, 0),
}))

function StatusDonut() {
    return (
        <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
            {donutSegments.map((segment) => (
                <circle key={segment.label} cx="50" cy="50" r={DONUT_RADIUS} fill="none" stroke={segment.color} strokeWidth="14" strokeDasharray={`${segment.length} ${DONUT_LENGTH - segment.length}`} strokeDashoffset={-segment.offset} />
            ))}
        </svg>
    )
}

function DashboardPreview() {
    return (
        <figure className="mx-auto w-full max-w-2xl">
            <div aria-hidden="true" className="origin-center rounded-3xl border border-border/40 bg-card p-3 text-card-foreground shadow-2xl shadow-black/30 lg:[transform:perspective(1800px)_rotateY(-9deg)_rotateX(3deg)]">
                <div className="flex gap-3">
                    <div className="hidden w-32 shrink-0 rounded-2xl bg-muted/60 p-3 sm:block">
                        <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground"><BriefcaseBusiness size={13} /></span>
                            JobTrack
                        </div>
                        <div className="space-y-1">
                            {sidebarItems.map(({ label, icon: Icon, active }) => (
                                <div key={label} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-medium ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                                    <Icon size={13} />{label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-sm font-semibold">Welcome back</p>
                                <p className="text-[11px] text-muted-foreground">Here&rsquo;s your job search overview</p>
                            </div>
                            <span className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] text-muted-foreground">Last 30 days <ChevronDown size={11} /></span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {stats.map(({ label, value, icon: Icon, tone }) => (
                                <div key={label} className="rounded-xl border border-border/60 bg-background p-2.5">
                                    <span className={`mb-1.5 flex h-6 w-6 items-center justify-center rounded-md ${tone}`}><Icon size={13} /></span>
                                    <p className="text-lg font-semibold leading-none">{value}</p>
                                    <p className="mt-1 text-[10px] leading-tight text-muted-foreground">{label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                            <div className="col-span-3 rounded-xl border border-border/60 bg-background p-3">
                                <p className="mb-2 text-[11px] font-semibold">Application Trend</p>
                                <div className="h-20"><TrendChart /></div>
                            </div>
                            <div className="col-span-2 rounded-xl border border-border/60 bg-background p-3">
                                <p className="mb-2 text-[11px] font-semibold">Application Status</p>
                                <div className="flex items-center gap-2">
                                    <StatusDonut />
                                    <ul className="space-y-1">
                                        {statusData.map((item) => (
                                            <li key={item.label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />{item.label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border/60 bg-background p-3">
                            <p className="mb-2 text-[11px] font-semibold">Upcoming Interviews</p>
                            <div className="flex items-center justify-between gap-2 text-[11px]">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-semibold text-primary">A</span>
                                    <div>
                                        <p className="font-medium">Acme Corp</p>
                                        <p className="text-[10px] text-muted-foreground">Software Engineer</p>
                                    </div>
                                </div>
                                <span className="flex items-center gap-1 text-muted-foreground"><Clock3 size={11} />Sample, 10:00 AM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <figcaption className="mt-4 text-center text-xs text-hero-foreground/75">Illustrative preview &middot; Sample data, not a live account.</figcaption>
        </figure>
    )
}

export default DashboardPreview