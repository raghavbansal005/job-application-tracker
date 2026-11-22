import { Link } from "react-router-dom"
import { ArrowLeft, BriefcaseBusiness, Check } from "lucide-react"

import ThemeToggle from "@/components/common/ThemeToggle"

const benefits = ["Track every application from wishlist to offer", "Keep interviews and follow-ups in one place", "See your progress on a clear dashboard"]
const stages = ["Wishlist", "Applied", "Screening", "Interview", "Offer"]

const heroFocusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-hero"

function AuthLayout({ title, subtitle, children, footer }) {
    return (
        <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-[1fr_1.1fr]">
            <aside aria-label="About JobTrack" className="relative isolate hidden flex-col justify-between overflow-hidden bg-hero p-12 text-hero-foreground lg:flex xl:p-16">
                <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[30rem] w-[30rem] rounded-full bg-primary/40 blur-3xl" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-32 -z-10 h-[26rem] w-[26rem] rounded-full bg-hero-foreground/10 blur-3xl" />

                <Link to="/" aria-label="JobTrack home" className={`flex w-fit items-center gap-2.5 rounded-lg ${heroFocusRing}`}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-hero-foreground text-hero">
                        <BriefcaseBusiness size={22} aria-hidden="true" />
                    </span>
                    <span className="text-xl font-semibold tracking-tight">JobTrack</span>
                </Link>

                <div className="max-w-md">
                    <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Your job search, finally organized.</h2>

                    <ul className="mt-8 space-y-4">
                        {benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-3 text-base text-hero-foreground/85">
                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hero-foreground/15">
                                    <Check size={14} aria-hidden="true" />
                                </span>
                                {benefit}
                            </li>
                        ))}
                    </ul>

                    <div aria-hidden="true" className="mt-10 flex flex-wrap gap-2 rounded-2xl border border-hero-foreground/20 bg-hero-foreground/10 p-4 backdrop-blur-sm">
                        {stages.map((stage, index) => (
                            <span key={stage} className={`rounded-full px-3 py-1.5 text-xs font-medium ${index === 3 ? "bg-hero-foreground text-hero" : "bg-hero-foreground/15"}`}>{stage}</span>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-hero-foreground/70">&copy; {new Date().getFullYear()} JobTrack</p>
            </aside>

            <div className="flex min-h-screen flex-col">
                <div className="flex items-center justify-between px-5 py-5 sm:px-8">
                    <Link to="/" className="flex items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-hero text-hero-foreground lg:hidden"><BriefcaseBusiness size={16} aria-hidden="true" /></span>
                        <span className="font-semibold text-foreground lg:hidden">JobTrack</span>
                        <span className="hidden items-center gap-2 lg:flex"><ArrowLeft size={16} aria-hidden="true" />Back to home</span>
                    </Link>
                    <ThemeToggle />
                </div>

                <div className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-8">
                    <div className="w-full max-w-md">
                        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
                        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

                        <div className="mt-8">{children}</div>

                        {footer && <p className="mt-8 text-center text-sm text-muted-foreground">{footer}</p>}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AuthLayout