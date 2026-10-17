import { useState } from "react";
import { Link } from 'react-router-dom'
import {
    ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, BriefcaseBusiness, Check, ChevronDown,
    CircleHelp, Clock3, FileText, Menu, Sparkles, Target, X, CalendarDays, Search, Bell
} from "lucide-react";

const features = [
    {
        icon: BriefcaseBusiness, number: "01", title: "Every application, organized.", color: "bg-blue-50 text-blue-700",
        description: "Keep company details, job roles, application dates, and statuses in one organized workspace. No more scattered spreadsheets."
    },
    {
        icon: CalendarDays, number: "02", title: "Walk into interviews prepared.", color: "bg-violet-50 text-violet-700",
        description: "Track interview rounds, scheduled dates, meeting links, and important notes so you know what's coming next."
    },
    {
        icon: Clock3, number: "03", title: "Never miss a follow-up.", color: "bg-amber-50 text-amber-700",
        description: "Keep track of follow-up reminders and due dates to stay on top of conversations with recruiters."
    },
    {
        icon: BarChart3, number: "04", color: "bg-emerald-50 text-emerald-700", title: "See your progress clearly.",
        description: "Understand your job search with a clearer view of application statuses, interviews, offers, and progress over time."
    }
]

const sampleApplications = [
    { company: "Stripe", initials: "S", color: "bg-violet-100 text-violet-700", role: "Frontend Engineer", date: "Oct 14, 2026", status: "Interview", statusStyle: "bg-blue-50 text-blue-700 ring-blue-200" },
    { company: "Notion", initials: "N", color: "bg-neutral-900 text-white", role: "Software Engineer", date: "Oct 12, 2026", status: "Applied", statusStyle: "bg-amber-50 text-amber-700 ring-amber-200" },
    { company: "Linear", initials: "L", color: "bg-indigo-100 text-indigo-700", role: "React Developer", date: "Oct 10, 2026", status: "Offer", statusStyle: "bg-emerald-50 text-emerald-700 ring-emerald-200" }
]

const progressBars = [
    { label: "Applied", count: 12, width: "100%", color: "bg-blue-500" },
    { label: "Interview", count: 5, width: "42%", color: "bg-violet-500" },
    { label: "Offers", count: 2, width: "17%", color: "bg-emerald-500" },
]

function SectionLabel({ children }) {
    return (
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />{children}
        </div>
    )
}

