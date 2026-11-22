import { Link } from 'react-router-dom'
import HeroSection from "@/components/landing/HeroSection"
import { ArrowRight, BarChart3, BriefcaseBusiness, Check, CircleHelp, Clock3, FileText, CalendarDays } from "lucide-react"

const features = [
    {
        icon: BriefcaseBusiness, number: "01", title: "Every application, organized.", color: "bg-chart-1/15 text-chart-1",
        description: "Keep company details, job roles, application dates, and statuses in one organized workspace. No more scattered spreadsheets."
    },
    {
        icon: CalendarDays, number: "02", title: "Walk into interviews prepared.", color: "bg-chart-2/15 text-chart-2",
        description: "Track interview rounds, scheduled dates, meeting links, and important notes so you know what's coming next."
    },
    {
        icon: Clock3, number: "03", title: "Never miss a follow-up.", color: "bg-chart-4/15 text-chart-4",
        description: "Keep track of follow-up reminders and due dates to stay on top of conversations with recruiters."
    },
    {
        icon: BarChart3, number: "04", color: "bg-chart-3/15 text-chart-3", title: "See your progress clearly.",
        description: "Understand your job search with a clearer view of application statuses, interviews, offers, and progress over time."
    }
]

function SectionLabel({ children }) {
    return (
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />{children}
        </div>
    )
}

function LandingPage() {
    return (
        <main className="min-h-screen overflow-hidden bg-background font-sans text-foreground">
            <HeroSection />

            <section id="features" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-2xl">
                        <SectionLabel>Everything in its place</SectionLabel>
                        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-5xl">
                            Less juggling.<br />More forward motion.
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                            A job search has many moving parts. JobTrack helps you bring them together, so you always have a clearer picture of where you stand.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => {
                            const Icon = feature.icon
                            return (
                                <article key={feature.number} className="group rounded-2xl border border-border bg-card p-6 transition duration-200 hover:-translate-y-1 hover:border-ring/40 hover:shadow-xl hover:shadow-foreground/5">
                                    <div className="mb-10 flex items-center justify-between">
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.color}`}>
                                            <Icon size={21} />
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground">{feature.number}</span>
                                    </div>

                                    <h3 className="text-lg font-semibold tracking-tight text-foreground">{feature.title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="scroll-mt-24 border-y border-border bg-muted/50 px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
                    <div>
                        <SectionLabel>A simpler process</SectionLabel>
                        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-5xl">
                            Your job search, <br /> step by step.
                        </h2>
                        <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
                            Build a repeatable routine for your search. Record each opportunity, keep the next action visible, and review your progress when you need to reset your focus.
                        </p>
                        <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                            Build your workspace <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {[
                            { number: "01", title: "Capture an opportunity", text: "Save the company, job title, application date, and current status.", icon: FileText },
                            { number: "02", title: "Keep the next step visible", text: "Record interviews and follow-ups so important dates are easier to manage.", icon: CalendarDays },
                            { number: "03", title: "Review and adjust", text: "Use your dashboard to see your progress and decide what to focus on next.", icon: BarChart3 },
                        ].map((step) => {
                            const Icon = step.icon
                            return (
                                <div key={step.number} className="flex gap-4 rounded-2xl border border-border bg-card p-5 sm:gap-5 sm:p-6">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="mb-1 flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-foreground">{step.title}</h3>
                                            <span className="text-xs text-muted-foreground">{step.number}</span>
                                        </div>
                                        <p className="text-sm leading-6 text-muted-foreground">{step.text}</p>
                                    </div>
                                    <Check size={17} className="mt-1 hidden shrink-0 text-green-600 dark:text-green-400 sm:block" />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section id="about" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
                    <div>
                        <SectionLabel>Built around your journey</SectionLabel>
                        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-5xl">Make space for the work that matters.</h2>
                    </div>

                    <div>
                        <p className="text-base leading-7 text-muted-foreground">
                            JobTrack is designed to give your job search structure without making it feel like another job. Keep the details together, understand what's next, and move through your search with more clarity.
                        </p>
                        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-4">
                            <CircleHelp size={19} className="mt-0.5 shrink-0 text-primary" />
                            <p className="text-sm leading-6 text-muted-foreground">
                                AI-powered resume and job-description insights are planned for a future release. They are not presented here as an already available feature.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-5 pb-24 sm:px-8 sm:pb-28 lg:px-12">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-hero px-6 py-16 text-center text-hero-foreground sm:px-12 sm:py-20">
                    <div className="mx-auto max-w-2xl">
                        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-hero-foreground/15">
                            <BriefcaseBusiness size={23} />
                        </div>
                        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
                            Make your next move <br className="hidden sm:block" /> a little clearer.
                        </h2>
                        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-hero-foreground/80 sm:text-base">
                            Give every application, interview, and follow-up a place of its own. Start building a more organized job search today.
                        </p>
                        <Link to="/register" className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-hero-foreground px-6 py-3.5 text-sm font-semibold text-hero transition hover:opacity-90">
                            Get started with JobTrack <ArrowRight size={17} />
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="border-t border-border px-5 py-8 sm:px-8 lg:px-12">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><BriefcaseBusiness size={16} /></span>
                        <span className="font-semibold tracking-tight text-foreground">JobTrack</span>
                    </Link>

                    <p className="text-xs text-muted-foreground">A clearer way to organize your job search.</p>

                    <div className="flex items-center gap-5 text-sm text-muted-foreground">
                        <Link to="/login" className="transition hover:text-foreground">Log in</Link>
                        <Link to="/register" className="transition hover:text-foreground">Register</Link>
                    </div>
                </div>
                <p className="mx-auto mt-6 max-w-7xl text-xs text-muted-foreground">© {new Date().getFullYear()} JobTrack. All rights reserved.</p>
            </footer>
        </main>
    )
}

export default LandingPage