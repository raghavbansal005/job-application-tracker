import { Bell, BriefcaseBusiness, CalendarDays, Sparkles } from "lucide-react"

const items = [
    { icon: BriefcaseBusiness, title: "Track Applications", description: "Keep all your applications in one place." },
    { icon: CalendarDays, title: "Manage Interviews", description: "Never miss an important interview." },
    { icon: Bell, title: "Never Miss Follow-Ups", description: "Stay on top of your follow-ups and deadlines." },
    { icon: Sparkles, title: "AI Insights", description: "Smart suggestions to improve your search.", badge: "Coming soon" },
]

function FeatureStrip() {
    return (
        <section aria-label="What JobTrack helps with" className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-12">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map(({ icon: Icon, title, description, badge }) => (
                    <li key={title} className="flex items-start gap-4 rounded-2xl border border-hero-foreground/20 bg-hero-foreground/10 p-5 backdrop-blur-sm">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-hero-foreground/15">
                            <Icon size={20} aria-hidden="true" />
                        </span>
                        <div>
                            <h3 className="flex flex-wrap items-center gap-2 text-base font-semibold">
                                {title}{badge && <span className="rounded-full bg-hero-foreground/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">{badge}</span>}
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-hero-foreground/75">{description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default FeatureStrip