function DashboardPreview() {
    return (
        <div className="mx-auto mt-16 max-w-6xl">
            <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white text-left shadow-xl shadow-neutral-900/[0.06] sm:rounded-3xl">
                <div className="flex h-12 items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 sm:px-6">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>

                    <div className="hidden items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-1.5 text-xs text-neutral-400 sm:flex">
                        <Search size={13} />Search your workspace...
                    </div>

                    <div className="flex items-center gap-3 text-neutral-500">
                        <Bell size={16} />
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">J</div>
                    </div>
                </div>

                <div className="grid min-h-[420px] md:grid-cols-[190px_1fr]">
                    <aside className="hidden border-r border-neutral-200 bg-neutral-50/80 p-4 md:block">
                        <div className="mb-7 flex items-center gap-2 px-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white"><BriefcaseBusiness size={15} /></div>
                            <span className="font-semibold tracking-tight text-neutral-900">JobTrack</span>
                        </div>

                        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Workspace</p>

                        <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-700">
                                <BarChart3 size={15} />Overview
                            </div>
                            <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-neutral-600">
                                <BriefcaseBusiness size={15} />Applications
                            </div>
                            <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-neutral-600">
                                <CalendarDays size={15} />Interviews
                            </div>
                            <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-neutral-600">
                                <Clock3 size={15} />Follow-ups
                            </div>
                        </div>

                        <div className="mt-10 rounded-xl border border-blue-100 bg-blue-50 p-3">
                            <Sparkles size={16} className="mb-2 text-blue-600" />
                            <p className="text-xs font-semibold text-neutral-900">Your next opportunity</p>
                            <p className="mt-1 text-[11px] leading-5 text-neutral-600">Keep your search organized, one step at a time.</p>
                        </div>
                    </aside>

                    <div className="min-w-0 p-4 sm:p-6 md:p-8">
                        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="text-xs text-neutral-500">Your workspace at a glance</p>
                                <h3 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">Your job search</h3>
                                <p className="mt-1 text-xs text-neutral-500 sm:text-sm">A little progress every day adds up.</p>
                            </div>
                            <span className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white">+ Add application</span>
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                            {[
                                { label: "Applications", value: "24", icon: BriefcaseBusiness }, { label: "Interviews", value: "05", icon: CalendarDays },
                                { label: "Offers", value: "02", icon: Target }, { label: "Follow-ups", value: "03", icon: Clock3 },
                            ].map((item) => {
                                const Icon = item.icon
                                return (
                                    <div key={item.label} className="rounded-xl border border-neutral-200 p-3 sm:p-4">
                                        <div className="mb-3 flex items-center justify-between gap-1">
                                            <span className="text-[11px] text-neutral-500 sm:text-xs">{item.label}</span>
                                            <Icon size={14} className="text-neutral-400" />
                                        </div>
                                        <p className="text-2xl font-semibold tracking-tight text-neutral-900">{item.value}</p>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                            <div className="min-w-0 rounded-xl border border-neutral-200 p-3 sm:p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-neutral-900">Recent applications</h4>
                                    <span className="text-xs text-blue-700">View all →</span>
                                </div>

                                <div className="space-y-1">
                                    {sampleApplications.map((app) => (
                                        <div key={app.company} className="flex items-center gap-2 border-b border-neutral-100 py-3 last:border-0 sm:gap-3">
                                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${app.color}`}>
                                                {app.initials}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-medium text-neutral-900">{app.company}</p>
                                                <p className="mt-0.5 truncate text-[10px] text-neutral-500 sm:text-xs">{app.role}</p>
                                            </div>
                                            <span className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-medium ring-1 ring-inset sm:text-[10px] ${app.statusStyle}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl border border-neutral-200 p-3 sm:p-4">
                                <div className="mb-5 flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-neutral-900">Application progress</h4>
                                    <BarChart3 size={15} className="text-neutral-400" />
                                </div>

                                <div className="space-y-5">
                                    {progressBars.map((bar) => (
                                        <div key={bar.label}>
                                            <div className="mb-2 flex items-center justify-between text-xs">
                                                <span className="text-neutral-600">{bar.label}</span>
                                                <span className="font-medium text-neutral-900">{bar.count}</span>
                                            </div>
                                            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                                                <div className={`h-full rounded-full ${bar.color}`} style={{ width: bar.width }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 rounded-lg bg-neutral-50 p-3">
                                    <div className="flex items-start gap-2">
                                        <Clock3 size={15} className="mt-0.5 shrink-0 text-blue-600" />
                                        <div>
                                            <p className="text-xs font-medium text-neutral-800">Next interview</p>
                                            <p className="mt-1 text-[11px] leading-5 text-neutral-500">Frontend Engineer · Upcoming interview</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 text-center text-[10px] text-neutral-400">Illustrative preview · Sample data, not a live account</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false)
    const closeMenu = () => setMenuOpen(false)

    return (
        <main className="min-h-screen overflow-hidden bg-white font-sans text-neutral-900">
            <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/90 backdrop-blur-xl">
                <nav aria-label="Main navigation" className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
                    <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5" aria-label="JobTrack home">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
                            <BriefcaseBusiness size={19} />
                        </span>
                        <span className="text-xl font-semibold tracking-tight">JobTrack</span>
                    </Link>

                    <div className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
                        <a className="transition hover:text-neutral-950" href="#features">Features</a>
                        <a className="transition hover:text-neutral-950" href="#how-it-works">How it works</a>
                        <a className="transition hover:text-neutral-950" href="#about">About</a>
                    </div>

                    <div className="hidden items-center gap-3 md:flex">
                        <Link to="/login" className="rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950">Log in</Link>
                        <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">Get started <ArrowUpRight size={15} /></Link>
                    </div>

                    <button type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 md:hidden">
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </nav>

                {menuOpen && (
                    <div className="border-t border-neutral-200 bg-white px-5 py-5 md:hidden">
                        <div className="mx-auto flex max-w-7xl flex-col gap-1">
                            <a href="#features" onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm text-neutral-700 hover:bg-neutral-50">Features</a>
                            <a href="#how-it-works" onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm text-neutral-700 hover:bg-neutral-50">How it works</a>
                            <a href="#about" onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm text-neutral-700 hover:bg-neutral-50">About</a>

                            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4">
                                <Link to="/login" onClick={closeMenu} className="rounded-lg border border-neutral-200 px-4 py-3 text-center text-sm font-medium">
                                    Log in
                                </Link>
                                <Link to="/register" onClick={closeMenu} className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white">
                                    Get started
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <section className="px-5 pb-8 pt-20 sm:px-8 sm:pt-28 lg:px-12 lg:pt-32">
                <div className="mx-auto max-w-5xl text-center">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-medium text-neutral-600 sm:text-sm">
                        <Sparkles size={15} className="text-blue-600" />
                        A more organized way to job hunt
                        <ChevronDown size={14} className="text-neutral-400" />
                    </div>

                    <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.12] tracking-[-0.045em] text-neutral-950 sm:text-6xl lg:text-7xl">
                        Your next opportunity
                        <br className="hidden sm:block" /> starts with{" "}
                        <span className="text-blue-600">a clear plan.</span>
                    </h1>

                    <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
                        Job searching is a lot to manage. Keep your applications, interviews, and follow-ups together in one workspace—and spend less time organizing, more time moving forward.
                    </p>

                    <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                        <Link to="/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:-translate-y-0.5 hover:bg-blue-700">
                            Start organizing your search <ArrowRight size={17} />
                        </Link>
                        <a href="#features" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
                            Explore features <ArrowDownRight size={16} />
                        </a>
                    </div>

                    <p className="mt-4 text-xs text-neutral-500">Create an account to start tracking your job search.</p>
                </div>

                <DashboardPreview />
            </section>

            <section className="border-y border-neutral-200 bg-neutral-50/70 px-5 py-8 sm:px-8 lg:px-12">
                <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
                    <div>
                        <p className="text-sm font-semibold text-neutral-900">One search. One workspace.</p>
                        <p className="mt-1 text-sm text-neutral-500">Keep the details organized so you can focus on the next step.</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-600 sm:gap-6">
                        <span className="flex items-center gap-2">
                            <Check size={15} className="text-blue-600" /> Applications
                        </span>
                        <span className="flex items-center gap-2">
                            <Check size={15} className="text-blue-600" /> Interviews
                        </span>
                        <span className="flex items-center gap-2">
                            <Check size={15} className="text-blue-600" /> Follow-ups
                        </span>
                    </div>
                </div>
            </section>

            <section id="features" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-2xl">
                        <SectionLabel>Everything in its place</SectionLabel>
                        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-neutral-950 sm:text-5xl">
                            Less juggling.<br />More forward motion.
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600">
                            A job search has many moving parts. JobTrack helps you bring them together, so you always have a clearer picture of where you stand.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => {
                            const Icon = feature.icon
                            return (
                                <article key={feature.number} className="group rounded-2xl border border-neutral-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-900/5">
                                    <div className="mb-10 flex items-center justify-between">
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.color}`}>
                                            <Icon size={21} />
                                        </div>
                                        <span className="text-xs font-medium text-neutral-400">{feature.number}</span>
                                    </div>

                                    <h3 className="text-lg font-semibold tracking-tight text-neutral-900">{feature.title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-neutral-600">{feature.description}</p>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="scroll-mt-24 border-y border-neutral-200 bg-neutral-50 px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
                    <div>
                        <SectionLabel>A simpler process</SectionLabel>
                        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-neutral-950 sm:text-5xl">
                            Your job search, <br /> step by step.
                        </h2>
                        <p className="mt-5 max-w-lg text-base leading-7 text-neutral-600">
                            Build a repeatable routine for your search. Record each opportunity, keep the next action visible, and review your progress when you need to reset your focus.
                        </p>
                        <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
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
                                <div key={step.number} className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5 sm:gap-5 sm:p-6">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="mb-1 flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-neutral-900">{step.title}</h3>
                                            <span className="text-xs text-neutral-400">{step.number}</span>
                                        </div>
                                        <p className="text-sm leading-6 text-neutral-600">{step.text}</p>
                                    </div>
                                    <Check size={17} className="mt-1 hidden shrink-0 text-emerald-600 sm:block" />
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
                        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-neutral-950 sm:text-5xl">Make space for the work that matters.</h2>
                    </div>

                    <div>
                        <p className="text-base leading-7 text-neutral-600">
                            JobTrack is designed to give your job search structure without making it feel like another job. Keep the details together, understand what's next, and move through your search with more clarity.
                        </p>
                        <div className="mt-6 flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                            <CircleHelp size={19} className="mt-0.5 shrink-0 text-blue-600" />
                            <p className="text-sm leading-6 text-neutral-600">
                                AI-powered resume and job-description insights are planned for a future release. They are not presented here as an already available feature.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-5 pb-24 sm:px-8 sm:pb-28 lg:px-12">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-neutral-950 px-6 py-16 text-center sm:px-12 sm:py-20">
                    <div className="mx-auto max-w-2xl">
                        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-blue-300">
                            <BriefcaseBusiness size={23} />
                        </div>
                        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-5xl">
                            Make your next move <br className="hidden sm:block" /> a little clearer.
                        </h2>
                        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-neutral-300 sm:text-base">
                            Give every application, interview, and follow-up a place of its own. Start building a more organized job search today.
                        </p>
                        <Link to="/register" className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-neutral-950 transition hover:bg-blue-50" >
                            Get started with JobTrack <ArrowRight size={17} />
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="border-t border-neutral-200 px-5 py-8 sm:px-8 lg:px-12">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white"><BriefcaseBusiness size={16} /></span>
                        <span className="font-semibold tracking-tight text-neutral-900">JobTrack</span>
                    </Link>

                    <p className="text-xs text-neutral-500">A clearer way to organize your job search.</p>

                    <div className="flex items-center gap-5 text-sm text-neutral-600">
                        <Link to="/login" className="transition hover:text-neutral-950">Log in</Link>
                        <Link to="/register" className="transition hover:text-neutral-950">Register</Link>
                    </div>
                </div>
                <p className="mx-auto mt-6 max-w-7xl text-xs text-neutral-400">© {new Date().getFullYear()} JobTrack. All rights reserved.</p>
            </footer>
        </main>
    )
}

export default LandingPage